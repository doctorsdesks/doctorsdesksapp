import AppointmentCardTwo from '@/components/AppointmentCardTwo';
import AppointmentDateSelector from '@/components/AppointmentDateSelector';
import CustomText from '@/components/CustomText';
import Loader from '@/components/Loader';
import MainFooter from '@/components/MainFooter';
import MainHeader from '@/components/MainHeader';
import Navbar, { NavbarObject } from '@/components/Navbar';
import { finalText, formatDateToYYYYMMDD, getAppointments } from '@/components/Utils';
import { AppointmentStatus, AppointmentType } from '@/constants/Enums';
import { URLS } from '@/constants/Urls';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, ScrollView, View } from 'react-native';
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
    const [loader, setLoader] = useState<boolean>(false);

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
        const respnose = await getAppointments(doctorDetails?.phone, date);
        if (respnose.status === "SUCCESS") {
            const appointmentsCurrent = respnose.data;
            const completeOrAcceptedAppointments = appointmentsCurrent?.filter((item: any) => item?.status === AppointmentStatus.ACCEPTED || item?.status === AppointmentStatus.COMPLETED);
            setAppointments(completeOrAcceptedAppointments);
            const normalAppointment = completeOrAcceptedAppointments?.filter((item: any) => item?.appointmentType === AppointmentType.OPD);
            const emergencyAppointment = completeOrAcceptedAppointments?.filter((item: any) => item?.appointmentType === AppointmentType.EMERGENCY);
            const newNavData = navData?.map((item: NavbarObject) => {
                if (item?.label?.split(" ")[0] === "Normal") {
                    const languageText = finalText("Normal", translations, selectedLanguage)
                    return { ...item, label: `${languageText} (${normalAppointment?.length})`, isActive: true }
                } else {
                    const languageText = finalText("Emergency", translations, selectedLanguage)
                    return { ...item, label: `${languageText} (${emergencyAppointment?.length})`, isActive: false }
                }
            });
            setNavData(newNavData);
            setFilteredAppointments(normalAppointment || []);
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

    const handleDateChange = (date: string) => {
        setSelectedDay(date);
    }

    return (
        <View style={{ marginHorizontal: 16, marginTop: 52, position: 'relative', height }} >
            <MainHeader selectedNav="appointment" />
            <Navbar data={navData} onClick={handleNavClick} />
            <View style={{ marginTop: 24 }} >
                <AppointmentDateSelector handleDateChange={handleDateChange} />
            </View>
            <View style={{ height: height - 320 }} >
                <ScrollView
                    ref={scrollViewRef} 
                    style={{ marginTop: 20 }}>
                    {filteredAppointments?.length === 0 ?
                        <CustomText multiLingual={true} textStyle={{ fontSize: 16, lineHeight: 20, fontWeight: 600, color: "#32383D" }} text="No Appointment Today!" />
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
        </View>
    );
};

export default Appointments;