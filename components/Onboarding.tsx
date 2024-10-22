import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import CustomButton from './CustomButton';
import Carousel from './Carousel';
import { router } from 'expo-router';

const { height } = Dimensions.get('window');

const Onboarding = () => {
  const navigation = useNavigation(); // Use the useNavigation hook to access the navigation object

  const handlePress = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <Carousel />
      <CustomButton containerStyle={styles.buttonFixedBottom} title="Get Started" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16, 
    marginVertical: 40,
    height: height - 80,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonFixedBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});

export default Onboarding;
