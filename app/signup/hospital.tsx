import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, BackHandler, Keyboard } from 'react-native';
import CustomInput2 from '@/components/CustomInput2';
import CustomButton from '@/components/CustomButton';
import CustomRadio from '@/components/CustomRadio';
import { router } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import Loader from '@/components/Loader';
import { getValueById, login, saveSecureKey } from '@/components/Utils';
import { signUpDetailsInitial } from '@/context/InitialState';
import { ThemedView } from '@/components/ThemedView';
import { URLS } from '@/constants/Urls';


const HospitalSignUp = () => {
    const { signUpDetails, setSignUpDetails, setHospitalDetails } = useAppContext();
    const scrollViewRef = useRef(null);

    const [details, setDetails] = useState<any>([]);
    const [loader, setLoader] = useState<boolean>(false);

    useEffect(() => {
        if(signUpDetails){
            setDetails(signUpDetails?.hospitalDetails);
        }
    }, [signUpDetails]);

    const handleChange = (value: string, id: string) => {
        const hospitalUpdatedData = details.map((item: any) => {
            if (item.id === id) {
                return { ...item, value }; 
            }
            return item;
        });
        setDetails(hospitalUpdatedData);
    }

    const handleButtonClick = () => {
        setLoader(true);
        const numPassInfo = signUpDetails?.loginDetails;
        const updateData = {
            phone: getValueById(numPassInfo, "number"),
            password: getValueById(numPassInfo, "password"),
            hospitalName: getValueById(details, "hospitalName"),
            email:  getValueById(details, "email"),
            ownerName: getValueById(details, "ownerName"),
            address: {
                addressLine: getValueById(details, "hospitalAddress"),
                landmark: getValueById(details, "landmark"),
                city: getValueById(details, "city"),
                state: getValueById(details, "state"),
                pincode: getValueById(details, "pincode"),
            }
        }
        createHospital(updateData);
    }

    const createHospital = async (updateData: any) => {
        const url = URLS.BASE + "/v1/hospital/create";
        try {
            const response = await axios.post(url, updateData,
              {
                headers: {
                  'X-Requested-With': 'nirvaanhealth_web_app',
                },
              }
            );
            const { data, status } = response;
            if (status === 201){
                // login user
                const payload = {
                    phone: data?.data?.phone,
                    password: updateData?.password,
                    type: "ADMIN"
                }
                const loginResponse = await login(payload);
                if (loginResponse?.status === "SUCCESS") {
                    setHospitalDetails(data?.data);
                    setSignUpDetails(signUpDetailsInitial);
                    await saveSecureKey("isUserOnBoarded", "true");
                    await saveSecureKey("hospitalId", data.data?.phone);
                    await saveSecureKey("userType", loginResponse.data?.user?.userType);
                    await saveSecureKey("userAuthtoken", loginResponse?.data?.user?.authToken);
                    router.replace({
                        pathname: "/successSignUp",
                        params: {
                            isLoggedFailed: "false",
                            accountType: "hospital",
                        }
                    });
                    setLoader(false);
                } else {
                    router.replace({
                        pathname: "/successSignUp",
                        params: {
                            isLoggedFailed: "true",
                            accountType: "hospital"
                        }
                    })
                    setLoader(false);
                }
            } else {
                Toast.show({
                    type: 'error',  
                    text1: "Something wrong. Please try again.",
                    visibilityTime: 3000,
                });
                setLoader(false);
            }
        } catch (error: any) {
            if (error?.status === 409) {
                Toast.show({
                    type: 'error',  
                    text1: error.response.data.message,
                    visibilityTime: 3000,
                });
            } else {
                Toast.show({
                    type: 'error',  
                    text1: error.response.data.message,
                    visibilityTime: 3000,
                });
            }
            setLoader(false);
        }
    }

    const renderInputType = (item: any) => {
        switch (item.inputType) {
            case "TEXT":
                return (
                    <CustomInput2 data={item} onChange={(value, id) => handleChange(value, id)} />
                )
                break;
            case "NUMBER":
                return (
                    <CustomInput2 data={item} onChange={(value, id) => handleChange(value, id)} />
                )
                break;
            case "PHONE":
                return (
                    <CustomInput2 data={item} onChange={(value, id) => handleChange(value, id)} />
                )
                break;
            case "EMAIL":
                return (
                    <CustomInput2 data={item} onChange={(value, id) => handleChange(value, id)} />
                )
                break;
            case "RADIO":
                return (
                    <CustomRadio data={item} onChange={(value: string, id: string) => handleChange(value, id)} />
                )
                break;
            case "DATE":
                return (
                    <CustomInput2 data={item} onChange={(value, id) => handleChange(value, id)} />
                )
                break;
            default:
                break;
        }
    }

    const renderValue = () => {
        return (details?.map((item: any) => {
            return (
                <View key={item?.id} style={{ marginBottom: 28 }} >
                    {renderInputType(item)}
                </View>
            )
        }));
    }

    return (loader ? <Loader /> 
        :
            <ThemedView style={style.container} >
                <ScrollView
                    ref={scrollViewRef}
                    showsVerticalScrollIndicator={false}
                    style={{ 
                        display: 'flex',
                        borderRadius: 8,
                        borderColor: "#DDDDDD",
                        marginTop: 0,
                        borderWidth: 1,
                        paddingHorizontal: 12,
                        paddingVertical: 16,
                    }}
                >
                    {renderValue()}
                </ScrollView>
                <View style={{ display: "flex", alignItems: "center", marginTop: 24 }} >
                    <CustomButton width='FULL' title="Continue" onPress={handleButtonClick} />
                </View>
            </ThemedView>
    );
}


const style = StyleSheet.create({
    container: {
        paddingHorizontal: 16, 
        paddingTop: 16,
        paddingBottom: 20,
        flex: 1,
    }
});

export default HospitalSignUp;
