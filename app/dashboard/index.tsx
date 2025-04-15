import AppointmentCard from '@/components/AppointmentCard';
import Banner from '@/components/Banner';
import CustomButton from '@/components/CustomButton';
import CustomInput2 from '@/components/CustomInput2';
import CustomPopUp from '@/components/CustomPopUp';
import CustomText from '@/components/CustomText';
import Loader from '@/components/Loader';
import MainFooter from '@/components/MainFooter';
import PatientList from '@/components/PatientList';
import SearchBar from '@/components/SearchBar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { finalText, formatDateToYYYYMMDD, getAppointments, getDfo, getDoctorDetails, getPatientList, getSecureKey } from '@/components/Utils';
import { Colors } from '@/constants/Colors';
import { AppointmentStatus, PatientListProps } from '@/constants/Enums';
import { URLS } from '@/constants/Urls';
import { useAppContext } from '@/context/AppContext';
import { textObject } from '@/context/InitialState';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Path, Rect, Svg } from 'react-native-svg';
import Toast from 'react-native-toast-message';


const Home = () => {
    const { setDoctorDetails, setDfo, translations, selectedLanguage } = useAppContext();
    const scrollViewRef = React.useRef(null);
    const { width, height } = Dimensions.get('window');
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
    const colors = Colors[colorScheme];

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
            if (docDetails?.docStatus === "NOT_VERIFIED") {
                const notVerifiedItem = {
                    "id": "not_verified",
                    "label": "You are not verified!",
                    "subLabel": "Verification is in progress",
                    "bannerType": "INFO",
                    "isHidden": false,
                    "buttonData": {
                      "type": "PRIMARY",
                      "label": "Verify Now",
                      "isHidden": true,
                      "isDisabled": false,
                      "pathToGo": ""
                    }
                };
                const currentBanners = [...bannerItems];
                currentBanners.push(notVerifiedItem);
                setBannerItems(currentBanners);
            }
            if (docDetails?.docStatus === "BLOCKED") {
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

    const getHeight = () => {
        const bannersLength = bannerItems?.filter((item: any) => !item?.isHidden)?.length;
        const contentHeight = 300 + (bannersLength * 100)
        return height - contentHeight;
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
                        <CustomText multiLingual={true} textStyle={{ fontSize: 16, lineHeight: 20, fontWeight: 600, color: "#32383D" }} text="No patient found!" />
                    </View>
                )
            }
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
                        <Svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <Rect width="40" height="40" rx="20" fill="#0A867E"/>
                            <Path d="M17.1605 18.87C17.0605 18.86 16.9405 18.86 16.8305 18.87C14.4505 18.79 12.5605 16.84 12.5605 14.44C12.5605 11.99 14.5405 10 17.0005 10C19.4505 10 21.4405 11.99 21.4405 14.44C21.4305 16.84 19.5405 18.79 17.1605 18.87Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <Path d="M24.4093 12C26.3493 12 27.9093 13.57 27.9093 15.5C27.9093 17.39 26.4093 18.93 24.5393 19C24.4593 18.99 24.3693 18.99 24.2793 19" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <Path d="M12.1607 22.56C9.7407 24.18 9.7407 26.82 12.1607 28.43C14.9107 30.27 19.4207 30.27 22.1707 28.43C24.5907 26.81 24.5907 24.17 22.1707 22.56C19.4307 20.73 14.9207 20.73 12.1607 22.56Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <Path d="M26.3398 28C27.0598 27.85 27.7398 27.56 28.2998 27.13C29.8598 25.96 29.8598 24.03 28.2998 22.86C27.7498 22.44 27.0798 22.16 26.3698 22" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </Svg>
                        <ThemedText style={{ fontSize: 16, lineHeight: 16, fontWeight: 600, color: "#FFFFFF", marginLeft: 8 }} >{finalText("Total number of patient today", translations, selectedLanguage)}: </ThemedText>
                    </View>
                    <ThemedText style={{ fontSize: 24, lineHeight: 30, fontWeight: 600, color: "#FFFFFF" }} >{patientCount}</ThemedText>
                </View>
                <View style={{ marginTop: 24 }} >
                    <ThemedText style={{ fontSize: 16, lineHeight: 20, fontWeight: 600 }}>{finalText("My Tasks", translations, selectedLanguage)} </ThemedText>
                    {appointments?.length > 0 ? 
                        <View style={{ height: getHeight() }} >
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
                    :   
                        <View style={{ marginTop: 12, height: 260, display: 'flex', alignItems: 'center' }} >
                            <Image source={require('../../assets/images/noTasks.png')} style={{ height: 175, width: 200 }} resizeMode='contain' />
                            <ThemedText style={{ marginTop: 24, fontSize: 18, lineHeight: 18, fontWeight: 700 }} >{finalText("No Appointments today", translations, selectedLanguage)}!</ThemedText>
                        </View>
                    }
                </View>
            </View>
            <MainFooter selectedNav='home' />
            {showClinicRemider && 
                <CustomPopUp visible={showClinicRemider} onClose={() => setShowClinicReminder(true)}>
                    <ThemedView style={{ display: 'flex', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 32, position: 'relative' }} >
                        <Pressable
                            onPress={() => setShowClinicReminder(false)}
                            style={styles.closeButton}
                        >
                            <Svg width="32" height="32" viewBox="0 0 32 32" fill="none" >
                                <Path d="M24.4009 7.61336C23.8809 7.09336 23.0409 7.09336 22.5209 7.61336L16.0009 14.12L9.48094 7.60002C8.96094 7.08002 8.12094 7.08002 7.60094 7.60002C7.08094 8.12002 7.08094 8.96002 7.60094 9.48002L14.1209 16L7.60094 22.52C7.08094 23.04 7.08094 23.88 7.60094 24.4C8.12094 24.92 8.96094 24.92 9.48094 24.4L16.0009 17.88L22.5209 24.4C23.0409 24.92 23.8809 24.92 24.4009 24.4C24.9209 23.88 24.9209 23.04 24.4009 22.52L17.8809 16L24.4009 9.48002C24.9076 8.97336 24.9076 8.12002 24.4009 7.61336Z" fill="#212B46"/>
                            </Svg>
                        </Pressable>
                        <Image source={require('../../assets/images/clinicReminder.png')} style={styles.image} resizeMode='contain' />
                        <ThemedText style={{ fontSize: 16, lineHeight: 18, fontWeight: 600, marginTop: 24 }} >{finalText("Ready to receive patients?", translations, selectedLanguage)}</ThemedText>
                        <ThemedText style={{ fontSize: 14, lineHeight: 16, fontWeight: 400, marginTop: 8, color: "#757575" }} >{finalText("Set your clinic slots & fees!", translations, selectedLanguage)}</ThemedText>
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
                            <ThemedText style={[styles.closeButtonText, { color: colors.crossIcon }]}>✕</ThemedText>
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
        paddingTop: 62,
        height: "100%",
        position: 'relative'
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
        top: 116,
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