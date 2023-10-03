import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../firebase/Config';
import { ref, push, set } from 'firebase/database';

const AddTaskScreen = () => {
  const [taskName, setTaskName] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { boardId, columnId } = route.params;

  const handleAddTask = () => {
    const newTaskRef = push(ref(db, `boards/${boardId}/columns/${columnId}/tasks`));
    set(newTaskRef, { name: taskName });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Task Name"
        value={taskName}
        onChangeText={setTaskName}
      />
      <Button title="Add Task" onPress={handleAddTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
  },
});

export default AddTaskScreen;
