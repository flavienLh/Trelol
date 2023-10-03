import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../firebase/Config';
import { ref, onValue } from 'firebase/database';
import Task from '../components/Task'; // Assurez-vous que ce composant est bien défini

const BoardScreen = () => {
  const [columns, setColumns] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { boardId, boardName } = route.params;

  useEffect(() => {
    const columnsRef = ref(db, `boards/${boardId}/columns`);
    const unsubscribe = onValue(columnsRef, (snapshot) => {
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
    });
  
    return () => unsubscribe();
  }, []);

  const navigateToAddColumn = () => {
    navigation.navigate('AddColumn', { boardId });
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
          >
            <Text style={styles.columnTitle}>{column.name}</Text>
            {/* Display tasks */}
            <ScrollView style={styles.tasksContainer}>
              {column.tasks?.map((task, index) => (
                <Task key={index} task={task} />
              ))}
            </ScrollView>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  columnsContainer: {
    flexDirection: 'row',
  },
  column: {
    width: 150, // or adjust according to your needs
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tasksContainer: {
    maxHeight: 200, 
  },
});

export default BoardScreen;



