import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you are using Expo
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useAppContext } from '@/context/AppContext';
import { finalText } from './Utils';

interface HeaderProps {
  label: string;
}

const Header: React.FC<HeaderProps> = ({ label }) => {
  const { translations, selectedLanguage } = useAppContext();
  return (
    <ThemedView>
      <ThemedText style={styles.label}>{finalText(label, translations, selectedLanguage)}</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Header;