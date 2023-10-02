import React from 'react';
import { View, Text } from 'react-native';
import Column from '../components/Column';

const HomeScreen = () => {
  const columns = []; // Récupérez vos colonnes depuis Firebase

  return (
    <View>
      {columns.map(column => <Column key={column.id} column={column} />)}
    </View>
  );
}

export default HomeScreen;