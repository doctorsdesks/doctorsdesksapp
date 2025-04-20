import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import CustomButton from './CustomButton';
import Carousel from './Carousel';
import { router } from 'expo-router';
import { ThemedView } from './ThemedView';

const { height } = Dimensions.get('window');

const Onboarding = () => {

  const handlePress = () => {
    router.push('/login');
  };

  return (
    <ThemedView style={styles.container}>
      <Carousel />
      <View style={styles.buttonContainer}>
        <CustomButton width='FULL' title="Get Started" onPress={handlePress} />
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height,
    position: 'relative',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64, // Increased from 16 to ensure visibility
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 999, // Higher zIndex to ensure it's above everything
  },
});

export default Onboarding;
