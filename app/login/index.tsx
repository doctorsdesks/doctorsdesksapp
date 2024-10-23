import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import Loader from '@/components/Loader';
import { useAppContext } from '@/context/AppContext';

const Login = () => {
    const { signUpDetails, setSignUpDetails } = useAppContext();
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

    const [timer, setTimer] = React.useState<number>(30);
    const [canResendOtp, setCanResendOtp] = React.useState<boolean>(false);
    const [isOTPWrong, setIsOTPWrong] = React.useState<boolean>(false);
    const [loader, setLoader] = React.useState<boolean>(false);

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
        setLoader(true);
        setTimer(30);
        setCanResendOtp(false);
        // signInWithPhoneNumber();
        Toast.show({
            type: 'success',  
            text1: 'OTP triggered successfully.',
            visibilityTime: 5000,
          });
        setConfirm(true);
        setLoader(false);
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
            setConfirm(confirmation);
            setLoader(false);
            Toast.show({
                type: 'success',  
                text1: 'OTP triggered successfully.',
                visibilityTime: 5000,
              });
        } catch (error) {
            console.info(error);
            setLoader(false);
            Toast.show({
                type: 'error',  
                text1: 'Something went wrong! Please try again later.',
                visibilityTime: 5000,
            });
        }
    }

    const confirmCode = async () => { 
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
        // try {
        //     setLoader(true);
        //     const otpValue = otp.value;
        //     const userCreds = await confirm.confirm(otpValue);
        //     const user = userCreds.user;
        //     console.log("user got with this id from collection" ,user, );
        //     // check for db if phone number is present
        //     // if present go to homepage
        //     // router.replace({
        //     //     pathname: '/doctorDashboard',
        //     // })
        //     // if not present go to signup
               // const newSignUpDetails = { ...signUpDetails, phoneNumber: phoneNumber.value}
               // setSignUpDetails(newSignUpDetails)
        //     router.replace({
        //         pathname: '/signup',
        //         params: {
        //             currentStep: "PD"
        //         }
        //     })
        //     // loader false
        // } catch (error) {
        //     setLoader(false);
        //     setIsOTPWrong(true);
        // }
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