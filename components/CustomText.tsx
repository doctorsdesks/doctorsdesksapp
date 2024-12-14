import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { getSecureKey } from './Utils';
import { useAppContext } from '@/context/AppContext';

interface CustomTextProps {
    text: any;
    textStyle: any;
    multiLingual?: boolean;
}

const CustomText: React.FC<CustomTextProps> = ({ text, textStyle, multiLingual = false }) => {
    const { translations } = useAppContext();
    const [selectedLanguage, setSelectedValue] = useState<string>("Hindi");

    useEffect(() => {
        const checkForLanguage = async () => {
            const value: any = await getSecureKey("language");
            setSelectedValue(value);
        }
        checkForLanguage();
    },[])

    return (
        <Text style={textStyle} >{multiLingual && translations ? translations[selectedLanguage][text] ? translations[selectedLanguage][text] : text : text}</Text>
    );
};

export default CustomText;