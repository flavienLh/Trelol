import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
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
    <View>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput placeholder="Mot de passe" onChangeText={setPassword} value={password} secureTextEntry />
      <Button title="S'inscrire" onPress={handleSignUp} />
    </View>
  );
}

export default SignUpScreen;

