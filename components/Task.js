import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Button, TextInput, StyleSheet, ScrollView} from 'react-native';
import { ref, remove, update, onValue } from 'firebase/database';
import { db, handleDelete, handleEdit, getColumn } from '../firebase/Config';
import PropTypes from 'prop-types';
import RNPickerSelect from 'react-native-picker-select';

const Task = ({ task, boardId, columnId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newTaskName, setNewTaskName] = useState(task.name);
  const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
  const [newDescription, setNewDescription] = useState(task.description || '');
  const [descriptionEditModalVisible, setDescriptionEditModalVisible] = useState(false);
  const [newColumnId, setNewColumnId] = useState('');
  const [moveModalVisible, setMoveModalVisible] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState('');
  const [columns, setColumns] = useState([]);

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
  }, [boardId]);

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
    }).isRequired,
    boardId: PropTypes.string.isRequired,
    columnId: PropTypes.string.isRequired,
  };

  const handleDescriptionPress = () => {
    setDescriptionModalVisible(true);
  };

  const handleDescriptionEdit = async () => {
    try {
        if (!boardId || !columnId || !task.id) {
            console.error('Invalid references: ', { boardId, columnId, taskId: task.id });
            alert('Cannot edit task due to invalid references.');
            return;
        }

        await handleEdit('boards/' + boardId + '/columns/' + columnId + '/tasks/' + task.id, {description: newDescription});
        console.log('Description updated!');
    } catch (error) {
        console.error('Error editing description:', error);
        alert('Error editing description. Please try again.');
    }
};

const handleMovePress = () => {
  setDescriptionModalVisible(false);
  setMoveModalVisible(true);
};

const handleMove = async (boardId, fromColumnId, toColumnId, taskId, task) => {
  try {
    if (!boardId || !fromColumnId || !toColumnId || !taskId || !task) {
      console.error('Invalid IDs:', { boardId, fromColumnId, toColumnId, taskId });
      alert('Cannot move task due to invalid IDs.');
      return;
    }

    const fromPath = `boards/${boardId}/columns/${fromColumnId}/tasks/${taskId}`;
    const toPath = `boards/${boardId}/columns/${toColumnId}/tasks/${taskId}`;

    
    const updates = {};
    updates[fromPath] = null; 
    updates[toPath] = task;  

    await update(ref(db), updates);
    console.log('Task moved successfully!');
  } catch (error) {
    console.error('Error moving task:', error);
    alert('Error moving task. Please try again.');
  }
};

const handleMoveTask = async () => {
  try {
    if (!boardId || !columnId || !selectedColumnId || !task.id) {
      console.error('Invalid references: ', { boardId, columnId, selectedColumnId, taskId: task.id });
      alert('Cannot move task due to invalid references.');
      return;
    }
    
    await handleMove(boardId, columnId, selectedColumnId, task.id, task);
    
    console.log('Task moved!');
    setMoveModalVisible(false);
  } catch (error) {
    console.error('Error moving task:', error);
    alert('Error moving task. Please try again.');
  }
};

return (
  <View style={styles.taskContainer}>
    <TouchableOpacity onPress={handleDescriptionPress}>
      <Text style={styles.taskText}>{newTaskName}</Text>
    </TouchableOpacity>
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
          <Button title="Edit Name" onPress={handleEditPress} />
          <Button title="Edit Description" onPress={() => {
            setDescriptionEditModalVisible(true);
            setModalVisible(false);
          }} />
          <Button title="Delete" onPress={handleTaskDelete} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </View>
    </Modal>

    {/* Edit Task Name Modal */}
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

    {/* View Description Modal */}
    <Modal
      animationType="slide"
      transparent={true}
      visible={descriptionModalVisible}
      onRequestClose={() => {
        setDescriptionModalVisible(!descriptionModalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>{task.description || "No description available."}</Text>
          <Button title="Close" onPress={() => setDescriptionModalVisible(false)} />
          <Button title="Move" onPress={handleMovePress} />
        </View>
      </View>
    </Modal>

    {/* Edit Description Modal */}
    <Modal
      animationType="slide"
      transparent={true}
      visible={descriptionEditModalVisible}
      onRequestClose={() => {
        setDescriptionEditModalVisible(!descriptionEditModalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="Enter description"
            value={newDescription}
            onChangeText={setNewDescription}
          />
          <Button title="Confirm" onPress={() => {
            handleDescriptionEdit();
            setDescriptionEditModalVisible(false);
          }} />
          <Button title="Cancel" onPress={() => setDescriptionEditModalVisible(false)} />
        </View>
      </View>
    </Modal>
    {/* Move Task Modal */}
    <Modal
      animationType="slide"
      transparent={true}
      visible={moveModalVisible}
      onRequestClose={() => {
        setMoveModalVisible(!moveModalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>Select a column to move the task to:</Text>
          <ScrollView style={{ maxHeight: 200 }}>
            {/* Wrap all Text elements within a View */}
            {columns.length > 0 ? (
              columns.map((column, key) => (
                <TouchableOpacity
                  key={column.id} 
                  onPress={() => setSelectedColumnId(column.id)}>
                  <Text
                  style={{
                      backgroundColor: '#007bff', 
                      color: 'white', 
                      padding: 10, 
                      marginVertical: 5, 
                      borderRadius: 5, 
                      textAlign: 'center', 
                    }}>{column.name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>No columns available</Text>
            )}
          </ScrollView>
          <Button title="Confirm" onPress={handleMoveTask} />
          <Button title="Cancel" onPress={() => setMoveModalVisible(false)} />
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
    width: 200, 
    textAlign: 'center',
  },
  enteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    width: '100%',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, 
    width: '100%',
  },
});

export default Task;



