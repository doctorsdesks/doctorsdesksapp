import AppointmentCard from '@/components/AppointmentCard';
import CustomModalRaiseRequest from '@/components/CustomModalRaiseRequest';
import DoctorCard from '@/components/DoctorCard';
import Icon from '@/components/Icons';
import Loader from '@/components/Loader';
import Navbar, { NavbarObject } from '@/components/Navbar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { finalText, getAllDoctorsByHospital, raiseRequestForDoctor } from '@/components/Utils';
import { Colors } from '@/constants/Colors';
import { DoctorRequest, RequestStatus } from '@/constants/Enums';
import { useAppContext } from '@/context/AppContext';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

const Tasks = () => {
    const { height, width } = Dimensions.get('window');
    const scrollViewRef = React.useRef(null);
    const { hospitalDetails, translations, selectedLanguage } = useAppContext();
    const [navData, setNavData] = useState<Array<NavbarObject>>([
        {
            label: "Doctors",
            isActive: true,
        },
        {
            label: "Requests",
            isActive: false,
        },
    ]);
    const [doctors, setDoctors] = useState<Array<any>>([]);
    const [dataToShow, setDataToShow] = useState<Array<any>>([]);
    const [loader, setLoader] = useState<boolean>(true);
    const [showRaiseRequestModal, setShowRaiseRequestModal] = useState(false);

    const colorScheme = useColorScheme() ?? 'light';

    useEffect(() => {
        const backAction = () => {
            router.replace("/hospitalDashboard");
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        if (hospitalDetails) {
            getAllDoctors(hospitalDetails?.hospitalId)
        }
    }, [hospitalDetails])

    const getAllDoctors = async (hospitalId: string) => {
        const respnose = await getAllDoctorsByHospital(hospitalId);
        if (respnose.status === "SUCCESS") {
            const doctors = respnose.data;
            setDoctors(doctors);
            const filterApp = doctors?.filter((item: any) => item?.requestStatus === RequestStatus.ACCEPTED);
            setDataToShow(filterApp || []);
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

    const handleRaiseRequest = async (data: DoctorRequest) => {
        setLoader(true);
        const respnose = await raiseRequestForDoctor({ ...data, hospitalId: hospitalDetails?.hospitalId});
        if (respnose.status === "SUCCESS") {
            setShowRaiseRequestModal(false);
            getAllDoctors(hospitalDetails?.hospitalId);
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
            case "Doctors":
                filterApp = doctors?.filter((item: any) => item?.requestStatus === RequestStatus.ACCEPTED);
                break;
            case "Requests":
                filterApp = doctors?.filter((item: any) => item?.requestStatus === RequestStatus.PENDING || item?.requestStatus === RequestStatus.REJECTED);
                break;
            default:
                break;
        }
        setDataToShow(filterApp);
    }

    return (
        <ThemedView style={styles.container} >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 18,
                }}
            >
                <View>
                    <ThemedText
                        style={{
                            fontSize: 18,
                            lineHeight: 22,
                            fontWeight: "700",
                        }}
                    >
                        Doctors
                    </ThemedText>

                    <ThemedText
                        style={{
                            marginTop: 2,
                            fontSize: 12,
                            lineHeight: 16,
                            color: "#6B7A90",
                        }}
                    >
                        Manage doctors and requests
                    </ThemedText>
                </View>
                <Pressable
                    onPress={() => setShowRaiseRequestModal(true)}
                    style={({ pressed }) => ({
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: pressed ? "#26AAA1" : "#2DB9B0",
                        borderRadius: 30,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        shadowColor: "#2DB9B0",
                        shadowOffset: {
                            width: 0,
                            height: 6,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 8,
                        elevation: 6,
                    })}
                >
                    <View
                        style={{
                            height: 28,
                            width: 28,
                            borderRadius: 14,
                            backgroundColor: "rgba(255,255,255,0.18)",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 8,
                        }}
                    >
                        <Icon
                            type="addCircle"
                            fill="#FFFFFF"
                        />
                    </View>

                    <ThemedText
                        style={{
                            color: "#FFFFFF",
                            fontSize: 16,
                            lineHeight: 20,
                            fontWeight: "500",
                        }}
                    >
                        Add Doctor
                    </ThemedText>
                </Pressable>
            </View>
            <Navbar data={navData} onClick={handleNavClick} />
            <View style={{ height: height - 180 }} >
                <ScrollView
                    ref={scrollViewRef} 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20, marginTop: 20 }}
                >
                    {dataToShow?.length === 0 ?
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
                            <ThemedText style={{ marginTop: 24, fontSize: 18, lineHeight: 22, fontWeight: 700 }} >{finalText(`No ${navData?.filter((item: any) => item?.isActive)[0]?.label} available`, translations, selectedLanguage)}!</ThemedText>
                        </View>
                    :
                        dataToShow?.map((doctor: any) => {
                            return (
                                <DoctorCard
                                    key={doctor._id}
                                    doctorMapping={doctor}
                                    hospitalId={hospitalDetails?.hospitalId}
                                />
                            );
                        })}
                </ScrollView>
            </View>
            {showRaiseRequestModal &&
            <CustomModalRaiseRequest
                visible={showRaiseRequestModal}
                onClose={() => setShowRaiseRequestModal(false)}
                onSubmit={(data) => handleRaiseRequest(data)}
            />
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
