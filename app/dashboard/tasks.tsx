import AppointmentCard from '@/components/AppointmentCard';
import CustomText from '@/components/CustomText';
import Loader from '@/components/Loader';
import MainFooter from '@/components/MainFooter';
import Navbar, { NavbarObject } from '@/components/Navbar';
import { getAppointments } from '@/components/Utils';
import { AppointmentStatus } from '@/constants/Enums';
import { URLS } from '@/constants/Urls';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, ScrollView, View } from 'react-native';
import Toast from 'react-native-toast-message';

const Tasks = () => {
    const { height, width } = Dimensions.get('window');
    const scrollViewRef = React.useRef(null);
    const { doctorDetails } = useAppContext();
    const [navData, setNavData] = useState<Array<NavbarObject>>([
        {
            label: "Upcoming",
            isActive: true,
        },
        {
            label: "Pending",
            isActive: false,
        },
        {
            label: "Completed",
            isActive: false,
        },
        {
            label: "Cancelled",
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

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        if (doctorDetails) {
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            getAllAppointments(formattedDate)
        }
    }, [doctorDetails])

    const getAllAppointments = async (date: string) => {
        const respnose = await getAppointments(doctorDetails?.phone, date);
        if (respnose.status === "SUCCESS") {
            const appointments = respnose.data;
            setAppointments(appointments);
            const filterApp = appointments?.filter((item: any) => item?.status === AppointmentStatus.ACCEPTED);
            setFilteredAppointments(filterApp || []);
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
        switch (value) {
            case "Upcoming":
                filterApp = appointments?.filter((item: any) => item?.status === AppointmentStatus.ACCEPTED);
                break;
            case "Pending":
                filterApp = appointments?.filter((item: any) => item?.status === AppointmentStatus.PENDING);
                break;
            case "Completed":
                filterApp = appointments?.filter((item: any) => item?.status === AppointmentStatus.COMPLETED);
                break;
            case "Cancelled":
                filterApp = appointments?.filter((item: any) => item?.status === AppointmentStatus.CANCELLED);
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

    return (
        <View style={{ marginHorizontal: 16, marginTop: 52, position: 'relative', height }} >
            <Navbar data={navData} onClick={handleNavClick} />
            <View style={{ height: height - 160 }} >
                <ScrollView
                    ref={scrollViewRef} 
                    style={{ marginTop: 20 }}>
                    {filteredAppointments?.length === 0 ?
                        <View>
                            <CustomText textStyle={{ fontSize: 16, fontWeight: 600, color: "#32383D" }} text="No Appointment" />
                        </View>
                    :
                        filteredAppointments?.map((appointment: any) => {
                            return (
                                <AppointmentCard appointment={appointment} width={width} handleStatusUpdate={handleStatusUpdate} />
                            );
                        })}
                </ScrollView>
            </View>
            <MainFooter selectedNav='task' />
            {loader && <Loader />}
        </View>
    );
};

export default Tasks;