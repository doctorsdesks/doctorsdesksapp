import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Onboarding from '../components/Onboarding';
import { getSecureKey } from '@/components/Utils';
import { router } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import Loader from '@/components/Loader';

const OnboardingScreen = () => {
    const { setSelectedLanguage } = useAppContext();
    const [isReady, setIsReady] = useState<boolean>(false);
    const [loader, setLoader] = useState<boolean>(false);

    useEffect(() => {
        const initialize = async () => {
            setIsReady(true);
            setLoader(true);
            await checkForLogin();
        };
        initialize();
    },[])

    const checkForOnBoarding = async () => {
        const value = await getSecureKey("isUserOnBoarded");
        if (value === "true") {
            router.replace("/login");
        } else {
            setLoader(false);
        }
    }

    const checkForLogin = async () => {
        const value = await getSecureKey("isUserLoggedIn");
        if (value === "true") {
            router.replace("/dashboard");
        } else {
            checkForOnBoarding();
        }
        const savedLanguage = await getSecureKey("language");
        if (savedLanguage && savedLanguage !== "") {
            setSelectedLanguage(savedLanguage);
        } else {
            setSelectedLanguage("English");
        }
    }

    if (!isReady) {
        return null; 
    }

    return (
        loader ? <Loader />
        :
            <View>
                <Onboarding />
            </View>
    );
};

export default OnboardingScreen;