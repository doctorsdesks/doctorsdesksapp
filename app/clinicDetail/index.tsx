import CustomButton from '@/components/CustomButton';
import { useAppContext } from '@/context/AppContext';
import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { getClinics, getValueById, updateClinic } from '@/components/Utils';
import CustomInput2 from '@/components/CustomInput2';
import { signUpDetailsInitial } from '@/context/InitialState';
import CustomRadio from '@/components/CustomRadio';
import { router } from 'expo-router';
import Loader from '@/components/Loader';
import MainHeader from '@/components/MainHeader';
import { ThemedView } from '@/components/ThemedView';

const ClinicDetailsSetting = () => {
    const { height } = Dimensions.get('window');
    const { doctorDetails } = useAppContext();
    const scrollViewRef = React.useRef(null);
    const [clinicData, setClinicData] = useState<any>();
    const [loader, setLoader] = useState<boolean>(true);
    const [isEditable, setIsEditable] = useState<boolean>(false);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);

    useEffect(() => {
        const backAction = () => {
            if (isKeyboardOpen) {
                Keyboard.dismiss();
                return true;
            } else {
                router.replace("/dashboard/profile");
                return true;
            }
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        const getAllClinics = async () => {
            setLoader(true);
            const respnose = await getClinics(doctorDetails?.phone);
            if ( respnose.status === "SUCCESS") {
                const docData = respnose.data;
                const clinicDataInitial = signUpDetailsInitial?.clinicDetails;
                const newClinicData = {
                    clinicId: docData?._id,
                    clinicInfo: clinicDataInitial?.map((item: any) => {
                        switch (item?.id) {
                            case "clinicName":
                                return { ...item, value: docData?.clinicAddress?.clinicName, isDisabled: true };
                                break;
                            case "clinicAddress":
                                return { ...item, value: docData?.clinicAddress?.address?.addressLine, isDisabled: true };
                                break;
                            case "landmark":
                                return { ...item, value: docData?.clinicAddress?.address?.landmark, isDisabled: true };
                                break;
                            case "city":
                                return { ...item, value: docData?.clinicAddress?.address?.city, isDisabled: true };
                                break;
                            case "state":
                                return { ...item, value: docData?.clinicAddress?.address?.state, isDisabled: true };
                                break;
                            case "pincode":
                                return { ...item, value: docData?.clinicAddress?.address?.pincode, isDisabled: true };
                                break;
                            default:
                                break;
                        }
                    })
                }
                setClinicData(newClinicData);
                setLoader(false);
            } else {
                Toast.show({
                    type: 'error',  
                    text1: respnose.error,
                    visibilityTime: 3000,
                });
                setLoader(false);
            }
        }

        getAllClinics();
    },[doctorDetails])

    useEffect(() => {
        if (isEditable) {
            let newClinicData = { ...clinicData };
            let newClinicInfo = [...newClinicData?.clinicInfo]
            newClinicInfo = newClinicInfo?.map((item: any) => {
                return { ...item, isDisabled: false };
            }),
            newClinicData = {
                ...newClinicData,
                clinicInfo: newClinicInfo
            }
            setClinicData(newClinicData);
            const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
                setIsKeyboardOpen(true)
            );
            const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
               setIsKeyboardOpen(false)
            );
        }
    },[isEditable])

    const updateClinicInfo = async () => {
        const updateData = {
            addressPayload: {
                clinicName: getValueById(clinicData?.clinicInfo, "clinicName"),
                address: {
                    addressLine: getValueById(clinicData?.clinicInfo, "clinicAddress"),
                    landmark: getValueById(clinicData?.clinicInfo, "landmark"),
                    city: getValueById(clinicData?.clinicInfo, "city"),
                    state: getValueById(clinicData?.clinicInfo, "state"),
                    pincode: getValueById(clinicData?.clinicInfo, "pincode"),
                }
            }
        }
        const response: any = await updateClinic(clinicData?.clinicId, updateData);
        if (response.status === "SUCCESS") {
            Toast.show({
                type: 'success',  
                text1: response.message,
                visibilityTime: 3000,
            });
            setLoader(false);
            router.replace("/dashboard/profile");
        } else {
            Toast.show({
                type: 'error',  
                text1: response.error,
                visibilityTime: 3000,
            });
            setLoader(false);
        }
    }

    const handleButtonClick = () => {
        if (isEditable) {
            setLoader(true);
            updateClinicInfo();
        } else {
            setIsEditable(true);
        }
    }

    const handleChange = (value: string, id: string) => {
            let newClinicData = { ...clinicData };
            const clinicInfo = [...newClinicData?.clinicInfo];
            const newClinicInfo = clinicInfo.map((item: any) => {
                if (item.id === id) {
                    return { ...item, value }; 
                }
                return item;
            });
            newClinicData = {
                ...newClinicData,
                clinicInfo: newClinicInfo
            }
            setClinicData(newClinicData); 
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
            case "EMAIL":
                return (
                    <CustomInput2 data={item} onChange={(value, id) => handleChange(value, id)} />
                )
                break;
            case "RADIO":
                return (
                    <CustomRadio data={item} onChange={(value, id) => handleChange(value, id)} />
                )
                break;
            default:
                break;
        }
    }

    return (loader ?
            <Loader />
        :
            <ThemedView style={styles.container} >
                <MainHeader selectedNav='clinicDetails' />
                <View style={{ height: height - 100 }} >
                    <ScrollView
                        ref={scrollViewRef}
                        style={{ 
                            display: 'flex',
                            borderRadius: 8,
                            borderColor: "#DDDDDD",
                            marginTop: 20,
                            borderWidth: 1,
                            paddingHorizontal: 12,
                            paddingVertical: 16,
                            maxHeight: isKeyboardOpen ? height - 460 : height - 160,
                        }}
                    >
                        {clinicData?.clinicInfo?.map((item: any) => {
                            return (
                                <View key={item?.id} style={{ marginBottom: 16, paddingBottom: 12 }} >
                                    {renderInputType(item)}
                                </View>
                            )
                        })}
                    </ScrollView>
                </View>
                <View style={{ display: "flex", alignItems: "center", position: 'absolute', left: 16, right: 16, bottom: 16, zIndex: 2 }} >
                    <CustomButton width='FULL' title={isEditable ? "Save" : "Update"} onPress={handleButtonClick} />
                </View>
            </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 62,
        height: "100%",
        position: 'relative'
    },
});

export default ClinicDetailsSetting;