import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { handleAdd } from '../firebase/Config';

const AddTaskScreen = () => {
  const [taskName, setTaskName] = useState('');
  const route = useRoute();
  const navigation = useNavigation();
  const { boardId, columnId } = route.params;

  const addTask = async () => {
    if (taskName.trim() === '') {
      Alert.alert('Error', 'Task name cannot be empty!');
      return;
    }

    try {
      await handleAdd(`boards/${boardId}/columns/${columnId}/tasks`, { name: taskName });
      navigation.goBack();
    } catch (error) {
      console.error("Error adding task:", error);
      Alert.alert('Error', 'Error adding task. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Task</Text>
      <TextInput
        style={styles.input}
        placeholder="Task Name"
        value={taskName}
        onChangeText={setTaskName}
      />
      <Button title="Add Task" onPress={addTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    marginVertical: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default AddTaskScreen;
