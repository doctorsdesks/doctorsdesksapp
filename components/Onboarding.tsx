import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';
import Carousel from './Carousel';
import { router } from 'expo-router';
import { ThemedView } from './ThemedView';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';


const Onboarding = () => {

  const insets = useSafeAreaInsets();

  const handlePress = () => {
    router.push('/login');
  };

  return (
    <SafeAreaView style={{ flex: 1 }} >
      <ThemedView style={styles.container}>
        <Carousel />
        <View style={[styles.buttonContainer, { bottom: insets.bottom + 16 }]}>
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
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 999, // Higher zIndex to ensure it's above everything
  },
});

export default Onboarding;
