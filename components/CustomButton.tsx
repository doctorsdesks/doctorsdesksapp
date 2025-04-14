import { useAppContext } from '@/context/AppContext';
import React from 'react';
import { Text, StyleSheet, GestureResponderEvent, Pressable } from 'react-native';
import { finalText } from './Utils';
import { ThemedText } from './ThemedText';

// Define the prop types for the CustomButton
interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  textColor?: string;
  containerStyle?: object;
  isDisabled?: boolean;
  width?: string;
  multiLingual?: boolean;
}

// Functional component definition using the props interface
const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, textColor = '#FFFFFF', containerStyle, isDisabled = false, width = "AUTO", multiLingual }) => {
  const { translations, selectedLanguage } = useAppContext();

  return (
    <Pressable
      style={[
        styles.button,
        { backgroundColor: isDisabled ? '#99E4DF' : '#009688' },
        containerStyle,
        { width: width === "FULL" ? '100%' : width === "HALF" ? "46%" : 'auto' }
      ]}
      onPress={(e) => onPress(e)}
      disabled={isDisabled}
    >
      <ThemedText style={[styles.buttonText, { color: textColor }]}>{finalText(title, translations, selectedLanguage)}</ThemedText>
    </Pressable>
  );
};

// StyleSheet for the button
const styles = StyleSheet.create({
  button: {
    padding: 10,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#009688',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomButton;