import { View, Text, StyleSheet, Animated, TouchableOpacity } from "react-native";
import { useEffect, useRef } from "react";

interface Props {
  title: string;
  message: string;
  onPress?: () => void;
  onClose: () => void;
}

export default function InAppFloatingBanner({
  title,
  message,
  onPress,
  onClose,
}: Props) {
  const slideAnim = useRef(new Animated.Value(-120)).current;

  useEffect(() => {
    // Slide in
    Animated.timing(slideAnim, {
      toValue: 50,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto dismiss
    const timer = setTimeout(() => {
      hideBanner();
    }, 40000);

    return () => clearTimeout(timer);
  }, []);

  const hideBanner = () => {
    Animated.timing(slideAnim, {
      toValue: -120,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.inner}>
        <View style={styles.dot} />
        <View style={styles.textBox}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F6F3", // from your image
    padding: 14,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#51BFB0", // primary teal
    marginRight: 12,
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontWeight: "700",
    fontSize: 14,
    color: "#333",
  },
  message: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
});
