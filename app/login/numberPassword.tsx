import CustomButton from '@/components/CustomButton';
import React, { useEffect } from 'react';
import { BackHandler, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Loader from '@/components/Loader';
import { useAppContext } from '@/context/AppContext';
import { ThemedView } from '@/components/ThemedView';
import CustomInput2 from '@/components/CustomInput2';
import { ThemedText } from '@/components/ThemedText';
import { signUpDetailsInitial } from '@/context/InitialState';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const NumberPassword = () => {
    const { signUpDetails, setSignUpDetails } = useAppContext();
    const [loginDetails, setLoginDetails] = React.useState<any>([]);

    const [loader, setLoader] = React.useState<boolean>(false);

    useEffect(() => {
        const backAction = () => {
            setSignUpDetails(signUpDetailsInitial)
            router.replace("/login");
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    },[])

    useEffect(() => {
        if(signUpDetails){
            const details = signUpDetails?.loginDetails;
            setLoginDetails(details);
        }
    }, [signUpDetails]);

    const handleChange = (value: string, id: string) => {
        let finalValue = value;
        if (id === "number") {
            if (value?.length <= 10) {
                finalValue = value;
            } else {
                finalValue = value?.substring(0,10);
            }
        }
        const currentData = loginDetails.map((item: any) => {
            if (item.id === id) {
                if (item?.id === "confirmPassword") {
                    const password = loginDetails?.find((item: { id: string }) => item?.id === "password")?.value;
                    return { ...item, value: finalValue, isError: finalValue !== password };
                } else {
                    return { ...item, value: finalValue};
                }
            }
            return item;
        });
        setLoginDetails(currentData);  
    }

    const handleContinue = () => {
        checkIfUserExist();
    }

    const checkIfUserExist = async () => {
        setLoader(true);
        
        const phone = loginDetails?.find((item: { id: string }) => item?.id === "number")?.value;
        
        const url = "http://docter-api-service-lb-413222422.ap-south-1.elb.amazonaws.com/v1/user/doctor/" + phone;
        try {
            const response = await axios.get(url,
                {
                  headers: {
                    'X-Requested-With': 'nirvaanhealth_web_app',
                  },
                }
              );
            const { data } = response;
            if (data.data) {
                Toast.show({
                    type: 'error',  
                    text1: `User exist with ${phone} number.`,
                    visibilityTime: 3000,
                });
            } else {
                const newSignupDetails = { ...signUpDetailsInitial };
                newSignupDetails.loginDetails = loginDetails;
                setSignUpDetails(newSignupDetails);
                router.replace('/signup');
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',  
                text1: error.response.data.message || "Something went wrong!",
                visibilityTime: 3000,
            });
        } finally {
            setLoader(false);
        }
    }

    const handleBlur = (value: any, id: string) => {
        if (id === "confirmPassword") {
            const password = loginDetails?.find((item: { id: string }) => item?.id === "password")?.value;
            if (value !== password) {
                const currentData = loginDetails.map((item: any) => {
                    if (item.id === id) {
                        return { ...item, isError: true}; 
                    }
                    return item;
                });
                setLoginDetails(currentData);
            } else {
                const currentData = loginDetails.map((item: any) => {
                    if (item.id === id) {
                        return { ...item, isError: false}; 
                    }
                    return item;
                });
                setLoginDetails(currentData);
            }
        }
    }

    const renderInputType = (item: any) => {
        switch (item.inputType) {
            case "NUMBER":
                return (
                    <CustomInput2 data={item} onChange={(value, id) => handleChange(value, id)} />
                )
                break;
            case "PASSWORD":
                return (
                    <CustomInput2 data={item} handleBlur={(value) => handleBlur(value, item?.id)} onChange={(value, id) => handleChange(value, id)} />
                )
                break;
            default:
                break;
        }
    }

    const renderValue = () => {
        return (loginDetails?.map((item: any) => {
            return (
                <View key={item?.id} style={{ marginBottom: 16, paddingBottom: 24 }} >
                    {renderInputType(item)}
                </View>
            )
        }))
    }

    const handleDisable = () => {
        const number = loginDetails?.find((item: { id: string }) => item?.id === "number")?.value;
        const password = loginDetails?.find((item: { id: string }) => item?.id === "password")?.value;
        const confirmPassword = loginDetails?.find((item: { id: string }) => item?.id === "confirmPassword")?.value;
        if (number?.length !== 10 || password?.length < 8 || confirmPassword?.length < 8 || password !== confirmPassword ){
            return true;
        }
        return false;
    }

    const handleLoginClick = () => {
        router.replace("/login");
    }

    return (
        <ThemedView style={style.container} >
            {renderValue()}
            <View style={{ marginTop: 4, display: 'flex', flexDirection: 'row', justifyContent: 'center' }} >
                <ThemedText type='subtitle' >
                    Already have an account ?
                </ThemedText>
                <Pressable onPress={handleLoginClick} style={{ marginLeft: 4 }}  >
                    <ThemedText type="subtitle" style={{ fontWeight: 600, color: "#1EA6D6" }}>
                        Login
                    </ThemedText>
                </Pressable>
            </View>
            <View style={{ display: "flex", alignItems: "center", marginTop: 24 }} >
                <CustomButton width='FULL' title="Continue" onPress={handleContinue} isDisabled={handleDisable()} />
            </View>
            {loader && <Loader />}
        </ThemedView>
    )
}

const style = StyleSheet.create({
    container: {
        paddingHorizontal: 16, 
        paddingVertical: 40,
        height: "100%"
    },
});

export default NumberPassword;