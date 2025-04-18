import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface CustomSwitchProps {
    isActive: boolean;
    onClick: (value: boolean) => void;
    isDisabled?: boolean;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ isActive, onClick, isDisabled }) => {
    
    return (
        <View style={{ position: 'relative' }} >
            <Pressable 
                style={{ height: 14, width: 40, backgroundColor: isActive ? "#A6D9EC" : "#92949C", borderRadius: 7 }}
                onPress={() => !isDisabled && onClick(isActive)}
            />
            <View 
                style={{ 
                    height: 20, 
                    width: 20, 
                    backgroundColor: isActive ? "#1EA6D6" : "#92949C", 
                    borderRadius: 20, 
                    position: 'absolute', 
                    zIndex: 2, top: -3, 
                    left: isActive ? 20 : 0,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
            />
        </View>
    );
};

export default CustomSwitch;