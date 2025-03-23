import React from 'react';
import { Text } from 'react-native';
import { useAppContext } from '@/context/AppContext';
import { finalText } from './Utils';

interface CustomTextProps {
    text: any;
    textStyle: any;
    multiLingual?: boolean;
}

const CustomText: React.FC<CustomTextProps> = ({ text, textStyle, multiLingual = false }) => {
    const { translations, selectedLanguage } = useAppContext();

    return (
        <Text style={textStyle}>{finalText(text, translations, selectedLanguage)}</Text>
    );
};

export default CustomText;
