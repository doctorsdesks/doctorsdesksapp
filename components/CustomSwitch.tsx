import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface CustomSwitchProps {
    isActive: boolean;
    onClick: (value: boolean) => void;
    isDisabled?: boolean;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ isActive, onClick, isDisabled }) => {
    
    return (
        <Pressable style={{ position: 'relative', height: 36, width: 48 }} onPress={() => !isDisabled && onClick(isActive)} >
            <View 
                style={{ height: 20, width: 48, backgroundColor: isActive ? "#A6D9EC" : "#92949C", borderRadius: 7 }}
            />
            <View 
                style={{ 
                    height: 32, 
                    width: 32, 
                    backgroundColor: isActive ? "#1EA6D6" : "#92949C", 
                    borderRadius: 32, 
                    position: 'absolute', 
                    zIndex: 2, top: -6, 
                    left: isActive ? 20 : -2,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
            />
        </Pressable>
    );
};

export default CustomSwitch;