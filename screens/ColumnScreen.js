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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
  },
  tasksContainer: {
    marginTop: 10,
  },
  task: {
    fontSize: 18,
    backgroundColor: '#e0e0e0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});

export default ColumnScreen;



