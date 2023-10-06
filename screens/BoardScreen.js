import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, TouchableOpacity, Dimensions, Modal, TextInput, Alert  } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db, handleDelete } from '../firebase/Config';
import { ref, onValue, update } from 'firebase/database';
import Task from '../components/Task';

const BoardScreen = () => {
  const [columns, setColumns] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { boardId, boardName } = route.params;
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingColumn, setEditingColumn] = useState(null);
  const [newColumnName, setNewColumnName] = useState('');


  useEffect(() => {
    const columnsRef = ref(db, `boards/${boardId}/columns`);
    const unsubscribe = onValue(columnsRef, (snapshot) => {
      try {
        const fetchedColumns = [];
        snapshot.forEach((childSnapshot) => {
          const columnData = childSnapshot.val();
          const tasksArray = columnData.tasks 
            ? Object.keys(columnData.tasks).map(key => ({
                id: key,
                ...columnData.tasks[key],
              }))
            : [];
          fetchedColumns.push({
            id: childSnapshot.key,
            ...columnData,
            tasks: tasksArray,
          });
        });
        setColumns(fetchedColumns);
      } catch (error) {
        console.error("Error fetching columns:", error);
      }
    });
  
    return () => unsubscribe();
  }, []);

  const showEditModal = (column) => {
    setEditingColumn(column);
    setNewColumnName(column.name);
    setIsEditModalVisible(true);
  };

  const navigateToAddColumn = () => {
    navigation.navigate('AddColumn', { boardId });
  };

  const handleLongPress = (column) => {
    Alert.alert(
      "Column Options",
      "Choose an option",
      [
        { text: "Edit", onPress: () => handleEditColumn(column) },
        { text: "Delete", onPress: () => confirmDeleteColumn(boardId, column.id, column.name) },
        { text: "Cancel" }
      ],
      { cancelable: true }
    );
  };

  const handleEditColumn = (column) => {
    showEditModal(column);
  };

  
  const handleEditColumnSubmit = () => {
    if (newColumnName) {
      const columnRef = ref(db, `boards/${boardId}/columns/${editingColumn.id}`);
      update(columnRef, { name: newColumnName });
    }
    setIsEditModalVisible(false);
    setEditingColumn(null);
    setNewColumnName('');
  };

  const deleteColumn = async (boardId, columnId) => {
    try {
      if (!boardId || !columnId) {
        console.error('Invalid board or column reference: ', boardId, columnId);
        alert('Cannot delete column due to invalid reference.');
        return;
      }
      await handleDelete(`boards/${boardId}/columns/${columnId}`);
      console.log('Column deleted!');
    } catch (error) {
      console.error('Error deleting column:', error);
      alert('Error deleting column. Please try again.');
    }
  };
  

  const confirmDeleteColumn = (boardId, columnId, columnName) => {
    Alert.alert(
      "Supprimer la Colonne",
      `Êtes-vous sûr de vouloir supprimer la colonne "${columnName}"?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => deleteColumn(boardId, columnId) }
      ],
      { cancelable: false }
    );
  };
  

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{boardName}</Text>
      <Button title="Add Column" onPress={navigateToAddColumn} />
      <ScrollView horizontal style={styles.columnsContainer}>
        {columns.map((column) => (
          <TouchableOpacity 
            key={column.id} 
            style={styles.column}
            onPress={() => navigation.navigate('AddTask', { boardId, columnId: column.id })}
            onLongPress={() => handleLongPress(column)}
          >
            <Text style={styles.columnTitle}>{column.name}</Text>
            <View style={styles.tasksContainer}>
              {column.tasks?.map((task) => (
                <Task key={task.id} task={task} boardId={boardId} columnId={column.id} />
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Edit Column Name Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setIsEditModalVisible(!isEditModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Edit Column Name</Text>
            <TextInput 
              style={styles.input}
              value={newColumnName}
              onChangeText={setNewColumnName}
            />
            <Button onPress={handleEditColumnSubmit} title="Submit" />
            <Button onPress={() => setIsEditModalVisible(false)} title="Cancel" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5', 
  },
  title: {
    fontSize: 28,  
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3F3F3F', 
  },
  columnsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  column: {
    width: 150,
    padding: 15,  
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    borderRadius: 12,  
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,  
    shadowRadius: 4,
    elevation: 5,
    flex: 1,
  },
  columnTitle: {
    fontSize: 22,  
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3F3F3F',  
  },
  tasksContainer: {
    maxHeight: 200,
    height: windowHeight - 2, 
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: '80%', 
    backgroundColor: "white",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});

export default BoardScreen;



