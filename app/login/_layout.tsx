import Icon from '@/components/Icons';
import { useAppContext } from '@/context/AppContext';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

export default function () {
    const { allowBack } = useLocalSearchParams();
    const { signUpDetails, setSignUpDetails } = useAppContext();

    const colorScheme = useColorScheme() || 'light';
    
    // const handleBackPress = () => {
    //     if( signUpDetails?.phoneOTPDetails?.otpTriggered) {
    //         setSignUpDetails({ ...signUpDetails, phoneOTPDetails: { ...signUpDetails.phoneOTPDetails, otpTriggered: false }})
    //     } else {
    //         router.replace('/')
    //     }
    // }

    const handleBackPress = (currentPage: string) => {
        if (currentPage === "login") {
            router.replace('/')
        } else if(currentPage === "numberPassword") {
            router.replace('/login')
        } 
        // else if (currentPage === "singup") {
        //     router.replace('/login/numberPassword');
        // }
    }

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={allowBack === "false" ? 

                    {
                        title: 'Login',
                        headerTitleAlign: 'center',
                    }
                :
                    {
                        title: 'Login',
                        headerLeft: () => (
                            <Pressable onPress={() => handleBackPress("login")}>
                                <Icon type='goBack' />
                            </Pressable>
                        ),
                        headerTitleAlign: 'center',
                    }
                }
            />
            <Stack.Screen
                name="numberPassword"
                options={allowBack === "false" ? 

                    {
                        title: 'Sign up',
                        headerTitleAlign: 'center',
                    }
                :
                    {
                        title: 'Sign up',
                        headerLeft: () => (
                            <Pressable onPress={() =>handleBackPress("numberPassword")}>
                                <Icon type='goBack' />
                            </Pressable>
                        ),
                        headerTitleAlign: 'center',
                    }
                }
            />
        </Stack>
    );
};

const styles = StyleSheet.create({
    icon: {
        marginLeft: 0,
    },
});
