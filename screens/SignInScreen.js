import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { auth } from '../firebase/Config';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log('Connexion réussie:', userCredential.user);
      })
      .catch((error) => {
        console.error('Erreur lors de la connexion:', error);
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
      <Button mode="contained" onPress={handleSignIn}>
        Se connecter
      </Button>
    </View>
  );
}

export default SignInScreen;
