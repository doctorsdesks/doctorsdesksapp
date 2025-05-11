import AppointmentCard from '@/components/AppointmentCard';
import Banner from '@/components/Banner';
import CustomButton from '@/components/CustomButton';
import CustomInput2 from '@/components/CustomInput2';
import CustomPopUp from '@/components/CustomPopUp';
import Icon from '@/components/Icons';
import Loader from '@/components/Loader';
import PatientList from '@/components/PatientList';
import SearchBar from '@/components/SearchBar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { finalText, formatDateToYYYYMMDD, getAppointments, getBanners, getDfo, getDoctorDetails, getPatientList, getSecureKey } from '@/components/Utils';
import { Colors } from '@/constants/Colors';
import { AppointmentStatus, DocStatusType, PatientListProps } from '@/constants/Enums';
import { URLS } from '@/constants/Urls';
import { useAppContext } from '@/context/AppContext';
import { textObject } from '@/context/InitialState';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';


const Home = () => {
    const { setDoctorDetails, setDfo, translations, selectedLanguage } = useAppContext();
    const { width } = Dimensions.get('window');
    const [isListOpened, setIsListOpened] = useState<boolean>(false);
    const [loader, setLoader] = useState<boolean>(true);
    const [appointments, setAppointments] = useState<Array<any>>([]);
    const [patientCount, setPatientCount] = useState<string>('0');
    const [doctorId, setDoctorId] = useState<string>("");
    const [patientList, setPatientList] = useState<PatientListProps[]>([]);
    const [showPatientList, setShowPatientList] = useState<boolean>(false);
    const [showClinicRemider, setShowClinicReminder] = useState<boolean>(false);
    const [bannerItems, setBannerItems] = useState<any[]>([]);
    const [showCancelPopUp, setShowCancelPopUp] = useState<boolean>(false);
    const [cancelReason, setCancelReason] = useState<any>(textObject);

    const colorScheme = useColorScheme() ?? 'light';

    useEffect(() => {
        const getDoctorId =  async () => {
            const value = await getSecureKey("doctorId");
            if (value) {
                setDoctorId(value);
            }
        }
        getDoctorId();
    },[])

    useEffect(() => {
        if (doctorId !== "") {
            const today = new Date();
            const formattedDate = formatDateToYYYYMMDD(today)
            findDoctor(doctorId)
            getDfoInfo(doctorId)
            getAllAppointments(doctorId, formattedDate)
        }
    }, [doctorId])

    useEffect(() => {
        if (!showCancelPopUp) {
            setCancelReason({ ...cancelReason, appointmentId: "", value: "" });
        }
    }, [showCancelPopUp])

    const getDfoInfo = async (docNumber: string) => {
        setLoader(true);
        const response = await getDfo(docNumber);
        if (response.status === "SUCCESS") {
            const dfoDetails = response.data?.dfo;
            if (!dfoDetails?.isClinicTimingSet || !dfoDetails?.isClinicFeeSet) {
                setShowClinicReminder(true);
            }
            setDfo(dfoDetails);
            setLoader(false);
        } else {
            Toast.show({
                type: 'error',  
                text1: response.error,
                visibilityTime: 3000,
            });
            setLoader(false);
        }
    }

    const findDoctor = async (docNumber: string) => {
        setLoader(true);
        const response = await getDoctorDetails(docNumber);
        if (response.status === "SUCCESS") {
            const docDetails = response.data;
            setDoctorDetails(docDetails);
            findBanners(docNumber ,docDetails?.docStatus)
            if (docDetails?.docStatus === DocStatusType.BLOCKED) {
                router.replace("/successSignUp/block");
            }
            setLoader(false);
        } else {
            Toast.show({
                type: 'error',
                text1: response.error,
                visibilityTime: 3000,
            });
            setLoader(false);
        }
    }

    const findBanners = async (phone: string, docStatus: string) => {
        const response = await getBanners(phone);
        if (response.status === "SUCCESS") {
            let currentBanners = response.data?.banners || [];
            if (docStatus === DocStatusType.NOT_VERIFIED) {
                const notVerifiedItem = {
                    "id": "not_verified",
                    "label": "You are not verified!",
                    "subLabel": "Verification is in progress",
                    "bannerType": "INFO",
                    "iconType": "notVerifiedBanner",
                    "isHidden": false,
                    "buttonData": {
                      "type": "PRIMARY",
                      "label": "Verify Now",
                      "isHidden": true,
                      "isDisabled": false,
                      "pathToGo": ""
                    }
                };
                currentBanners.push(notVerifiedItem);

                setBannerItems(currentBanners);
            }
            setBannerItems(currentBanners);
            setLoader(false);
        } else {
            Toast.show({
                type: 'error',  
                text1: response.error,
                visibilityTime: 3000,
            });
            setLoader(false);
        }
    }

    const getAllAppointments = async (docNumber: string, date: string) => {
        setLoader(true);
        const response = await getAppointments(docNumber, date);
        if (response.status === "SUCCESS") {
            const appointments = response.data;
            const finalAppointments = appointments?.filter((item: any) => item?.status === AppointmentStatus.ACCEPTED);
            setPatientCount(finalAppointments?.length || "0");
            setAppointments(appointments);
            setLoader(false);
        } else {
            Toast.show({
                type: 'error',  
                text1: response.error,
                visibilityTime: 3000,
            });
            setLoader(false);
        }
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
        setLoader(true);
        let updateData: any = {
            appointmentUpdateType: status,
            updatedBy: "DOCTOR"
        }
        if (status === "CANCEL") {
            updateData.reasonForCancel = cancelReason?.value;
        }
        const url = URLS.BASE + URLS.UPDATE_APPOINTMENTS + "?id=" + appointmentId;
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
                setShowCancelPopUp(false);
                const today = new Date();
                const formattedDate = formatDateToYYYYMMDD(today)
                getAllAppointments(doctorId, formattedDate);
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

    const searchPatients = async (searchText: string) => {
        if (searchText?.length >= 3) {
            const response = await getPatientList(searchText);
            if (response.status === "SUCCESS") {
                setPatientList(response?.data || []);
                setIsListOpened(true);
                setShowPatientList(true);
            } else {
                Toast.show({
                    type: 'error',  
                    text1: response.error,
                    visibilityTime: 3000,
                });
            }
        } else {
            setShowPatientList(false);
            setIsListOpened(false);
            setPatientList([]);
        }
    };

    const goToProfile = () => {
        router.replace("/dashboard/profile");
    }

    const handleCancelReason = (value: string, id: string) => {
        setCancelReason({ ...cancelReason, value: value, isError: value === "" });
    }

    return (
        <ThemedView style={styles.container} >
            <SearchBar searchPatients={searchPatients}  showPatientList={showPatientList} listOpened={isListOpened} />
            {showPatientList &&
                (patientList?.length > 0 ?
                    <PatientList patientList={patientList} />
                : 
                    <View style={styles.list}>
                        <ThemedText style={{ fontSize: 16, lineHeight: 20, fontWeight: 600 }} >{finalText("No patient found", translations, selectedLanguage)}! </ThemedText>
                    </View>
                )
            }
            <ScrollView
                contentContainerStyle={{ paddingBottom: 20 }} // Add padding to ensure content doesn't go behind footer
            >
                <View style={{ marginTop: 20 }} >
                    {bannerItems?.map((banner: any) => {
                        if (banner?.isHidden) return <></>;
                        return (
                            <Banner key={banner?.id} item={banner} />
                        )
                    })}
                </View>
                <View>
                    <View style={{ 
                            borderRadius: 8, 
                            borderLeftWidth: 8, 
                            borderColor: "#0A867E", 
                            paddingLeft: 8, 
                            paddingRight: 32, 
                            paddingVertical: 12, 
                            width: width - 32, 
                            display: 'flex', 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            backgroundColor: "#12B6A7"
                    }}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                            <Icon type='user' />
                            <ThemedText style={{ fontSize: 16, lineHeight: 20, fontWeight: 600, color: "#FFFFFF", marginLeft: 8 }} >{finalText("Total number of patient today", translations, selectedLanguage)}: </ThemedText>
                        </View>
                        <ThemedText style={{ fontSize: 24, lineHeight: 30, fontWeight: 600, color: "#FFFFFF" }} >{patientCount}</ThemedText>
                    </View>
                    <View style={{ marginTop: 24 }} >
                        <ThemedText style={{ fontSize: 16, lineHeight: 20, fontWeight: 600 }}>{finalText("My Tasks", translations, selectedLanguage)} </ThemedText>
                        {appointments?.length > 0 ? 
                            <View >
                                {appointments?.map((appointment: any) => {
                                    return (
                                        <AppointmentCard key={appointment?._id} appointment={appointment} width={width} handleStatusUpdate={handleStatusUpdate} />
                                    );
                                })}
                            </View>
                        :   
                            <View style={{ 
                                marginTop: 12, 
                                height: 320, 
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
                                <ThemedText style={{ marginTop: 24, fontSize: 18, lineHeight: 22, fontWeight: 700 }} >{finalText("No Appointment today", translations, selectedLanguage)}!</ThemedText>
                            </View>
                        }
                    </View>
                </View>
            </ScrollView>
            {showClinicRemider && 
                <CustomPopUp visible={showClinicRemider} onClose={() => setShowClinicReminder(true)}>
                    <ThemedView style={{ display: 'flex', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 32, position: 'relative' }} >
                        <Pressable
                            onPress={() => setShowClinicReminder(false)}
                            style={styles.closeButton}
                        >
                            <Icon type='cross' fill={Colors[colorScheme].icon} />
                        </Pressable>
                        <Image source={require('../../assets/images/clinicReminder.png')} style={styles.image} resizeMode='contain' />
                        <ThemedText style={{ fontSize: 16, lineHeight: 20, fontWeight: 600, marginTop: 24 }} >{finalText("Ready to receive patients", translations, selectedLanguage)}?</ThemedText>
                        <ThemedText style={{ fontSize: 14, lineHeight: 18, fontWeight: 400, marginTop: 8, color: "#757575" }} >{finalText("Set your clinic slots & fees", translations, selectedLanguage)}!</ThemedText>
                        <View style={{ display: "flex", width: width - 64, marginTop: 20 }} >
                            <CustomButton multiLingual={true} width='FULL' title="Go to profile" onPress={goToProfile} />
                        </View>
                    </ThemedView>
                </CustomPopUp>
            }
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
    )
};



export default Home;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 80, // Increased bottom padding to account for footer
    },
    input: {
      borderWidth: 1,
      borderRadius: 4,
      padding: 10,
      fontSize: 16,
      paddingTop: 14,
      borderColor: '#F6F5FA',
    },
    list: {
        position: 'absolute',
        top: 76,
        left: 16,
        right: 16,
        height: 80,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomLeftRadius: 34,
        borderBottomRightRadius: 34,
        borderColor: '#2DB9B0',
        zIndex: 20,
        overflow: 'hidden',
        padding: 24,
    },
    image: {
        height: 100,
        width: 100
    },
    closeButton: {
        padding: 8,
        position: 'absolute',
        right: 0,
        top: 8
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: '900',
    },
  });
