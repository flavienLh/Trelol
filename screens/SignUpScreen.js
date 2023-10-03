import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { auth } from '../firebase/Config';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log('Inscription réussie:', userCredential.user);
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
        mode="outlined"
        style={{ marginBottom: 16 }}
      />
      <TextInput
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={{ marginBottom: 16 }}
      />
      <Button mode="contained" onPress={handleSignUp}>
        S'inscrire
      </Button>
    </View>
  );
}

export default SignUpScreen;


