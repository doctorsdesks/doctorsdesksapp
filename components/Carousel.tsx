import React, { useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, Animated } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

const { width, height } = Dimensions.get('window');

const carouselItems = [
  {
    image: require('../assets/images/caldendar.png'),
    title: 'Easy Appointment Management',
    description: 'Manage easily patients appointment & stay on top of your schedule.',
  },
  {
    image: require('../assets/images/Girl_doctor.png'),
    title: 'Emergency Appointment',
    description: 'Track emergency appointments in real-time for instant medical attention when every second counts.',
  },
  {
    image: require('../assets/images/caldendar.png'),
    title: 'Choose Your Personal Time',
    description: 'Easily lock appointment slots to reserve personal time and avoid unexpected bookings.',
  },
  {
    image: require('../assets/images/Girl_doctor.png'),
    title: 'Multilingual Support',
    description: 'Communicate effortlessly with built-in multilingual support for a seamless user experience.',
  },
];

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setActiveIndex(currentIndex);
  };

  return (
    <ThemedView style={[styles.container]}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={width - 24}
        decelerationRate="fast"
        snapToAlignment="center"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        scrollEventThrottle={16} // Change from 280 to 16 for smoother event updates
      >
        {carouselItems.map((item, index) => (
          <View style={[styles.carouselItem, { height: height * 0.7 }]} key={index}>
            <Image source={item.image} style={styles.image} resizeMode='contain' />
            <ThemedText type='title' style={{ marginBottom: 12 }} >{item?.title}</ThemedText>
            <ThemedText type='subtitle' lightColor='#8C8C8C' darkColor='#8C8C8C' style={{ marginBottom: 12, marginHorizontal: 24 }}>{item.description}</ThemedText>
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.animatedBarContainer}>
        {carouselItems.map((_, index) => {
          const widthAnimated = scrollX.interpolate({
            inputRange: [
              (index - 1) * (width - 24),
              index * (width - 24),
              (index + 1) * (width - 24),
            ],
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.bar,
                {
                  width: widthAnimated,
                  backgroundColor: activeIndex === index ? '#2DB9B0' : '#D9D9D9',
                },
              ]}
            />
          );
        })}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 12
  },
  carouselItem: {
    width: width - 24,
    alignItems: 'center',
  },
  image: {
    width: width - 24,
    height: height * 0.5,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  animatedBarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    top: height * 0.7,
    width: '100%',
    alignSelf: 'center',
  },
  bar: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default Carousel;
