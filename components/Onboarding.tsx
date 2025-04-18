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
      <CustomButton containerStyle={styles.buttonFixedBottom} title="Get Started" onPress={handlePress} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    height: height,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonFixedBottom: {
    position: 'absolute',
    bottom: 16,
    marginHorizontal: 12,
    left: 0,
    right: 0,
  }
});

export default Onboarding;
