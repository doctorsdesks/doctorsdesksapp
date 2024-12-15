import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Onboarding from '../components/Onboarding';
import { getSecureKey } from '@/components/Utils';
import { router } from 'expo-router';

const OnboardingScreen = () => { 
    const [isReady, setIsReady] = useState<boolean>(false); 

    useEffect(() => {
        const initialize = async () => {
            setIsReady(true);
            await checkForLogin();
        };
        initialize();
    },[])

    const checkForOnBoarding = async () => {
        const value = await getSecureKey("isUserOnBoarded");
        if (value === "true") {
            router.replace("/login");
        }
    }

    const checkForLogin = async () => {
        const value = await getSecureKey("isUserLoggedIn");
        if (value === "true") {
            router.replace("/dashboard");
        } else {
            checkForOnBoarding();
        }
    }

    if (!isReady) {
        return null; 
    }

    return (
        <View>
            <Onboarding />
        </View>
    );
};

export default OnboardingScreen;