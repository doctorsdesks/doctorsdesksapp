import Icon from '@/components/Icons';
import { useAppContext } from '@/context/AppContext';
import { signUpDetailsInitial } from '@/context/InitialState';
import { router, Stack } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

export default function () {
    const { signUpHeaderData, setSignUpHeaderData, signUpDetails, setSignUpDetails } = useAppContext();
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Sign Up',
                    headerLeft: () => (
                        <Pressable onPress={() => {
                            if(signUpHeaderData?.find((item) => item?.label === "Personal Info")?.status === "STARTED") {
                                setSignUpDetails(signUpDetailsInitial)
                                router.replace("/login/numberPassword");
                            } else if (signUpHeaderData?.find((item) => item?.label === "Clinic Info")?.status === "STARTED"){
                                const newHeaderData = signUpHeaderData?.map((item) => {
                                    if (item?.label === "Personal Info") return { ...item, status: "STARTED"};
                                    else if (item?.label === "Clinic Info") return { ...item, status: "NOT_STARTED"};
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
                                    if (item?.label === "Clinic Info") return { ...item, status: "STARTED"};
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
                            <Icon type='goBack' />
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
        marginLeft: 0,
    },
});
