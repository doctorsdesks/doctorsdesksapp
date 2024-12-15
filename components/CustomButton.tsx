import React from 'react';
import { Text, StyleSheet, GestureResponderEvent, Pressable } from 'react-native';

// Define the prop types for the CustomButton
interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  textColor?: string;
  containerStyle?: object;
  isDisabled?: boolean;
  width?: string;
}

// Functional component definition using the props interface
const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, textColor = '#FFFFFF', containerStyle, isDisabled = false, width = "AUTO" }) => {
  return (
    <Pressable
      style={[
        styles.button,
        { backgroundColor: isDisabled ? '#99E4DF' : '#009688' },
        containerStyle,
        { width: width === "FULL" ? '100%' : width === "HALF" ? "40%" : 'auto' }
      ]}
      onPress={(e) => onPress(e)}
      disabled={isDisabled}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </Pressable>
  );
};

// StyleSheet for the button
const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#009688',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomButton;