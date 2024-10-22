import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you are using Expo

interface HeaderProps {
  label: string;
}

const Header: React.FC<HeaderProps> = ({ label }) => {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#32383D',
  },
});

export default Header;