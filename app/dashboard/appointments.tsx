import AppointmentCardTwo from '@/components/AppointmentCardTwo';
import AppointmentDateSelector from '@/components/AppointmentDateSelector';
import Loader from '@/components/Loader';
import MainFooter from '@/components/MainFooter';
import MainHeader from '@/components/MainHeader';
import Navbar, { NavbarObject } from '@/components/Navbar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { finalText, formatDateToYYYYMMDD, getAppointments } from '@/components/Utils';
import { Colors } from '@/constants/Colors';
import { AppointmentStatus, AppointmentType } from '@/constants/Enums';
import { URLS } from '@/constants/Urls';
import { useAppContext } from '@/context/AppContext';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

const Appointments = () => {
    const { height } = Dimensions.get('window');
    const scrollViewRef = React.useRef(null);
    const { doctorDetails, translations, selectedLanguage } = useAppContext();
    const [selectedDay, setSelectedDay] = useState<string>("");
    const [navData, setNavData] = useState<Array<NavbarObject>>([
        {
            label: "Normal",
            isActive: true,
        },
        {
            label: "Emergency",
            isActive: false,
        }
    ]);
    const [appointments, setAppointments] = useState<Array<any>>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<Array<any>>([]);
    const [loader, setLoader] = useState<boolean>(true);

    const colorScheme = useColorScheme() ?? 'light';

    useEffect(() => {
        const backAction = () => {
            router.replace("/dashboard");
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        const today = new Date();
        const formattedDate = formatDateToYYYYMMDD(today)
        setSelectedDay(formattedDate);
        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        if (doctorDetails && selectedDay !== "") {
            getAllAppointments(selectedDay)
        }
    }, [doctorDetails, selectedDay])

    const getAllAppointments = async (date: string) => {
        setLoader(true);
        const respnose = await getAppointments(doctorDetails?.phone, date);
        if (respnose.status === "SUCCESS") {
            const appointmentsCurrent = respnose.data;
            const completeOrAcceptedAppointments = appointmentsCurrent?.filter((item: any) => item?.status === AppointmentStatus.ACCEPTED || item?.status === AppointmentStatus.COMPLETED);
            setAppointments(completeOrAcceptedAppointments);
            const normalAppointment = completeOrAcceptedAppointments?.filter((item: any) => item?.appointmentType === AppointmentType.OPD);
            const emergencyAppointment = completeOrAcceptedAppointments?.filter((item: any) => item?.appointmentType === AppointmentType.EMERGENCY);
            const newNavData = navData?.map((item: NavbarObject) => {
                if (item?.label?.split(" ")[0] === "Normal") {
                    return { ...item, label: `Normal (${normalAppointment?.length})`, isActive: true }
                } else {
                    return { ...item, label: `Emergency (${emergencyAppointment?.length})`, isActive: false }
                }
            });
            setNavData(newNavData);
            setFilteredAppointments(normalAppointment || []);
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

    const handleNavClick = (value: string) => {
        const newNavData = navData?.map((item: NavbarObject) => ({ ...item, isActive: item?.label === value ? true : false }));
        setNavData(newNavData);
        let filterApp: any = [];
        const [navValue] = value?.split(" ");
        switch (navValue) {
            case "Normal":
                filterApp = appointments?.filter((item: any) => item?.appointmentType === AppointmentType.OPD);
                break;
            case "Emergency":
                filterApp = appointments?.filter((item: any) => item?.appointmentType === AppointmentType.EMERGENCY);
                break;
            default:
                break;
        }
        setFilteredAppointments(filterApp);
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
                    visibilityTime: 3000,
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
                    visibilityTime: 3000,
                });
            setLoader(false);
        }
    }

    const handleDateChange = (date: string) => {
        setSelectedDay(date);
    }

    return (
        <ThemedView style={styles.container} >
            <MainHeader selectedNav="appointment" />
            <Navbar data={navData} onClick={handleNavClick} source="appointment" />
            <View style={{ marginTop: 24 }} >
                <AppointmentDateSelector handleDateChange={handleDateChange} />
            </View>
            <View style={{ height: height - 320 }} >
                <ScrollView
                    ref={scrollViewRef} 
                    style={{ marginTop: 20 }}>
                    {filteredAppointments?.length === 0 ?
                        <View style={{ 
                            marginTop: 12, 
                            height: 320,
                            marginHorizontal: 4,
                            marginBottom: 12,
                            display: 'flex', 
                            alignItems: 'center', 
                            backgroundColor: Colors[colorScheme].cardBg,
                            shadowColor: '#000000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.1,
                            shadowRadius: 12,
                            elevation: 4,
                            borderRadius: 12,
                        }} >
                            <Image source={require('../../assets/images/noTasks.png')} style={{ height: 175, width: 200 }} resizeMode='contain' />
                            <ThemedText style={{ marginTop: 24, fontSize: 18, lineHeight: 22, fontWeight: 700 }} >{finalText(`No ${navData?.filter((item: any) => item?.isActive)[0]?.label?.split(" ")[0]} Appointments`, translations, selectedLanguage)}!</ThemedText>
                        </View>
                    : 
                        filteredAppointments?.map((appointment: any, index: number) => {
                        return (
                            <AppointmentCardTwo key={appointment?._id} lastAppointment={index === filteredAppointments?.length - 1} firstAppointment={index === 0} status={appointment?.status} name={appointment?.doctorName} number={appointment?.patientId} startTime={appointment?.startTime} handleStatusUpdate={(status: string) => handleStatusUpdate(status, appointment?._id)} />
                        );
                    })}
                </ScrollView>
            </View>
            <MainFooter selectedNav='appointment' />
            {loader && <Loader />}
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

export default Appointments;