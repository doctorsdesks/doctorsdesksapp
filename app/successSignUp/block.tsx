import Icon from '@/components/Icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { finalText } from '@/components/Utils';
import { Colors } from '@/constants/Colors';
import { useAppContext } from '@/context/AppContext';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { BackHandler, Dimensions, Image, View } from 'react-native';
const { height } = Dimensions.get('window');

interface BlockPageProps {
    onClick: () => void;
}

const BlockPage: React.FC<BlockPageProps> = ({ onClick }) => {
    const { translations, selectedLanguage } = useAppContext();
    const colorSchema = useColorScheme() ?? 'light';
    const { isLoggedFailed } = useLocalSearchParams();

    useEffect(() => {
        const backAction = () => {
            BackHandler.exitApp()
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    }, []);

    const handleGoToHome = () => {
        if (isLoggedFailed === "true") {
            router.replace('/login');
        } else {
            router.replace('/dashboard');
        }
    }

    return (
        <ThemedView style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 38, backgroundColor: colorSchema === 'dark' ? '#0a0a0a' : '#fcfcfc', height: height + 38 }}  >
            <View style={{ display: 'flex', marginTop: 184, alignItems: 'center'}} >
                <View style={{ height: 120, width: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: "#FFE5E5", borderRadius: 100 }} >
                    <Icon type='block' />
                </View>
                <ThemedText style={{ fontSize: 20, lineHeight: 24, fontWeight: 700, marginTop: 32 }}>
                    {finalText("Access Blocked", translations, selectedLanguage)}!
                </ThemedText>
                <ThemedText style={{ fontSize: 16, lineHeight: 22, fontWeight: 500, marginTop: 24, paddingHorizontal: 24, color: Colors[colorSchema].subText, textAlign: 'center' }} >
                    {finalText("Your account has been resticted due to policy violations or user complaints", translations, selectedLanguage)}.
                </ThemedText>
                <ThemedText style={{ fontSize: 16, lineHeight: 22, fontWeight: 500, marginTop: 16, paddingHorizontal: 24, color: Colors[colorSchema].subText, textAlign: 'center' }} >
                    {finalText("For further queries, please email to", translations, selectedLanguage)}.
                </ThemedText>
                <ThemedText type='link' style={{ marginTop: 6, paddingHorizontal: 24, textAlign: 'center' }} >
                    {finalText("support@nirvaanhealth.com", translations, selectedLanguage)}.
                </ThemedText>
            </View>
        </ThemedView>
    )
};

export default BlockPage;