import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Button, TextInput, StyleSheet } from 'react-native';
import { ref, remove, update, onValue, off } from 'firebase/database';
import { db } from '../firebase/Config';

const Task = ({ task, boardId, columnId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newTaskName, setNewTaskName] = useState(task.name);

  const handleEdit = (newName) => {
    const taskRef = ref(db, `boards/${boardId}/columns/${columnId}/tasks/${task.id}`);
    update(taskRef, { name: newName })
      .then(() => {
        console.log('Task updated!');
        setNewTaskName(newName); // Update the local state after the DB update
      })
      .catch((error) => {
        console.error('Error updating task:', error);
      });
  };
  

  const handleDelete = () => {
    const taskRef = ref(db, `boards/${boardId}/columns/${columnId}/tasks/${task.id}`);
    remove(taskRef)
      .then(() => {
        console.log('Task deleted!');
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
      });
  };

  

  const handleEditPress = () => {
    console.log('Edit Pressed');
    setModalVisible(false);  
    setEditModalVisible(true);  
  };

  const handleEditConfirm = () => {
    if (newTaskName.trim() === '') {
      alert('Task name cannot be empty!');
      return;
    }
  
    handleEdit(newTaskName);
    setEditModalVisible(false);
  };



  return (
    <View style={styles.taskContainer}>
      <Text style={styles.taskText}>{newTaskName}</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.menuButton}>
        <Text style={styles.menuButtonText}>...</Text>
      </TouchableOpacity>

      {/* Task Options Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Button title="Edit" onPress={handleEditPress} />
            <Button title="Delete" onPress={handleDelete} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => {
          setEditModalVisible(!editModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="New Task Name"
              value={newTaskName}
              onChangeText={setNewTaskName}
            />
            <Button title="Confirm" onPress={handleEditConfirm} />
            <Button title="Cancel" onPress={() => setEditModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    backgroundColor: '#e0e0e0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  taskText: {
    fontSize: 16,
    flex: 1,
  },
  menuButton: {
    padding: 10,
  },
  menuButtonText: {
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: 200, // or adjust according to your needs
    textAlign: 'center',
  },
});

export default Task;



