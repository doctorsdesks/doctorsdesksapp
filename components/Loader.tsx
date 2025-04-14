import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text, Easing, Dimensions, Image } from 'react-native';
import { ThemedView } from './ThemedView';

const {height, width} = Dimensions.get('window');

const Loader = () => {
  const rotateValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Scale animation from center
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7
    }).start();

    // Continuous rotation animation
    const startRotation = () => {
      Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.bezier(0.45, 0, 0.55, 1),
        })
      ).start();
    };

    startRotation();
  }, [rotateValue, scaleValue]);

  // Interpolate rotation value to degrees
  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animatedStyle = {
    transform: [
      { scale: scaleValue },
      { rotate: rotateInterpolate }
    ],
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.View style={[styles.loaderContainer, animatedStyle]}>
        <View style={styles.loader} />
        <View style={styles.textWrapper}>
          <Image 
            source={require('../assets/images/loaderImage.png')} 
            style={styles.image} 
            resizeMode='contain' 
          />
        </View>
      </Animated.View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 50,
    height: "100%",
    width,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: '#2DB9B0',
    borderTopColor: 'transparent',
    position: 'absolute',
  },
  textWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
  },
  image: {
    height: 175,
    width: 200
  }
});

export default Loader;
