import CustomButton from '@/components/CustomButton';
import CustomInput2 from '@/components/CustomInput2';
import Loader from '@/components/Loader';
import MainHeader from '@/components/MainHeader';
import { getClinics } from '@/components/Utils';
import { StringObject } from '@/constants/Enums';
import { URLS } from '@/constants/Urls';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, View } from 'react-native';
import Toast from 'react-native-toast-message';

const ConsultationFee = () => {
    const { height, width } = Dimensions.get('window');
    const { doctorDetails } = useAppContext();
    const [loader, setLoader] = useState<boolean>(false);
    const [isEditable, setIsEditable] = useState<boolean>(false);
    const [data, setData] = useState<Array<StringObject>>([
        {
            id: "consultationFee",
            type: "STRING",
            inputType: "AMOUNT",
            value: "",
            label: "Consultation Fee",
            isMandatory: true,
            errorMessage: "Please enter consultation fee",
            placeholder: "e.g 200",
            isDisabled: true,
        },
        {
            id: "emergencyFee",
            type: "STRING",
            inputType: "AMOUNT",
            value: "",
            label: "Emergency Fee",
            isMandatory: true,
            errorMessage: "Please enter emergency fee",
            placeholder: "e.g 200",
            isDisabled: true,
        }
    ]);
    const [clinicId, setClinicId] = useState<string>("");

    useEffect(() => {
        const backAction = () => {
            router.replace("/dashboard/profile");
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        const getFeeDetails = async () => {
            setLoader(true);
            const respnose = await getClinics(doctorDetails?.phone);
            if (respnose.status === "SUCCESS") {
                const clinicDetails = respnose.data;
                setClinicId(clinicDetails?._id);
                const finalData = data?.map((item: any) => {
                    if (item?.id === "consultationFee") return { ...item, value: JSON.stringify(clinicDetails?.appointmentFee) }
                    if (item?.id === "emergencyFee") return { ...item, value: JSON.stringify(clinicDetails?.emergencyFee) }
                })
                setData(finalData);
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
        getFeeDetails();
    },[doctorDetails])

    const handleSave = () => {
        if (isEditable) {
            setLoader(true)
            updateClinic()
        } else {
            let newData = [...data];
            newData = newData?.map((eachData: StringObject) => {
                return { ...eachData, isDisabled: false }
            });
            setData(newData);
            setIsEditable(true);
        }
    }

    const handleChange = (value: string, id: string) => {
        const newData = [...data];
        const finalData = newData.map((item: any) => {
            if (item.id === id) {
                return { ...item, value }; 
            }
            return item;
        });
        setData(finalData); 
}

    const updateClinic = async () => {
        const updateData = {
            feeFollowupPayload: {
                appointmentFee: data?.find((item: any) => item?.id === "consultationFee")?.value || "",
                emergencyFee: data?.find((item: any) => item?.id === "emergencyFee")?.value || "",
            }
        }
        const url = URLS.BASE + URLS.UPDATE_CLINIC + "/" + doctorDetails?.phone + "/" + clinicId;
        try {
            const response = await axios.post(url, updateData,
              {
                headers: {
                  'X-Requested-With': 'doctorsdesks_web_app',
                },
              }
            );
            const { data, status } = response;
            if (status === 201){
                Toast.show({
                    type: 'success',  
                    text1: data.message,
                    visibilityTime: 3000,
                });
            }
            setLoader(false);
            router.replace("/dashboard/profile");
        } catch (error: any) {
                Toast.show({
                    type: 'error',  
                    text1: error.response.data.message,
                    visibilityTime: 3000,
                });
            setLoader(false);
        }
    }


    return(
        <View style={{ marginHorizontal: 16, marginTop: 52, position: 'relative', height }} >
            <MainHeader selectedNav='consultationFee' />
            <View style={{ marginTop: 32, borderWidth: 1, borderRadius: 8, borderColor: "#DDDDDDDD", padding: 16 }} >
                {data?.map((item: StringObject) => {
                    return (
                        <View key={item?.id} style={{ marginBottom: 16, paddingBottom: 12 }} >
                            <CustomInput2 key={item?.id} data={item} onChange={(value) => handleChange(value, item?.id)} />
                        </View>
                    )
                })}
            </View>
            <View style={{ display: "flex", alignItems: "center", position: 'absolute', top: height - 80, width: width - 32 }} >
                    <CustomButton multiLingual={true} width='FULL' title={isEditable ? "Save" : "Update"} onPress={handleSave} />
            </View>
            {loader && <Loader />}
        </View>
    );
};

export default ConsultationFee;