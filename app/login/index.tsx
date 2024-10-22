import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { router } from 'expo-router';

const Login = () => {
    // define a state for inputData of type object with the properties mentioned in CustomInputProps
    const [inputData, setInputData] = React.useState({
        id: 'phone',
        type: 'STRING',
        inputType: 'PHONE',
        value: '',
        label: 'Mobile Number',
        isMandatory: true,
        errorMessage: 'Please enter 10 digits mobile number.',
    });
    // define a state for otp of type string
    const [otp, setOtp] = React.useState({
        id: 'otp',
        type: 'STRING',
        inputType: 'NUMBER',
        value: '',
        label: 'OTP',
        isMandatory: true,
        errorMessage: 'Please enter 4 digits otp.',
    });
    // define a state for confirm of type string with initial value as null
    const [confirm, setConfirm] = React.useState<any>(null);

    const handleChange = (value: string) => { 
        setInputData({ ...inputData, value });
    }

    const handleOtpTrigger = (e: any) => {
        console.log('OTP Triggered');
        router.replace("/signup")
        signInWithPhoneNumber();
    }

    const handleOTP = (value: string) => {
        setOtp({ ...otp, value });
    }

    const signInWithPhoneNumber = async () => {
        const phoneNumber = "+91" + inputData.value;
        console.info('Phone Number', phoneNumber);
        try {
            const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
            setConfirm(confirmation);
        } catch (error) {
            console.log('Error sending code', error);
        }
    }

    const confirmCode = async () => { 
        try {
            const otpValue = otp.value;
            const userCreds = await confirm.confirm(otpValue);
            const user = userCreds.user;
            console.log("user got with this id from collection" ,user, userCreds);

            // check if user exists in firestore
            const userRef = await firestore().collection('users').doc(user.uid).get();
            // log for userRef
            console.log("user got with this id from collection" ,userRef);
            if (userRef.exists) {
                console.log('User already exists');
            } else {
                console.log('New User');
                // await firestore().collection('users').doc(user.uid).set({
                //     phone: user.phoneNumber,
                //     uid: user.uid,
                //     createdAt: firestore.FieldValue.serverTimestamp(),
                // });
            }
        } catch (error) {
            console.log('Invalid code.', error);
        }
    }

    

    return (
        <View style={style.container} >
            {!confirm ? (
                <View>
                    <CustomInput data={inputData} onChange={handleChange} />
                    <View>
                        {/* <CustomButton title="Get OTP" onPress={(e) => handleOtpTrigger(e)} isDisabled={inputData?.value === "" || inputData?.value?.length !== 10 } /> */}
                        <CustomButton title="Get OTP" onPress={(e) => handleOtpTrigger(e)} />
                    </View>
                </View>
            ) : (
                <View style={{ marginTop: 20 }} >
                    <CustomInput data={otp} onChange={handleOTP} />
                    <View>
                        <CustomButton title="Verify OTP" onPress={() => confirmCode} isDisabled={otp?.value === "" || inputData?.value?.length !== 4 } />
                    </View>
                </View>
            )}
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