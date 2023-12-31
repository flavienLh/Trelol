import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, handleDelete } from '../firebase/Config';
import { ref, onValue } from 'firebase/database';

const HomeScreen = () => {
  const [boards, setBoards] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const boardsRef = ref(db, 'boards');
    const unsubscribe = onValue(boardsRef, (snapshot) => {
      const fetchedBoards = [];
      snapshot.forEach((childSnapshot) => {
        const boardData = childSnapshot.val();
        fetchedBoards.push({
          id: childSnapshot.key,
          ...boardData,
        });
      });
      setBoards(fetchedBoards);
    });

    return () => unsubscribe();
  }, []);

  const navigateToBoard = (boardId, boardName) => {
    navigation.navigate('Board', { boardId, boardName });
  };

  const deleteBoard = async (boardId) => {
    try {
      if (!boardId) {
        console.error('Invalid board reference: ', boardId);
        alert('Cannot delete board due to invalid reference.');
        return;
      }
      await handleDelete(`boards/${boardId}`);
      console.log('Board deleted!');
    } catch (error) {
      console.error('Error deleting board:', error);
      alert('Error deleting board. Please try again.');
    }
  };

  const confirmDeleteBoard = (boardId, boardName) => {
    Alert.alert(
      "Supprimer le Board",
      `Êtes-vous sûr de vouloir supprimer le board "${boardName}"?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => deleteBoard(boardId) }
      ],
      { cancelable: false }
    );
  };

  const renderBoard = ({ item }) => (
    <TouchableOpacity
      style={styles.boardCard}
      onPress={() => navigateToBoard(item.id, item.name)}
      onLongPress={() => confirmDeleteBoard(item.id, item.name)}
    >
      <Text style={styles.boardTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Boards</Text>
      <FlatList
        data={boards}
        renderItem={renderBoard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={styles.createBoardButton}
        onPress={() => navigation.navigate('NewProject')}  
      >
        <Text style={styles.createBoardButtonText}>Create New Board</Text>
      </TouchableOpacity>
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
  list: {
    alignItems: 'center',
  },
  boardCard: {
    backgroundColor: '#4fc3f7',
    padding: 16,
    margin: 8,
    borderRadius: 8,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  createBoardButton: {
    backgroundColor: '#4caf50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  createBoardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;

