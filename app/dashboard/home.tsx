import AppointmentCard from '@/components/AppointmentCard';
import CustomButton from '@/components/CustomButton';
import Icon from '@/components/Icon';
import Loader from '@/components/Loader';
import { capitalizeWords, changeTimeToAmPm, getAppointments, getTranslations, saveSecureKey } from '@/components/Utils';
import { AppointmentStatus } from '@/constants/Enums';
import { URLS } from '@/constants/Urls';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';


const Home = () => {
    const { doctorDetails, setTranslations } = useAppContext();
    const scrollViewRef = React.useRef(null);
    const { width, height } = Dimensions.get('window');
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>("");
    const [loader, setLoader] = useState<boolean>(false);
    const [appointments, setAppointments] = useState<Array<any>>([]);
    const [patientCount, setPatientCount] = useState<string>('0');

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

        getLanguages();
    },[])

    useEffect(() => {
        if (doctorDetails) {
            const today = new Date();
            console
            const formattedDate = today.toISOString().split('T')[0];
            getAllAppointments(formattedDate)
        }
    }, [doctorDetails])

    const getAllAppointments = async (date: string) => {
        const respnose = await getAppointments(doctorDetails?.phone, date);
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
            getAllAppointments(formattedDate);
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
        <View style={{ marginHorizontal: 16, marginTop: 16 }} >
            <View style={{ width: width - 32, borderRadius: 80, backgroundColor: "#F6F5FA", borderColor: isFocused ? "#2DB9B0" : "#F6F5FA", borderWidth: 1, paddingHorizontal: 20, paddingVertical: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }} >
                <View style={{ position: 'absolute', zIndex: 2, left: 0, top: 0, height: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 40 }} >
                    <Icon iconType='searchIcon' height='20' width='20' />
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
                    <Icon iconType='searchIcon' height='20' width='20' />
                </Pressable>
            </View>
            <View style={{ marginTop: 20 }} >
                <View style={{ borderRadius: 8, borderLeftWidth: 8, borderColor: "#0A867E", backgroundColor: "#2DB9B0", paddingLeft: 16, paddingRight: 32, paddingVertical: 12, width: width - 32, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                        <Icon iconType='patientCountIcon' height='40' width='40' />
                        <Text style={{ fontSize: 12, lineHeight: 16, fontWeight: 600, color: "#FFFFFF", marginLeft: 8 }}>
                            Total number of patient today:
                        </Text>
                    </View>
                    <Text style={{ fontSize: 24, lineHeight: 30, fontWeight: 600, color: "#FFFFFF" }} >
                        {patientCount}
                    </Text>
                </View>
                <View style={{ marginTop: 24 }} >
                    <Text style={{ fontSize: 16, lineHeight: 20, fontWeight: 600, color: "#32383D" }} >
                        Today's Appointment
                    </Text>
                    <View style={{ height: height - 360 }} >
                        <ScrollView
                            ref={scrollViewRef} 
                            style={{ marginTop: 20 }}>
                            {appointments?.map((appointment: any) => {
                                return (
                                    <AppointmentCard appointment={appointment} width={width} handleStatusUpdate={handleStatusUpdate} />
                                );
                            })}
                        </ScrollView>
                    </View>
                </View>
            </View>
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