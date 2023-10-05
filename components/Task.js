import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Button, TextInput, StyleSheet } from 'react-native';
import { ref, remove, update } from 'firebase/database';
import { db, handleDelete, handleEdit } from '../firebase/Config';
import PropTypes from 'prop-types';

const Task = ({ task, boardId, columnId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newTaskName, setNewTaskName] = useState(task.name);

  const handleTaskDelete = async () => {
    try {
      if (!boardId || !columnId || !task.id) {
        console.error('Invalid references: ', { boardId, columnId, taskId: task.id });
        alert('Cannot delete task due to invalid references.');
        return;
      }
      await handleDelete('boards/' + boardId + '/columns/' + columnId + '/tasks/' + task.id);
      console.log('Task deleted!');
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Error deleting task. Please try again.');
    }
  };

  const handleTaskEdit = async (newName) => {
    try {
        if (!boardId || !columnId || !task.id) {
            console.error('Invalid references: ', { boardId, columnId, taskId: task.id });
            alert('Cannot edit task due to invalid references.');
            return;
        }

        await handleEdit('boards/' + boardId + '/columns/' + columnId + '/tasks/' + task.id, {name:newName});
        console.log('Task updated!');
    } catch (error) {
        console.error('Error editing task:', error);
        alert('Error editing task. Please try again.');
    }
  };

  const handleEditPress = () => {
    setModalVisible(false);  
    setEditModalVisible(true);  
  };

  const handleEditConfirm = () => {
    if (newTaskName.trim() === '') {
      alert('Task name cannot be empty!');
      return;
    }
  
    handleTaskEdit(newTaskName);
    setEditModalVisible(false);
  };

  Task.propTypes = {
    task: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      // Add other task fields as necessary
    }).isRequired,
    boardId: PropTypes.string.isRequired,
    columnId: PropTypes.string.isRequired,
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
            <Button title="Delete" onPress={handleTaskDelete} />
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



