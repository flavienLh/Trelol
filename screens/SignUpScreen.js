import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { auth } from '../firebase/Config';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Inscription réussie:', userCredential.user);
        navigation.navigate('SignIn'); 
      })
      .catch((error) => {
        console.error('Erreur lors de l\'inscription:', error);
      });
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ marginBottom: 16 }}
      />
      <TextInput
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 16 }}
      />
      <Button mode="contained" onPress={handleSignUp} style={{ marginBottom: 16 }}>
        S'inscrire
      </Button>
      <Button mode="text" onPress={() => navigation.navigate('SignIn')}>
        Avez-vous un compte ? Se connecter
      </Button>
    </View>
  );
}

export default SignUpScreen;


