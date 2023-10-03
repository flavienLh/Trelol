import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { auth } from '../firebase/Config';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { StyleSheet } from 'react-native';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password) 
      .then((userCredential) => {
        console.log('Connexion réussie:', userCredential.user);
        navigation.navigate('Home');  
      })
      .catch((error) => {
        console.error('Erreur lors de la connexion:', error);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={handleSignIn} style={styles.button}>
        Se connecter
      </Button>
      <Button mode="text" onPress={() => navigation.navigate('SignUp')}>
        Pas de compte ? S'inscrire
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
  input: {
    marginBottom: 16,
    width: '100%',
  },
  button: {
    marginBottom: 16,
  },
});

export default SignInScreen;
