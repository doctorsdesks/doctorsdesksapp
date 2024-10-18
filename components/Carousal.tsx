// Carousal.tsx
import React, { useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, Animated } from 'react-native';

const { width } = Dimensions.get('window');

const carouselItems = [
  {
    image: require('../assets/images/onboardingBgImage.jpeg'),
    title: 'Easy Appointment Management',
    description: 'Manage easily patients appointment & stay on top of your schedule.',
  },
  {
    image: require('../assets/images/onboardingBgImage.jpeg'),
    title: 'Second Slide',
    description: 'Description for the second slide.',
  },
];

const Carousal = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: any) => {
    const index = Math.floor(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        scrollEventThrottle={16}
      >
        {carouselItems.map((item, index) => (
          <View style={styles.carouselItem} key={index}>
            <Image source={item.image} style={styles.image} />
            
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.pagination}>
        {carouselItems.map((_, i) => {
          const widthInterpolate = scrollX.interpolate({
            inputRange: [
              (i - 1) * width,
              i * width,
              (i + 1) * width,
            ],
            outputRange: [8, 20, 8],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={i}
              style={[
                styles.paginationDot,
                { width: widthInterpolate },
                i === activeIndex ? styles.paginationDotActive : null,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselItem: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  controlBarContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 20,
    backgroundColor: 'green',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'green',
  },
});

export default Carousal;