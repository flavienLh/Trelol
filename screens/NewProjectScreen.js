import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { db } from '../firebase/Config';
import { ref, push, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const NewProjectScreen = () => {
  const [projectName, setProjectName] = useState('');
  const navigation = useNavigation();

  const handleCreateProject = () => {
    const newProjectRef = push(ref(db, 'boards'));
    set(newProjectRef, { name: projectName });
    console.log("Project Name:", projectName); 
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Project Name"
        value={projectName}
        onChangeText={setProjectName}
      />
      <Button title="Create Project" onPress={handleCreateProject} />
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

export default NewProjectScreen;


