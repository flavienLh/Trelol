import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import NewProjectScreen from './screens/NewProjectScreen';
import BoardScreen from './screens/BoardScreen';
import AddColumnScreen from './screens/AddColumnScreen';
import ColumnScreen from './screens/ColumnScreen';
import AddTaskScreen from './screens/AddTaskScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home1" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const MainStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NewProject" component={NewProjectScreen} />
      <Stack.Screen name="Board" component={BoardScreen} />
      <Stack.Screen name="AddColumn" component={AddColumnScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Column" component={ColumnScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <MainStackNavigator />
    </NavigationContainer>
  );
}