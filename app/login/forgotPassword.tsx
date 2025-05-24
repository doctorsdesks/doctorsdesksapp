import CustomButton from '@/components/CustomButton';
import React, { useEffect } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Loader from '@/components/Loader';
import { useAppContext } from '@/context/AppContext';
import { ThemedView } from '@/components/ThemedView';
import CustomInput2 from '@/components/CustomInput2';
import { signUpDetailsInitial } from '@/context/InitialState';
import Toast from 'react-native-toast-message';
import CustomOTP from '@/components/CustomOTP';
import { resetPassword, triggerOtp, verifyOtp } from '@/components/Utils';

const ForgotPassword = () => {
    const { signUpDetails, setSignUpDetails } = useAppContext();
    const [loginDetails, setLoginDetails] = React.useState<any>([]);
    const [numberVerified, setNumberVerified] = React.useState<boolean>(false);
    const [loader, setLoader] = React.useState<boolean>(false);
    const [otpLoader, setOtpLoader] = React.useState<boolean>(false);
    const [numberIcon, setNumberIcon] = React.useState<string>("emptyField");
    const [testNumbers] = React.useState<Array<string>>(["1111111111", "1111111110", "1111111112", "1111111113", "1111111114", "1111111115", "1111111116", "1111111117", "1111111118"])

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
            setNumberVerified(false);
            setNumberIcon("emptyField");
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
            return { ...item, isHidden: id === "number" && item?.id === "otp" ? finalValue?.length === 10 ? false : true : false };
        });
        setLoginDetails(currentData);
        if (id === "number" && finalValue?.length === 10) {
            setOtpLoader(true);
            setNumberIcon("processing");
            if (testNumbers.includes(finalValue)) {
                const currentData = loginDetails.map((item: any) => {
                    if (item?.id === "number") {
                        return { ...item, value: finalValue }
                    }
                    if (item.id === "otp") {
                        return { ...item, isHidden: false }
                    }
                    return { ...item };
                });
                setLoginDetails(currentData);
                setOtpLoader(false);
            } else {
                const payload = {
                    phoneNumber: `+91${finalValue}`
                }
                trigger_Otp(payload, finalValue);
            }
        }
    }

    const trigger_Otp = async (payload: any, finalNumber: string) => {
        const response = await triggerOtp(payload);
        if (response.status === "SUCCESS") {
            Toast.show({
                type: 'success',  
                text1: 'Otp triggered successfully!',
                visibilityTime: 3000,
            });
            setOtpLoader(false);
            const currentData = loginDetails.map((item: any) => {
                if (item?.id === "number") {
                    return { ...item, value: finalNumber }
                }
                if (item.id === "otp") {
                    return { ...item, isHidden: false }
                }
                return { ...item };
            });
            setLoginDetails(currentData);
        } else {
            Toast.show({
                type: 'error',  
                text1: response.error,
                visibilityTime: 3000,
            });
            setOtpLoader(false);
        }
    }

    const handleContinue = async () => {
        setLoader(true);
        const number = loginDetails?.find((item: { id: string }) => item?.id === "number")?.value;
        const password = loginDetails?.find((item: { id: string }) => item?.id === "password")?.value;
        const payload = {
            phone: number,
            password: password,
            userType: "DOCTOR"
        }
        const response = await resetPassword(payload);
        if (response.status === "SUCCESS") {
            Toast.show({
                type: 'success',  
                text1: 'Password reset successfully!',
                visibilityTime: 3000,
            });
            setLoader(false);
            router.replace("/login");
        } else {
            Toast.show({
                type: 'error',  
                text1: response.error,
                visibilityTime: 3000,
            });
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

    const handleOTPComplete = (otp: string) => {
        setOtpLoader(true);
        const phone = loginDetails?.find((item: { id: string }) => item?.id === "number")?.value;
        if (testNumbers.includes(phone)) {
            if (otp === '1234') {
                setNumberVerified(true);
                setNumberIcon("verifiedField");
                const currentData = loginDetails.map((item: any) => {
                    if (item.id === "otp") {
                        return { ...item, isHidden: true}; 
                    }
                    return item;
                });
                setLoginDetails(currentData);
                setOtpLoader(false);
            } else {
                const currentData = loginDetails.map((item: any) => {
                    if (item.id === "otp") {
                        return { ...item, isError: true }; 
                    }
                    return item;
                });
                setLoginDetails(currentData);
                setNumberIcon("notVerifiedField");
                setOtpLoader(false);
            }
        } else {
            const payload = {
                phoneNumber: `+91${phone}`,
                code: otp
            }
            verify_otp(payload)
        }
    };

    const verify_otp = async (payload: any) => {
        const response = await verifyOtp(payload);
        if (response.status === "SUCCESS") {
            Toast.show({
                type: 'success',  
                text1: 'Otp verified successfully!',
                visibilityTime: 3000,
            });
            setNumberVerified(true);
            const currentData = loginDetails.map((item: any) => {
                if (item.id === "otp") {
                    return { ...item, isHidden: true}; 
                }
                return item;
            });
            setLoginDetails(currentData);
            setNumberIcon("verifiedField");
            setOtpLoader(false);
        } else {
            Toast.show({
                type: 'error',  
                text1: response.error,
                visibilityTime: 3000,
            });
            const currentData = loginDetails.map((item: any) => {
                if (item.id === "otp") {
                    return { ...item, isError: true }; 
                }
                return item;
            });
            setLoginDetails(currentData);
            setNumberIcon("notVerifiedField");
            setOtpLoader(false);
        }
    }

    const renderInputType = (item: any) => {
        switch (item.inputType) {
            case "NUMBER":
                return (
                    <CustomInput2 data={item} onChange={(value, id) => handleChange(value, id)} rightIcon={numberIcon} />
                )
                break;
            case "PASSWORD":
                return (
                    <CustomInput2 data={item} handleBlur={(value) => handleBlur(value, item?.id)} onChange={(value, id) => handleChange(value, id)} />
                )
                break;
            case "OTP":
                return (
                    <CustomOTP length={item?.otpLength} isError={item?.isError ?? false} onOTPComplete={handleOTPComplete} />
                )
            default:
                break;
        }
    }

    const renderValue = () => {
        return (loginDetails?.map((item: any) => {
            if (item?.isHidden) return null;
            return (
                <View key={item?.id} style={{ marginBottom: 8, paddingBottom: 12 }} >
                    {renderInputType(item)}
                </View>
            )
        }))
    }

    const handleDisable = () => {
        const number = loginDetails?.find((item: { id: string }) => item?.id === "number")?.value;
        const password = loginDetails?.find((item: { id: string }) => item?.id === "password")?.value;
        const confirmPassword = loginDetails?.find((item: { id: string }) => item?.id === "confirmPassword")?.value;
        if (number?.length !== 10 || !numberVerified || password?.length < 8 || confirmPassword?.length < 8 || password !== confirmPassword ){
            return true;
        }
        return false;
    }

    return (
        <ThemedView style={style.container} >
            {renderValue()}
            <View style={{ display: "flex", alignItems: "center", marginTop: 24 }} >
                <CustomButton width='FULL' title="Reset Password" onPress={handleContinue} isDisabled={handleDisable()} />
            </View>
            {loader || otpLoader && <Loader />}
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

export default ForgotPassword;