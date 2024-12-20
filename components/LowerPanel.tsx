import React from 'react';
import { Dimensions, Pressable, View } from 'react-native';

interface LowerPanelProps {
    children: React.JSX.Element;
    closeLoserPanel: () => void;
}

const LowerPanel: React.FC<LowerPanelProps> = ({ children, closeLoserPanel }) => {
    const { height, width } = Dimensions.get('screen');


    return (
        <Pressable 
            style={{ position: 'absolute', height, zIndex: 9, backgroundColor: "#6E7276", top: 0, width }}
            onPress={closeLoserPanel}
        >
            <Pressable 
                style={{ position: 'absolute', zIndex: 10, bottom: 0, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 20, paddingVertical: 24, backgroundColor: "#fff", width, height: "50%" }} 
                onPress={(e) => e.preventDefault()}
            >
                {children}
            </Pressable>
        </Pressable>
    );
};

export default LowerPanel;