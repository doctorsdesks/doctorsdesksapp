import React, { useEffect } from 'react';
import { View } from 'react-native';
import Onboarding from '../components/Onboarding';
import { getSecureKey } from '@/components/Utils';
import { router } from 'expo-router';

const onboarding = () => { 

    useEffect(() => {
        checkForLogin();
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
    return (
        <View>
            <Onboarding />
        </View>
    );
};

export default onboarding;