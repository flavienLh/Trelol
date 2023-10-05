import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../firebase/Config';
import { ref, onValue } from 'firebase/database';
import Task from '../components/Task';

const BoardScreen = () => {
  const [columns, setColumns] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { boardId, boardName } = route.params;

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
            <ScrollView style={styles.tasksContainer}>
              {column.tasks?.map((task) => (
                <Task key={task.id} task={task} boardId={boardId} columnId={column.id} />
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
    backgroundColor: '#f8f8f8', // Ajout d'une couleur de fond claire
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4a4a4a', // Couleur de texte plus douce
  },
  columnsContainer: {
    flexDirection: 'row',
  },
  column: {
    width: 150,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd', // Bordure plus douce
    marginRight: 10,
    borderRadius: 5, // Coins arrondis
    backgroundColor: '#fff', // Fond blanc pour les colonnes
    shadowColor: '#000', // Ombres pour un effet "levé"
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3, 
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4a4a4a',
  },
  tasksContainer: {
    maxHeight: 200, 
  },
});


export default BoardScreen;



