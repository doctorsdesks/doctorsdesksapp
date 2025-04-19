import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Onboarding from '../components/Onboarding';
import { getSecureKey, getTranslations } from '@/components/Utils';
import { router } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import Loader from '@/components/Loader';
import Toast from 'react-native-toast-message';
import { ThemedView } from '@/components/ThemedView';

const OnboardingScreen = () => {
    const { setSelectedLanguage, setTranslations } = useAppContext();
    const [isReady, setIsReady] = useState<boolean>(false);
    const [loader, setLoader] = useState<boolean>(false);

    useEffect(() => {
        const initialize = async () => {
            setIsReady(true);
            setLoader(true);
            await checkForLogin();
        };
        const getLanguages = async () => {
            const response = await getTranslations();
            if (response?.status === "SUCCESS") {
                setTranslations(response?.data || {})
            } else {
                Toast.show({
                    type: 'error',  
                    text1: response?.error,
                    visibilityTime: 3000,
                    props: { 
                        style: { width: '80%' },
                        numberOfLines: 2
                    }
                });
            }
        }
        getLanguages();
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
        const value = await getSecureKey("userAuthtoken");
        if (value && value !== "") {
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
            <ThemedView>
                <Onboarding />
            </ThemedView>
    );
};

export default OnboardingScreen;