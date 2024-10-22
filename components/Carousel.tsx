import React, { useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, Animated } from 'react-native';

const { width } = Dimensions.get('window');

const carouselItems = [
  {
    image: require('../assets/images/caldendar.png'),
    title: 'Easy Appointment Management',
    description: 'Manage easily patients appointment & stay on top of your schedule.',
  },
  {
    image: require('../assets/images/Girl_doctor.png'),
    title: 'Second Slide',
    description: 'Description for the second slide.',
  },
  {
    image: require('../assets/images/caldendar.png'),
    title: 'Easy Appointment Management',
    description: 'Manage easily patients appointment & stay on top of your schedule.',
  },
  {
    image: require('../assets/images/Girl_doctor.png'),
    title: 'Second Slide',
    description: 'Description for the fourth slide.',
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
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={width}
        decelerationRate="fast"
        snapToAlignment="center"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        scrollEventThrottle={16} // Change from 280 to 16 for smoother event updates
      >
        {carouselItems.map((item, index) => (
          <View style={styles.carouselItem} key={index}>
            <Image source={item.image} style={styles.image} resizeMode='contain' />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.animatedBarContainer}>
        {carouselItems.map((_, index) => {
          const widthAnimated = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 80,
    maxHeight: 432,
  },
  carouselItem: {
    width: width - 32,
    alignItems: 'center',
    marginRight: 32,
    marginLeft: 12,
    maxHeight: 432,
  },
  image: {
    width: width - 32,
    height: 250,
    marginBottom: 64,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 32,
    color: '#32383D',
  },
  description: {
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 24,
    color: '#8C8C8C',
  },
  animatedBarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bar: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default Carousel;
