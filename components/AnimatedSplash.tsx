import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions, Easing } from 'react-native';

const { width } = Dimensions.get('window');

const AnimatedSplash = ({ onAnimationComplete }: { onAnimationComplete: () => void }) => {
  const loaderScale = useRef(new Animated.Value(0)).current;
  const loaderRotate = useRef(new Animated.Value(0)).current;
  const loaderOpacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // First phase: Loader animation (0-1s)
    const loaderAnimation = Animated.parallel([
      // Scale up from center
      Animated.spring(loaderScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      // Continuous rotation
      Animated.loop(
        Animated.timing(loaderRotate, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
    ]);

    // Second phase: Transition animation (1-1.5s)
    const transitionAnimation = Animated.parallel([
      // Fade out and scale down loader
      Animated.timing(loaderOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(loaderScale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      // Fade in and scale up logo
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]);

    // Run animations in sequence
    loaderAnimation.start();
    setTimeout(() => {
      transitionAnimation.start(() => {
        onAnimationComplete();
      });
    }, 1000);

    return () => {
      loaderAnimation.stop();
      transitionAnimation.stop();
    };
  }, []);

  const rotateInterpolate = loaderRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.imageContainer,
          {
            opacity: loaderOpacity,
            transform: [
              { scale: loaderScale },
              { rotate: rotateInterpolate },
            ],
          },
        ]}
      >
        <Animated.Image
          source={require('../assets/images/loaderImage.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.imageContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Animated.Image
          source={require('../assets/images/logoImage.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 175,
  },
});

export default AnimatedSplash;
