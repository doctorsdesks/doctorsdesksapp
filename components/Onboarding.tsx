import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';
import Carousal from './Carousal';

const Onboarding = () => {
  const handlePress = () => {
    alert('Button Pressed!');
  };

  return (
    <View style={styles.container}>
      <Carousal />
      <Text style={styles.bodyText}>This is a basic page with a header, some text, and a button.</Text>
      <CustomButton title="Press Me" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16, 
    marginVertical: 32,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  bodyText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Onboarding;
