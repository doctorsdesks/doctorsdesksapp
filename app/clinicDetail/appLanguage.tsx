import CustomText from '@/components/CustomText';
import MainHeader from '@/components/MainHeader';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { finalText } from '@/components/Utils';
import { useAppContext } from '@/context/AppContext';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, Pressable, StyleSheet, View } from 'react-native';

const AppLanguage = () => {
    const { translations, selectedLanguage, setSelectedLanguage } = useAppContext();
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
        <ThemedView style={styles.container} >
            <MainHeader selectedNav='appLanguage' />
            <ThemedText  style={{ fontSize: 16, marginTop: 32, lineHeight: 20, fontWeight: 600 }} >{finalText("Select Language", translations, selectedLanguage)} </ThemedText>
            <View style={{ 
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    rowGap: 12,
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
                            <ThemedText style={{ color: language === selectedLanguage ? "#fff" : "#2DB9B0", fontSize: 14, lineHeight: 20, fontWeight: 600 }} >{finalText(language, translations, selectedLanguage)} </ThemedText>
                        </Pressable>
                    )
                })}
            </View>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 62,
        height: "100%",
        position: 'relative'
    },
});

export default AppLanguage;
