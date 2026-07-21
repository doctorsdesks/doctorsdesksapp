import CustomButton from '@/components/CustomButton';
import { useEffect, useState } from 'react';
import { BackHandler, Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import Loader from '@/components/Loader';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import { saveSecureKey } from '@/components/Utils';
import { ThemedView } from '@/components/ThemedView';
import CustomInput2 from '@/components/CustomInput2';
import { ThemedText } from '@/components/ThemedText';
import { useNotification } from '@/context/NotifcationContext';
import { URLS } from '@/constants/Urls';

const Login = () => {
    const { signUpDetails } = useAppContext();
    const { initializeNotifications } = useNotification();
    const [loginDetails, setLoginDetails] = useState<any>([]);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);
    const [loader, setLoader] = useState<boolean>(false);
    const [loginType, setLoginType] = useState<"doctor" | "admin">("doctor");

    useEffect(() => {
        if(signUpDetails){
            const details = signUpDetails?.loginDetails;
            const finalDetails = details?.filter((item: { id: string }) => item?.id !== "confirmPassword" && item?.id !== "otp" );
            setLoginDetails(finalDetails);
        }
    }, [signUpDetails]);

    useEffect(() => {
        const backAction = () => {
            BackHandler.exitApp()
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
            setIsKeyboardOpen(true)
        );
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
           setIsKeyboardOpen(false)
        );

        return () => backHandler.remove();
    }, []);

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
                return { ...item, value: finalValue }; 
            }
            return item;
        });
        setLoginDetails(currentData);  
    }

    const handleLogin = async () => {
        if (isKeyboardOpen) {
            Keyboard.dismiss();
        }
        setLoader(true);
        
        const phone = loginDetails?.find((item: { id: string }) => item?.id === "number")?.value;
        const password = loginDetails?.find((item: { id: string }) => item?.id === "password")?.value;
        
        const updateData = {
            phone,
            password,
            type: loginType === "doctor" ? "DOCTOR" : "ADMIN"
        }
        
        const url = URLS.BASE + "/v1/user/login";
        try {
            const response = await axios.post(url, updateData,
                {
                  headers: {
                    'X-Requested-With': 'nirvaanhealth_web_app',
                  },
                }
              );
            const { data } = response;
            if (data.data?.success) {
                    saveSecureKey("userId", data.data?.user?.userId);
                    saveSecureKey("userType", data.data?.user?.userType);
                    await initializeNotifications(data.data?.user?.userId, data.data?.user?.authToken);
                if (loginType === "doctor") {
                    saveSecureKey("doctorId", data.data?.user?.phone);
                    saveSecureKey("userAuthtoken", data.data?.user?.authToken);
                    router.replace("/dashboard");
                } else if (loginType === "admin") {
                    saveSecureKey("hospitalId", data.data?.user?.phone);
                    saveSecureKey("userAuthtoken", data.data?.user?.authToken);
                    router.replace("/hospitalDashboard");
                }
            } else {
                Toast.show({
                    type: 'error',  
                    text1: data.data.message || "Something went wrong!",
                    visibilityTime: 3000,
                });
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

    const renderInputType = (item: any) => {
        switch (item.inputType) {
            case "NUMBER":
                return (
                    <CustomInput2 data={item} onChange={(value: string, id: string) => handleChange(value, id)} />
                )
                break;
            case "PASSWORD":
                return (
                    <CustomInput2 data={item} onChange={(value: string, id: string) => handleChange(value, id)} />
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
        if (number?.length !== 10 || password?.length < 8 ){
            return true;
        }
        return false;
    }

    const handleClickSignup = () => {
        router.replace("/login/numberPassword");
    }

    const handleForgotPassword = () => {
        router.replace("/login/forgotPassword");
    }

    return (
        <ThemedView style={style.container} >
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }} >
                <Pressable onPress={() => setLoginType("doctor")} style={{ backgroundColor: loginType === 'doctor' ? "#009688" : "#fff", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 }}  >
                    <ThemedText type="subtitle" style={{ fontWeight: 600, color: loginType === 'doctor' ? "#fff" : "#1EA6D6" }}>
                        Login as Doctor
                    </ThemedText>
                </Pressable>
                <Pressable onPress={() => setLoginType("admin")} style={{ backgroundColor: loginType === 'admin' ? "#009688" : "#fff", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 }}  >
                    <ThemedText type="subtitle" style={{ fontWeight: 600, color: loginType === 'admin' ? "#fff" : "#1EA6D6" }}>
                        Login as Hospital
                    </ThemedText>
                </Pressable>
            </View>
            {renderValue()}
            <Pressable style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }} onPress={handleForgotPassword}>
                <ThemedText type='link' >
                    Forgot Password
                </ThemedText>
            </Pressable>
            <View style={{ marginTop: 12, display: 'flex', flexDirection: 'row', justifyContent: 'center' }} >
                <ThemedText type='subtitle' >
                    Don't have an account ?
                </ThemedText>
                <Pressable onPress={handleClickSignup} style={{ marginLeft: 4 }}  >
                    <ThemedText type="subtitle" style={{ fontWeight: 600, color: "#1EA6D6" }}>
                        SignUp
                    </ThemedText>
                </Pressable>
            </View>
            <View style={{ display: "flex", alignItems: "center", marginTop: 24 }} >
                <CustomButton width='FULL' title="Login" onPress={handleLogin} isDisabled={handleDisable()} />
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

export default Login;