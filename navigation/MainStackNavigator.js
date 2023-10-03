import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeTabNavigator from './HomeTabNavigator';
import NewProjectScreen from '../screens/NewProjectScreen'; // Ajoutez cette ligne
import BoardScreen from '../screens/BoardScreen'; // Et celle-ci

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeTabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default MainStackNavigator;
