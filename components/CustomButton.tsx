import { useAppContext } from '@/context/AppContext';
import React from 'react';
import { StyleSheet, GestureResponderEvent, Pressable, View } from 'react-native';
import { finalText } from './Utils';
import { ThemedText } from './ThemedText';
import Icon from './Icons';

// Define the prop types for the CustomButton
interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  textColor?: string;
  containerStyle?: object;
  isDisabled?: boolean;
  width?: string;
  multiLingual?: boolean;
  icon?: string;
}

// Functional component definition using the props interface
const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, textColor = '#FFFFFF', containerStyle, isDisabled = false, width = "AUTO", icon }) => {
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
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        {icon && icon !== "" && <Icon type={icon} />}
        <ThemedText style={[styles.buttonText, { color: textColor, marginLeft: icon && icon !== "" ? 8 : 0 }]}>{finalText(title, translations, selectedLanguage)}</ThemedText>
      </View>
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