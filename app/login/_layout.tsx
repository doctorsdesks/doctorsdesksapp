import { useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

export default function () {
    const { allowBack } = useLocalSearchParams();
    const { signUpDetails, setSignUpDetails } = useAppContext();
    
    const handleBackPress = () => {
        if( signUpDetails?.phoneOTPDetails?.otpTriggered) {
            setSignUpDetails({ ...signUpDetails, phoneOTPDetails: { ...signUpDetails.phoneOTPDetails, otpTriggered: false }})
        } else {
            router.replace('/')
        }
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
                            <Pressable onPress={handleBackPress}>
                                <Ionicons style={styles.icon} name="arrow-back" size={24} color="black" />
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
        marginLeft: 12,
    },
});
