import CustomText from '@/components/CustomText';
import MainHeader from '@/components/MainHeader';
import { getSecureKey, saveSecureKey } from '@/components/Utils';
import { useAppContext } from '@/context/AppContext';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, Pressable, Text, View } from 'react-native';

const AppLanguage = () => {
    const { translations } = useAppContext();
    const { height } = Dimensions.get('window');
    const [languages, setLanguages] = useState<Array<any>>([]);
    const [selectedValue, setSelectedValue] = useState<any>("English");

    useEffect(() => {
        const checkForLanguage = async () => {
            const value: any = await getSecureKey("language");
            setSelectedValue(value);
        }

        const backAction = () => {
            router.replace("/dashboard/profile");
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        checkForLanguage()
        return () => backHandler.remove();
    }, []);



    useEffect(() => {
        if (translations) {
            const currentLanguages = Object.keys(translations);
            setLanguages(currentLanguages)
        }
    },[translations])

    const handleValueChange = (value: string) => {
        setSelectedValue(value);
        saveSecureKey("language", value);
    }

    return (
        <View style={{ marginHorizontal: 16, marginTop: 52, position: 'relative', height }} >
            <MainHeader selectedNav='appLanguage' />
            <CustomText text="Select Language" textStyle={{ fontSize: 16, lineHeight: 20, fontWeight: 600, color: "#32383D" }} multiLingual={true} />
            <View style={{ 
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'row',
                    marginTop: 12
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
                            backgroundColor: language === selectedValue ? "#2DB9B0" : "#fff",
                        }} onPress={() => handleValueChange(language)}>
                            <Text style={{ color: language === selectedValue ? "#fff" : "#2DB9B0", fontSize: 14, lineHeight: 20, fontWeight: 600 }} >{language}</Text>
                        </Pressable>
                    )
                })}
            </View>
        </View>
    );
};

export default AppLanguage;