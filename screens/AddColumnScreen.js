import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../firebase/Config';
import { ref, push, set } from 'firebase/database';

const AddColumnScreen = () => {
  const [columnName, setColumnName] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { boardId } = route.params;

  const handleAddColumn = () => {
    if(columnName.trim() === '') {
      alert('Task name cannot be empty!');
      return;
    }
    const newColumnRef = push(ref(db, `boards/${boardId}/columns`));
    set(newColumnRef, { name: columnName });
    console.log("Column Name:", columnName);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Column Name"
        value={columnName}
        onChangeText={setColumnName}
      />
      <Button title="Add Column" onPress={handleAddColumn} />
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

export default AddColumnScreen;
