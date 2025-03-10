import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { getSecureKey } from './Utils';
import { useAppContext } from '@/context/AppContext';

interface CustomTextProps {
    text: any;
    textStyle: any;
    multiLingual?: boolean;
}

const CustomText: React.FC<CustomTextProps> = ({ text, textStyle }) => {
    const { translations } = useAppContext();
    const [selectedLanguage, setSelectedValue] = useState<string>("English");

    useEffect(() => {
        const checkForLanguage = async () => {
            const value: any = await getSecureKey("language");
            setSelectedValue(value);
        }
        checkForLanguage();
    },[])

    const finalText = (text: string) => {
        if (translations && translations[selectedLanguage] && translations[selectedLanguage][text]) {
            return translations[selectedLanguage][text];
        } else {
            return text;
        }
    }

    return (
        <Text style={textStyle} >{finalText(text)}</Text>
    );
};

export default CustomText;