import CustomButton from '@/components/CustomButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { BackHandler, Dimensions, Image, Text, useColorScheme, View } from 'react-native';
const { height } = Dimensions.get('window');

interface SuccessPageProps {
    onClick: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onClick }) => {
    const colorSchema = useColorScheme();
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
        <ThemedView style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 38, backgroundColor: colorSchema === 'dark' ? '#0a0a0a' : '#fcfcfc', height: height+38 }}  >
            <View style={{ display: 'flex', marginTop: 184, alignItems: 'center'}} >
                <Image source={colorSchema === 'dark' ? require("../../assets/images/successPageDark.png") : require("../../assets/images/successPage.jpg")} resizeMode='contain' />
                <ThemedText style={{ fontSize: 20, lineHeight: 24, fontWeight: 700, color: '#2DB9B0', marginTop: 32 }}>
                    You have successfully signed up!
                </ThemedText>
            </View>
            <CustomButton width='FULL' title={isLoggedFailed === "true" ? "Go To Login" : "Go To Home"} onPress={handleGoToHome}  />
        </ThemedView>
    )
};

export default SuccessPage;