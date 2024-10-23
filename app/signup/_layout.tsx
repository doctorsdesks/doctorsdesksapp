import { useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

export default function () {
    const { signUpHeaderData, setSignUpHeaderData } = useAppContext();
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Sign Up',
                    headerLeft: () => (
                        <Pressable onPress={() => {
                            if(signUpHeaderData?.find((item) => item?.label === "Personal Details")?.status === "STARTED") {
                                router.replace("/login");
                            } else if (signUpHeaderData?.find((item) => item?.label === "Clinic Details")?.status === "STARTED"){
                                const newHeaderData = signUpHeaderData?.map((item) => {
                                    if (item?.label === "Personal Details") return { ...item, status: "STARTED"};
                                    else if (item?.label === "Clinic Details") return { ...item, status: "NOT_STARTED"};
                                    else return { ...item };
                                });
                                setSignUpHeaderData(newHeaderData);
                                router.replace({
                                    pathname: "/signup",
                                    params: {
                                        currentStep: "PD"
                                    }
                                })
                            } else if(signUpHeaderData?.find((item) => item?.label === "ID Proof")?.status === "STARTED"){
                                const newHeaderData = signUpHeaderData?.map((item) => {
                                    if (item?.label === "Clinic Details") return { ...item, status: "STARTED"};
                                    else if (item?.label === "ID Proof") return { ...item, status: "NOT_STARTED"};
                                    else return { ...item };
                                });
                                setSignUpHeaderData(newHeaderData);
                                router.replace({
                                    pathname: "/signup",
                                    params: {
                                        currentStep: "CD"
                                    }
                                })
                            }
                        }}>
                            <Ionicons style={styles.icon} name="arrow-back" size={24} color="black" />
                        </Pressable>
                    ),
                    headerTitleAlign: 'center',
                }}
            />
        </Stack>
    );
};

const styles = StyleSheet.create({
    icon: {
        marginLeft: 12,
    },
});
