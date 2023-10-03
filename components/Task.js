import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Task = ({ task }) => {
  return (
    <View style={styles.taskContainer}>
      <Text style={styles.taskText}>{task.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  taskText: {
    fontSize: 16,
  },
});

export default Task;

