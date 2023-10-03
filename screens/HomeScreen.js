import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { db } from '../firebase/Config';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [projects, setProjects] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const projectsRef = ref(db, 'projects');
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const fetchedProjects = [];
      snapshot.forEach((childSnapshot) => {
        fetchedProjects.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      setProjects(fetchedProjects);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View>
      {projects.map((project) => (
        <View key={project.id}>
          <Text>{project.name}</Text>
          <Button
            title="Voir le projet"
            onPress={() => navigation.navigate('Project', { projectId: project.id })}
          />
        </View>
      ))}
    </View>
  );
};
export default HomeScreen;