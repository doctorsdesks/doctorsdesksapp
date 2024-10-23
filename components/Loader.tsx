import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text, Easing, Dimensions } from 'react-native';

const {height, width} = Dimensions.get('window');

const Loader = () => {
  // Create an animated value to rotate the loader
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Define the animation: rotating from 0 to 1 (equivalent to 0 to 360 degrees)
    const startRotation = () => {
      Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1, // This corresponds to 360 degrees
          duration: 3000, // Animation duration (1 second)
          useNativeDriver: true, // Improves performance
          easing: Easing.linear, // Smooth linear motion
        })
      ).start();
    };

    startRotation();
  }, [rotateValue]);

  // Interpolate rotation value to degrees
  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  return (
    <View style={styles.container}>
      {/* Rotating container for both loader and text */}
      <Animated.View style={[styles.loaderContainer, animatedStyle]}>
        {/* Circular Loader */}
        <View style={styles.loader} />
        
        {/* "DD" text in the center */}
        <View style={styles.textWrapper}>
          <Text style={styles.text}>DD</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    zIndex: 5,
    height,
    width,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: 80, // Set your desired size
    height: 80,
    borderRadius: 40, // Half of width and height to make it circular
    borderWidth: 5, // The thickness of the loader
    borderColor: '#2DB9B0', // The color of the loader
    borderTopColor: 'transparent', // Making it look like a circular arc
    position: 'absolute', // Position it absolutely to center it
  },
  textWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80, // Same size as loader
    height: 80,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2DB9B0', // Text color
  },
});

export default Loader;
