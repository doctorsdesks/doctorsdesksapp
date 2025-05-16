import AppointmentCard from '@/components/AppointmentCard';
import CustomButton from '@/components/CustomButton';
import CustomInput2 from '@/components/CustomInput2';
import CustomPopUp from '@/components/CustomPopUp';
import Icon from '@/components/Icons';
import Loader from '@/components/Loader';
import Navbar, { NavbarObject } from '@/components/Navbar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { finalText, getAppointments, getSecureKey } from '@/components/Utils';
import { Colors } from '@/constants/Colors';
import { AppointmentStatus } from '@/constants/Enums';
import { URLS } from '@/constants/Urls';
import { useAppContext } from '@/context/AppContext';
import { textObject } from '@/context/InitialState';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

const Tasks = () => {
    const { height, width } = Dimensions.get('window');
    const scrollViewRef = React.useRef(null);
    const { doctorDetails, translations, selectedLanguage } = useAppContext();
    const [navData, setNavData] = useState<Array<NavbarObject>>([
        {
            label: "Pending",
            isActive: true,
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
    const [loader, setLoader] = useState<boolean>(true);
    const [showCancelPopUp, setShowCancelPopUp] = useState<boolean>(false);
    const [cancelReason, setCancelReason] = useState<any>(textObject);

    const colorScheme = useColorScheme() ?? 'light';

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
            getAllAppointments(doctorDetails?.phone)
        }
    }, [doctorDetails])

    useEffect(() => {
        if (!showCancelPopUp) {
            setCancelReason({ ...cancelReason, appointmentId: "", value: "" });
        }
    }, [showCancelPopUp])

    const getAllAppointments = async (phone: string) => {
        const respnose = await getAppointments(phone);
        if (respnose.status === "SUCCESS") {
            const appointments = respnose.data;
            setAppointments(appointments);
            const filterApp = appointments?.filter((item: any) => item?.status === AppointmentStatus.PENDING);
            setFilteredAppointments(filterApp || []);
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
        switch (value) {
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
        if(status === "CANCEL") {
            setCancelReason({ ...cancelReason, appointmentId: appointmentId });
            setShowCancelPopUp(true);
        } else {
            setLoader(true)
            updateAppointment(status, appointmentId)
        }
    }

    const updateAppointment = async (status: string, appointmentId: string) => {
        setLoader(true)
        const updateData: any = {
            appointmentUpdateType: status,
            updatedBy: "DOCTOR"
        }
        if (status === "CANCEL") {
            updateData.reasonForCancel = cancelReason?.value;
        }
        const url = URLS.BASE + URLS.GET_APPOINTMENTS + "/update?id=" + appointmentId;
        const authToken = await getSecureKey("userAuthtoken");
        try {
            const response = await axios.post(url, updateData,
              {
                headers: {
                  'X-Requested-With': 'nirvaanhealth_web_app',
                  "Authorization": `Bearer ${authToken}`
                },
              }
            );
            const { data, status } = response;
            if (status === 201){
                setShowCancelPopUp(false)
                Toast.show({
                    type: 'success',  
                    text1: data.message,
                    visibilityTime: 3000,
                });
                setLoader(false);
                getAllAppointments(doctorDetails?.phone);
            } else {
                Toast.show({
                    type: 'error',  
                    text1: "Something wrong happened! Please try again.",
                    visibilityTime: 3000,
                });
                setLoader(false);
            }
        } catch (error: any) {
                Toast.show({
                    type: 'error',  
                    text1: error.response.data.message,
                    visibilityTime: 3000,
                });
            setLoader(false);
        }
    }

    const handleCancelReason = (value: string, id: string) => {
        setCancelReason({ ...cancelReason, value: value, isError: value === "" });
    }

    return (
        <ThemedView style={styles.container} >
            <Navbar data={navData} onClick={handleNavClick} />
            <View style={{ height: height - 180 }} >
                <ScrollView
                    ref={scrollViewRef} 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20, marginTop: 20 }}
                >
                    {filteredAppointments?.length === 0 ?
                        <View style={{ 
                            marginTop: 12, 
                            height: height * 0.65,
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
                            <ThemedText style={{ marginTop: 24, fontSize: 18, lineHeight: 22, fontWeight: 700 }} >{finalText(`No ${navData?.filter((item: any) => item?.isActive)[0]?.label} Appointments`, translations, selectedLanguage)}!</ThemedText>
                        </View>
                    :
                        filteredAppointments?.map((appointment: any) => {
                            return (
                                <AppointmentCard key={appointment?._id} appointment={appointment} width={width} handleStatusUpdate={handleStatusUpdate} />
                            );
                        })}
                </ScrollView>
            </View>
            {showCancelPopUp && 
                <CustomPopUp visible={showCancelPopUp} onClose={() => setShowCancelPopUp(true)}>
                    <ThemedView style={{ display: 'flex', alignItems: "flex-start", paddingVertical: 32, paddingTop: 40, position: 'relative' }} >
                        <Pressable
                            onPress={() => setShowCancelPopUp(false)}
                            style={styles.closeButton}
                        >
                            <Icon type='cross' />
                        </Pressable>
                        <View style={{ display: "flex", width: width - 64, marginTop: 20 }} >
                            <CustomInput2 data={cancelReason} onChange={handleCancelReason} />
                        </View>
                        <View style={{ display: "flex", width: width - 64, marginTop: 20 }} >
                            <CustomButton multiLingual={true} width='FULL' title="Cancel Appointment" isDisabled={cancelReason?.value === ""} onPress={() => updateAppointment("CANCEL", cancelReason?.appointmentId)} />
                        </View>
                    </ThemedView>
                </CustomPopUp>
            }
            {loader && <Loader />}
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 80, // Increased bottom padding to account for footer
    },
    closeButton: {
        padding: 8,
        position: 'absolute',
        right: 8,
        top: 8
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: '900',
    },
})

export default Tasks;
