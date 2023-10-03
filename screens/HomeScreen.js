import React, { useEffect, useState } from 'react';
import { View, ScrollView, Button, StyleSheet } from 'react-native';
import { db } from '../firebase/Config';
import { ref, onValue } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import BoardBanner from '../components/BoardBanner';

const HomeScreen = () => {
  const [boards, setBoards] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const boardsRef = ref(db, 'boards');
    const unsubscribe = onValue(boardsRef, (snapshot) => {
      const fetchedBoards = [];
      snapshot.forEach((childSnapshot) => {
        fetchedBoards.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      setBoards(fetchedBoards);
    });

    return () => unsubscribe();
  }, []);

  const navigateToBoard = (boardId, boardName) => {
    navigation.navigate('Board', { boardId, boardName });
  };

  const navigateToNewProject = () => {
    navigation.navigate('NewProject');
  };

  return (
    <ScrollView style={styles.container}>
      <Button title="Create New Project" onPress={navigateToNewProject} />
      {boards.map((board) => (
        <BoardBanner key={board.id} board={board} navigateToBoard={navigateToBoard} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default HomeScreen;
