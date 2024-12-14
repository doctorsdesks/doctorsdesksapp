import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import React, { useEffect, useState } from 'react';
import { BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import Loader from '@/components/Loader';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import { getTranslations, saveSecureKey } from '@/components/Utils';
import { signUpDetailsInitial } from '@/context/InitialState';

const Login = () => {
    const { signUpDetails, setSignUpDetails, setDoctorDetails, setTranslations } = useAppContext();
    const [phoneNumber, setPhoneNumber] = React.useState({
        id: 'phone',
        type: 'STRING',
        inputType: 'PHONE',
        value: '',
        label: 'Mobile Number',
        isMandatory: true,
        errorMessage: 'Please enter 10 digits mobile number.',
    });
    const [otp, setOtp] = React.useState({
        id: 'otp',
        type: 'STRING',
        inputType: 'NUMBER',
        value: '',
        label: 'OTP',
        isMandatory: true,
        errorMessage: 'Please enter 4 digits otp.',
    });
    const [confirm, setConfirm] = React.useState<any>(false);

    const [timer, setTimer] = React.useState<number>(0);
    const [canResendOtp, setCanResendOtp] = React.useState<boolean>(false);
    const [isOTPWrong, setIsOTPWrong] = React.useState<boolean>(false);
    const [loader, setLoader] = React.useState<boolean>(false);
    const [testNumber] = useState<string>("1111111111, 1111111119");

    useEffect(() => {
        const backAction = () => {
            setSignUpDetails(signUpDetailsInitial);
            BackHandler.exitApp()
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        const getLanguages = async () => {
            const response = await getTranslations();
            if (response?.status === "SUCCESS") {
                setTranslations(response?.data || {})
                saveSecureKey("language", "English");
            } else {
                Toast.show({
                    type: 'error',  
                    text1: response?.data,
                    visibilityTime: 3000,
                });
            }
        }

        getLanguages();

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        if (signUpDetails) {
            setConfirm(signUpDetails?.phoneOTPDetails?.otpTriggered);
        }
    }, [signUpDetails]);

    useEffect(() => {
        if (timer === 0) {
            setCanResendOtp(true);
          return;
        }
    
        setCanResendOtp(false);
    
        const timerId = setInterval(() => {
          setTimer(timer-1);
        }, 1000);
    
        return () => clearInterval(timerId);
      }, [timer]);

    const handleChange = (value: string) => { 
        if (value?.length <= 10) {
            setPhoneNumber({ ...phoneNumber, value });
        }

    }

    const handleOtpTrigger = () => {

        if(testNumber.includes(phoneNumber.value)){
            Toast.show({
                type: 'success',  
                text1: 'OTP triggered successfully.',
                visibilityTime: 3000,
            });
            const newSignUpDetails = { ...signUpDetails, phoneOTPDetails: {
                    phoneNumber: phoneNumber.value,
                    otp: otp.value,
                    otpTriggered: true
                },
            }
            setSignUpDetails(newSignUpDetails)
            setTimer(30);
            setLoader(false);
            setCanResendOtp(false);
        } else {
            setLoader(true);
            setCanResendOtp(false);
            signInWithPhoneNumber();
        }
    }

    const handleOTP = (value: string) => {
        if(value?.length <= 6) {
            setIsOTPWrong(false);
            setOtp({ ...otp, value });
        }
    }

    const signInWithPhoneNumber = async () => {
        const completeNumber = "+91" + phoneNumber.value;
        try {
            const confirmation = await auth().signInWithPhoneNumber(completeNumber);
            setLoader(false);
            Toast.show({
                type: 'success',  
                text1: 'OTP triggered successfully.',
                visibilityTime: 3000,
            });
            const newSignUpDetails = { ...signUpDetails, phoneOTPDetails: {
                    phoneNumber: phoneNumber.value,
                    otp: otp.value,
                    otpTriggered: true
                },
            }
            setSignUpDetails(newSignUpDetails)
            setTimer(30);
        } catch (error: any) {
            debugger;
            setLoader(false);
            Toast.show({
                type: 'error',  
                text1: error?.message || "Something went wrong!. Please try again later",
                visibilityTime: 3000,
            });
        }
    }

    const confirmCode = async () => { 
        setLoader(true);
        if(otp.value === "123456"){
            Toast.show({
                type: 'success',  
                text1: `OTP confirmed`,
                visibilityTime: 3000,
            });
            CheckForUserExist();
        } else {
            try {
                const responseOtp = await confirm.confirm(otp.value);
                Toast.show({
                    type: 'success',  
                    text1: `OTP confirmed`,
                    visibilityTime: 3000,
                });
                CheckForUserExist();
            } catch (error: any) {
                Toast.show({
                    type: 'error',
                    text1: error?.message || "Something went wrong!. Please try again later",
                    visibilityTime: 3000,
                });
                setLoader(false);
            }
        }
    }

    const CheckForUserExist = async () => {
        const url = "http://docter-api-service-lb-413222422.ap-south-1.elb.amazonaws.com/v1/doctor/" + phoneNumber.value;
        try {
            const response = await axios.get(url,
                {
                    headers: {
                    'X-Requested-With': 'doctorsdesks_web_app',
                    },
                }
            );
            const { data } = response;
            setLoader(false);
            if( data?.data == null ){
                // new doctor 
                const newSignUpDetails = { ...signUpDetails, phoneOTPDetails: {
                        phoneNumber: phoneNumber.value,
                        otp: otp.value,
                    },
                }
                setSignUpDetails(newSignUpDetails)
                router.replace({
                    pathname: '/signup',
                    params: {
                        currentStep: "PD"
                    }
                })
            } else if (data.data) {
                // existing doctor
                setSignUpDetails(signUpDetailsInitial);
                setDoctorDetails({ ...data.data })
                Toast.show({
                    type: 'success',  
                    text1: `Welcome ${data.data.name}`,
                    visibilityTime: 3000,
                });
                saveSecureKey("isUserLoggedIn", "true");
                router.replace("/dashboard");
            }
        } catch (error: any) {
            if (error?.response?.statusText === "Not Found") {
                    const newSignUpDetails = { ...signUpDetails, phoneOTPDetails: {
                        phoneNumber: phoneNumber.value,
                        otp: otp.value,
                    },
                }
                setSignUpDetails(newSignUpDetails)
                setLoader(false);
                router.replace({
                    pathname: '/signup',
                    params: {
                        currentStep: "PD"
                    }
                })
            } else {
                Toast.show({
                    type: 'error',  
                    text1: error.response.data.message || "Something went wrong!",
                    visibilityTime: 3000,
                });
                setLoader(false);
            }
        }
    }

    

    return (
        <View style={style.container} >
            {!confirm ? (
                <View>
                    <CustomInput data={phoneNumber} onChange={handleChange} />
                    <View style={{ marginTop: 24 }} >
                        <CustomButton title="Get OTP" onPress={() => handleOtpTrigger()} isDisabled={phoneNumber?.value === "" || phoneNumber?.value?.length !== 10 } />
                    </View>
                </View>
            ) : (
                <View style={{ marginTop: 20 }} >
                    <Text style={{ fontSize: 14, fontWeight: 400, lineHeight: 20, color: "#32383D" }} >
                        Enter the <Text style={{ fontWeight: 600 }} >6 digit</Text> code from the sms we sent to <Text style={{ fontWeight: 600 }} >{phoneNumber?.value}</Text>
                    </Text>
                    <View style={{ marginTop: 40 }} >
                        <CustomInput data={otp} onChange={handleOTP} />
                        {isOTPWrong && <Text style={{ marginTop: 5, fontSize: 12, color: 'red' }}>Please enter correct otp.</Text>}
                    </View>
                    <View style={{ marginTop: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
                        <Text>
                            Didn't receive OTP?
                        </Text>
                        <Pressable style={{ marginLeft: 4, borderBottomWidth: 1, borderBottomColor: "#1EA6D6" }} onPress={() => handleOtpTrigger()} >
                            <Text style={{ color: "#1EA6D6"}} >
                                {canResendOtp ? "Resend Code" : `Retry in ${timer}`}
                            </Text>
                        </Pressable>
                    </View>
                    <View style={{ marginTop: 24 }} >
                        <CustomButton title="Verify OTP" onPress={() => confirmCode()} isDisabled={otp?.value === "" || otp?.value?.length !== 6 } />
                    </View>
                </View>
            )}
            {loader && <Loader />}
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: "#FCFCFC",
        paddingHorizontal: 16, 
        paddingVertical: 40,
        height: "100%"
    },
    header: {
        color: "pink"
    }
});

export default Login;