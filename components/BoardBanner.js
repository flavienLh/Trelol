import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BoardBanner = ({ board, navigateToBoard }) => {
  return (
    <TouchableOpacity onPress={() => navigateToBoard(board.id, board.name)}>
      <View style={styles.banner}>
        <Text style={styles.text}>{board.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#4FC3F7',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  text: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default BoardBanner;
