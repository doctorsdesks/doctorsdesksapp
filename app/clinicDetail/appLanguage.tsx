import CustomText from '@/components/CustomText';
import MainHeader from '@/components/MainHeader';
import { useAppContext } from '@/context/AppContext';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, Pressable, View } from 'react-native';

const AppLanguage = () => {
    const { translations, selectedLanguage, setSelectedLanguage } = useAppContext();
    const { height } = Dimensions.get('window');
    const [languages, setLanguages] = useState<Array<any>>([]);

    useEffect(() => {
        const backAction = () => {
            router.replace("/dashboard/profile");
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, []);



    useEffect(() => {
        if (translations) {
            const currentLanguages = Object.keys(translations);
            setLanguages(currentLanguages)
        }
    },[translations])

    const handleValueChange = (value: string) => {
        setSelectedLanguage(value);
    }

    return (
        <View style={{ marginHorizontal: 16, marginTop: 52, position: 'relative', height }} >
            <MainHeader selectedNav='appLanguage' />
            <CustomText text="Select Language" textStyle={{ fontSize: 16, marginTop: 32, lineHeight: 20, fontWeight: 600, color: "#32383D" }} multiLingual={true} />
            <View style={{ 
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'row',
                    marginTop: 28
                }}>
                {languages?.map((language: string) => {
                    return (
                        <Pressable key={language} style={{ 
                            borderWidth: 1, 
                            borderRadius: 20, 
                            borderColor: "#2DB9B0", 
                            paddingHorizontal: 12, 
                            paddingVertical: 6, 
                            marginRight: 8,
                            height: 34,
                            backgroundColor: language === selectedLanguage ? "#2DB9B0" : "#fff",
                        }} onPress={() => handleValueChange(language)}>
                            <CustomText text={language} textStyle={{ color: language === selectedLanguage ? "#fff" : "#2DB9B0", fontSize: 14, lineHeight: 20, fontWeight: 600 }} multiLingual={true} />
                        </Pressable>
                    )
                })}
            </View>
        </View>
    );
};

export default AppLanguage;
