import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { auth } from '../firebase/Config'; 
import { useNavigation } from '@react-navigation/native';


const ProfileScreen = () => {
  const [userEmail, setUserEmail] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        console.log('Déconnexion réussie');
        navigation.navigate('SignIn');
      })
      .catch((error) => {
        console.error('Erreur lors de la déconnexion:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <Text style={styles.email}>Email: {userEmail}</Text>
      <Button mode="contained" onPress={handleSignOut} style={styles.button}>
        Se déconnecter
      </Button>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 18,
    marginBottom: 40,
  },
  button: {
    marginTop: 16,
  },
});

export default ProfileScreen;