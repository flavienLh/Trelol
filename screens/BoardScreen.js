import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase/Config';
import { ref, onValue } from 'firebase/database';

const BoardScreen = ({ route }) => {
  const [columns, setColumns] = useState([]);
  const { boardId, boardName } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    const columnsRef = ref(db, `boards/${boardId}/columns`);
    const unsubscribe = onValue(columnsRef, (snapshot) => {
      const fetchedColumns = [];
      snapshot.forEach((childSnapshot) => {
        const columnData = childSnapshot.val();
        fetchedColumns.push({
          id: childSnapshot.key,
          ...columnData,
        });
      });
      setColumns(fetchedColumns);
    });
    return () => unsubscribe();
  }, [boardId]);

  const navigateToAddTaskScreen = (columnId, columnName) => {
    navigation.navigate('AddTask', { boardId, columnId, columnName });
  };

  const renderColumn = ({ item }) => (
    <TouchableOpacity
      style={styles.columnCard}
      onPress={() => navigateToAddTaskScreen(item.id, item.name)}
    >
      <Text style={styles.columnTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{boardName}</Text>
      <FlatList
        data={columns}
        renderItem={renderColumn}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4fc3f7',
  },
  list: {
    flexDirection: 'row',
  },
  columnCard: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 8,
    borderRadius: 8,
    width: 150,
    height: '80%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4fc3f7',
    marginBottom: 12,
  },
});

export default BoardScreen;




