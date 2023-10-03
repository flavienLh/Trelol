import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../firebase/Config';
import { ref, onValue, push, set } from 'firebase/database';

const screenWidth = Dimensions.get('window').width;

const ColumnScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { boardId, columnId, columnName } = route.params;

  useEffect(() => {
    const tasksRef = ref(db, `boards/${boardId}/columns/${columnId}/tasks`);
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const fetchedTasks = [];
      snapshot.forEach((childSnapshot) => {
        fetchedTasks.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      setTasks(fetchedTasks);
    });

    return () => unsubscribe();
  }, []);

  const handleAddTask = () => {
    const tasksRef = ref(db, `boards/${boardId}/columns/${columnId}/tasks`);
    const newTaskRef = push(tasksRef);
    set(newTaskRef, { name: newTaskName });
    setNewTaskName('');
  };

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
        {tasks.map((task) => (
          <Text key={task.id} style={styles.task}>
            {task.name}
          </Text>
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



