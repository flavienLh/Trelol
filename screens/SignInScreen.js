import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { auth } from '../firebase/Config';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';

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
      <Button mode="contained" onPress={handleSignIn} style={{ marginBottom: 16 }}>
        Se connecter
      </Button>
      <Button mode="text" onPress={() => navigation.navigate('SignUp')}>
        Pas de compte ? S'inscrire
      </Button>
    </View>
  );
}

export default SignInScreen;
