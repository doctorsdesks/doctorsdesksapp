import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';
import Carousel from './Carousel';
import { router } from 'expo-router';
import { ThemedView } from './ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';


const Onboarding = () => {

  const handlePress = () => {
    router.push('/login');
  };

  return (
    <SafeAreaView style={{ flex: 1 }} >
      <ThemedView style={styles.container}>
        <Carousel />
        <View style={styles.buttonContainer}>
          <CustomButton width='FULL' title="Get Started" onPress={handlePress} />
        </View>
      </ThemedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16, // Increased from 16 to ensure visibility
    left: 16,
    right: 16,
    paddingBottom: 16,
    alignItems: 'center',
    zIndex: 999, // Higher zIndex to ensure it's above everything
  },
});

export default Onboarding;
