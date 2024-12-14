import React from 'react';
import { Text, StyleSheet, GestureResponderEvent, Pressable, View } from 'react-native';
import Icon from './Icon';

// Define the prop types for the CustomButton
interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  textColor?: string;
  containerStyle?: object;
  isDisabled?: boolean;
  width?: string;
  iconType?: string;
}

// Functional component definition using the props interface
const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, textColor = '#FFFFFF', containerStyle, isDisabled = false, width = "AUTO", iconType }) => {
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
      <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
        <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
        {iconType && 
          <View style={{ marginLeft: 8 }}>
            <Icon iconType={iconType} />
          </View>
        }
      </View>
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