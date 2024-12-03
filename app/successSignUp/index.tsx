import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { BackHandler, Dimensions, Image, Text, useColorScheme, View } from 'react-native';
const { height } = Dimensions.get('window');

interface SuccessPageProps {
    onClick: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onClick }) => {
    const colorSchema = useColorScheme();

    useEffect(() => {
        const backAction = () => {
            BackHandler.exitApp()
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    }, []);

    const handleGoToHome = () => {
        router.replace('/dashboard');
    }

    return (
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 38, backgroundColor: colorSchema === 'dark' ? '#0a0a0a' : '#fcfcfc', height: height+38 }}  >
            <View style={{ display: 'flex', marginTop: 184, alignItems: 'center'}} >
                <Image source={colorSchema === 'dark' ? require("../../assets/images/successPageDark.png") : require("../../assets/images/successPage.jpg")} resizeMode='contain' />
                <Text style={{ fontSize: 20, lineHeight: 24, fontWeight: 700, color: '#2DB9B0', marginTop: 32 }}>
                    You have successfully signed up!
                </Text>
            </View>
            <CustomButton width='FULL' title="Go To Home" onPress={handleGoToHome}  />
        </View>
    )
};

export default SuccessPage;