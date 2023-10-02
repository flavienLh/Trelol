import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { auth } from '../firebase/Config';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Connexion réussie
        console.log('Connexion réussie:', userCredential.user);
      })
      .catch((error) => {
        // Erreur lors de la connexion
        console.error('Erreur lors de la connexion:', error);
      });
  };

  return (
    <View>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput placeholder="Mot de passe" onChangeText={setPassword} value={password} secureTextEntry />
      <Button title="Se connecter" onPress={handleSignIn} />
    </View>
  );
}

export default SignInScreen;
