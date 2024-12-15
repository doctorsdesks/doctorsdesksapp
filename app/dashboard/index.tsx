import AppointmentCard from '@/components/AppointmentCard';
import CustomText from '@/components/CustomText';
import Loader from '@/components/Loader';
import MainFooter from '@/components/MainFooter';
import MainHeader from '@/components/MainHeader';
import { getAppointments, getDoctorDetails, getSecureKey, getTranslations, saveSecureKey } from '@/components/Utils';
import { AppointmentStatus } from '@/constants/Enums';
import { URLS } from '@/constants/Urls';
import { useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';


const Home = () => {
    const { setDoctorDetails, setTranslations } = useAppContext();
    const scrollViewRef = React.useRef(null);
    const { width, height } = Dimensions.get('window');
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>("");
    const [loader, setLoader] = useState<boolean>(false);
    const [appointments, setAppointments] = useState<Array<any>>([]);
    const [patientCount, setPatientCount] = useState<string>('0');
    const [doctorId, setDoctorId] = useState<string>("");

    useEffect(() => {
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
        const getDoctorId =  async () => {
            const value = await getSecureKey("doctorId");
            if (value) {
                setDoctorId(value);
            }
        }
        getDoctorId();
        getLanguages();
    },[])

    useEffect(() => {
        if (doctorId !== "") {
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            findDoctor(doctorId)
            getAllAppointments(doctorId, formattedDate)
        }
    }, [doctorId])

    const findDoctor = async (docNumber: string) => {
        setLoader(true);
        const respnose = await getDoctorDetails(docNumber);
        if (respnose.status === "SUCCESS") {
            const docDetails = respnose.data;
            setDoctorDetails(docDetails);
            setLoader(false);
        } else {
            Toast.show({
                type: 'error',  
                text1: respnose.error,
                visibilityTime: 5000,
            });
            setLoader(false);
        }
    }

    const getAllAppointments = async (docNumber: string, date: string) => {
        setLoader(true);
        const respnose = await getAppointments(docNumber, date);
        if (respnose.status === "SUCCESS") {
            const appointments = respnose.data;
            const finalAppointments = appointments?.filter((item: any) => item?.status === AppointmentStatus.ACCEPTED);
            setPatientCount(finalAppointments?.length || "0");
            setAppointments(appointments);
            setLoader(false);
        } else {
            Toast.show({
                type: 'error',  
                text1: respnose.error,
                visibilityTime: 5000,
            });
            setLoader(false);
        }
    }

    const handleStatusUpdate = (status: string, appointmentId: string) => {
        setLoader(true)
        updateAppointment(status, appointmentId)
    }

    const updateAppointment = async (status: string, appointmentId: string) => {
        const updateData = {
            appointmentUpdateType: status,
            updatedBy: "DOCTOR"
        }
        const url = URLS.BASE + URLS.GET_APPOINTMENTS + "/" + appointmentId;
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
                    visibilityTime: 5000,
                });
            }
            setLoader(false);
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            getAllAppointments(doctorId, formattedDate);
        } catch (error: any) {
                Toast.show({
                    type: 'error',  
                    text1: error.response.data.message,
                    visibilityTime: 5000,
                });
            setLoader(false);
        }
    }

    return (
        <View style={{ marginHorizontal: 16, marginTop: 52, position: 'relative', height }} >
            <MainHeader selectedNav="home" />
            {/* <View style={{ width: width - 32, borderRadius: 80, backgroundColor: "#F6F5FA", borderColor: isFocused ? "#2DB9B0" : "#F6F5FA", borderWidth: 1, paddingHorizontal: 20, paddingVertical: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }} >
                <View style={{ position: 'absolute', zIndex: 2, left: 0, top: 0, height: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 40 }} >
                    <Ionicons name='search-circle-outline' size={20} />
                </View>
                <TextInput
                    placeholderTextColor={'#8C8C8C'}
                    style={[styles.input, { marginLeft: 12}]}
                    value={searchValue}
                    onChangeText={(value) => setSearchValue(value)}
                    onBlur={() => setIsFocused(false)}
                    onFocus={() => setIsFocused(true)}
                    placeholder="Search by patient name or number"
                    keyboardType={'default'}
                />
                <Pressable 

                    style={{ position: 'absolute', right: 0, top: 0, borderTopRightRadius: 80, borderBottomRightRadius: 80, backgroundColor: "#2DB9B0", width: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: '100%' }}
                >
                    <Ionicons name='search-circle-outline' size={20} />
                </Pressable>
            </View> */}
            <View style={{ marginTop: 20 }} >
                <View style={{ borderRadius: 8, borderLeftWidth: 8, borderColor: "#0A867E", backgroundColor: "#2DB9B0", paddingLeft: 16, paddingRight: 32, paddingVertical: 12, width: width - 32, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                        <Ionicons name='person-circle' size={20} />
                        <CustomText textStyle={{ fontSize: 12, lineHeight: 16, fontWeight: 600, color: "#FFFFFF", marginLeft: 8 }} text="Total number of patient today:"/>
                    </View>
                    <CustomText textStyle={{ fontSize: 24, lineHeight: 30, fontWeight: 600, color: "#FFFFFF" }} text={patientCount} />
                </View>
                <View style={{ marginTop: 24 }} >
                    <CustomText textStyle={{ fontSize: 16, lineHeight: 20, fontWeight: 600, color: "#32383D" }} text="Today's Appointment" />
                    <View style={{ height: height - 360 }} >
                        <ScrollView
                            ref={scrollViewRef} 
                            style={{ marginTop: 20 }}>
                            {appointments?.map((appointment: any) => {
                                return (
                                    <AppointmentCard key={appointment?._id} appointment={appointment} width={width} handleStatusUpdate={handleStatusUpdate} />
                                );
                            })}
                        </ScrollView>
                    </View>
                </View>
            </View>
            <MainFooter selectedNav='home' />
            {loader && <Loader />}
        </View>
    )
};



export default Home;

const styles = StyleSheet.create({
    input: {
      borderWidth: 1,
      borderRadius: 4,
      padding: 10,
      fontSize: 16,
      paddingTop: 14,
      borderColor: '#F6F5FA',
    },
  });