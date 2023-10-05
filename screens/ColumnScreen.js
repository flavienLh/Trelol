import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../firebase/Config';
import { ref, onValue, push, set, createRef } from 'firebase/database';
import Task from '../components/Task';

const screenWidth = Dimensions.get('window').width;

const ColumnScreen = () => {
  const [tasks, setTasks] = useState({});
  const [newTaskName, setNewTaskName] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { boardId, columnId, columnName } = route.params;

  useEffect(() => {
    const columnsRef = ref(db, `boards/${boardId}/columns`);
    const unsubscribe = onValue(columnsRef, (snapshot) => {
      const columnTasksData = {};
      snapshot.forEach((columnSnapshot) => {
        const columnData = columnSnapshot.val();
        const currentColumnId = columnSnapshot.key;
        if (columnData.tasks) {
          const tasksData = [];
          Object.keys(columnData.tasks).forEach((taskId) => {
            const taskData = columnData.tasks[taskId];
            // Vérifiez si la tâche appartient à la colonne actuelle
            if (taskData.columnId === currentColumnId) {
              tasksData.push({
                id: taskId,
                ...taskData,
              });
            }
          });
          columnTasksData[currentColumnId] = tasksData;
        }
      });
      setTasks(columnTasksData);
    });

    return () => unsubscribe();
  }, [boardId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{columnName}</Text>
      <TextInput
        style={styles.input}
        placeholder="New Task Name"
        value={newTaskName}
        onChangeText={setNewTaskName}
      />
      <Button title="Add Task" onPress={handleAddTask} />
      <ScrollView style={styles.tasksContainer}>
        {tasks[columnId] && tasks[columnId].map((task) => (
          <Task 
            key={task.id} 
            task={task} 
            boardId={boardId} 
            columnId={columnId}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8', // Couleur de fond plus douce
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4a4a4a', // Couleur de texte plus douce
  },
  input: {
    height: 40,
    borderColor: '#ddd', // Bordure plus douce
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
    borderRadius: 5, // Coins arrondis
  },
  tasksContainer: {
    marginTop: 10,
  },
  task: {
    fontSize: 18,
    backgroundColor: '#fff', // Fond blanc
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: '#000', // Ombres pour un effet "levé"
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
});


export default ColumnScreen;



