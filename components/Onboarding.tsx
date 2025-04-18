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
      <View style={{ display: "flex", alignItems: "center", position: 'absolute', bottom: 16, right: 16, left: 16, zIndex: 2 }} >
        <CustomButton width='FULL' title="Get Started" onPress={handlePress} />
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    height: height,
    position: 'relative',
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
