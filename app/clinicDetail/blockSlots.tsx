import AppointmentDateSelector from '@/components/AppointmentDateSelector';
import CustomButton from '@/components/CustomButton';
import Loader from '@/components/Loader';
import Slot from '@/components/Slot';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { blockSlots, finalText, formatDateToYYYYMMDD, getClinics, getSlots } from '@/components/Utils';
import { Colors } from '@/constants/Colors';
import { useAppContext } from '@/context/AppContext';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

const BlockSlots = () => {
    const { height, width } = Dimensions.get('window');
    const scrollViewRef = React.useRef(null);
    const { doctorDetails, translations, selectedLanguage } = useAppContext();
    const [selectedDay, setSelectedDay] = useState<string>("");
    const [slotsToShow, setSlotsToShow] = useState<Array<any>>([]);
    const [loader, setLoader] = useState<boolean>(true);
    const [clinicId, setClinicId] = useState<string>("");

    const colorScheme = useColorScheme() ?? 'light';

    useEffect(() => {
        const backAction = () => {
            router.replace("/dashboard/profile");
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        const today = new Date();
        const formattedDate = formatDateToYYYYMMDD(today)
        setSelectedDay(formattedDate);
        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        if (doctorDetails) {
            const getClinicId = async () => {
                setLoader(true);
                const respnose = await getClinics(doctorDetails?.phone);
                if (respnose.status === "SUCCESS") {
                    const clinicDetails = respnose.data;
                    setClinicId(clinicDetails?._id);
                } else {
                    Toast.show({
                        type: 'error',  
                        text1: respnose.error,
                        visibilityTime: 3000,
                    });
                    setLoader(false);
                }
            }
            getClinicId();
        }
    }, [doctorDetails])

    useEffect(() => {
        if (clinicId !== "" && selectedDay !== "") {
            getAllSlots(selectedDay)
        }
    },[clinicId, selectedDay])

    const getAllSlots = async (date: string) => {
        setLoader(true);
        const today = new Date(date);
        const formattedDate = formatDateToYYYYMMDD(today)
        const respnose = await getSlots(clinicId, formattedDate);
        if (respnose.status === "SUCCESS") {
            const messageAndSlotObject = respnose.data;
            setSlotsToShow(messageAndSlotObject?.slots?.slots);
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

    const handleSelect = (currentSlot: any) => {
        const currentSlots = [...slotsToShow];
        const finalSlots = currentSlots?.map((slot: any) => {
            if (slot?.startTime === currentSlot?.startTime) {
                return { ...slot, isSelected: !slot?.isSelected }
            } else {
                return { ...slot };
            }
        });
        setSlotsToShow(finalSlots);
    }

    const handleDisable = () => {
        const selectedSlots = getSelectedSlots();
        if (selectedSlots?.length === 0) return true;
        return false;
    }

    const getSelectedSlots = () => {
        let allSelectedSlots: any = [];
        slotsToShow?.forEach((slot: any) => {
            if (slot?.isSelected) {
                allSelectedSlots.push(slot);
            }
        });
        return allSelectedSlots;
    }

    const handleBlock = async () => {
        setLoader(true);
        const selectedSlots = getSelectedSlots();
        const appointments: any = []
        const unblockSlots: any = []
        selectedSlots?.forEach((slot: any) => {
            if (slot?.slotStatus === "LOCKED") {
                unblockSlots.push({ appointmentId: slot?.appointmentId });
            } else {
                appointments.push({
                    doctorId: doctorDetails?.phone,
                    date: selectedDay,
                    startTime: slot?.startTime,
                    endTime: slot?.endTime,
                    isLockedByDoctor: true
                });
            }
        })
        const payload = {
            appointments: appointments,
            unblockSlots: unblockSlots
        }
        const respnose = await blockSlots(payload);
        if (respnose.status === "SUCCESS") {
            router.replace("/dashboard/profile");
        } else {
            Toast.show({
                type: 'error',  
                text1: respnose.error,
                visibilityTime: 3000,
            });
            setLoader(false);
        }
    }

    const handleDateChange = (date: string) => {
        setSelectedDay(date);
        const currentSlots = [...slotsToShow];
        const finalSlots = currentSlots?.map((slot: any) => {
            return { ...slot, isSelected: false }
        });
        setSlotsToShow(finalSlots);
    }

    const getBorderColor = (type?: string) => {
        if (type === "LOCKED") {
            return Colors[colorScheme].slotLockedBg;
        } else if (type === "BOOKED") {
            return Colors[colorScheme].slotBookedBg;
        } else if (type === "SELECT_TO_LOCK") {
            return Colors[colorScheme].slotBackgroundSelected;
        } else if (type === "SELECT_TO_UNLOCK") {
            return Colors[colorScheme].slotBackgroundSelectedUnlock;
        } else {
            return Colors[colorScheme].borderColor;
        }
    }

    const getBgColor = (type?: string) => {
        if (type === "LOCKED") {
            return Colors[colorScheme].slotLockedBg;
        } else if (type === "BOOKED") {
            return Colors[colorScheme].slotBookedBg;
        } else if (type === "SELECT_TO_LOCK") {
            return Colors[colorScheme].slotBackgroundSelected;
        } else if (type === "SELECT_TO_UNLOCK") {
            return Colors[colorScheme].slotBackgroundSelectedUnlock;
        } else {
            return Colors[colorScheme].background;
        }
    }

    return (
        <ThemedView style={styles.container} >
            <View style={{ marginTop: 12 }} >
                <AppointmentDateSelector handleDateChange={handleDateChange} />
            </View>
            <View style={{ marginTop: 12, borderWidth: 1, borderRadius: 12, borderColor: Colors[colorScheme].borderColor, width: width - 32, paddingVertical: 12, paddingHorizontal: 12, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', rowGap: 10, justifyContent: 'space-around' }}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}} >
                    <View style={{ height: 16, width: 16, marginRight: 6, backgroundColor: getBgColor(""), borderWidth: 1, borderColor: getBorderColor(""), borderRadius: 4 }} />
                    <ThemedText style={{ fontSize: 12, lineHeight: 16, fontWeight: 600 }} >{finalText("Open Slot", translations, selectedLanguage)}</ThemedText>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}} >
                    <View style={{ height: 16, width: 16, marginRight: 6, backgroundColor: getBgColor("LOCKED"), borderWidth: 1, borderColor: getBorderColor("LOCKED"), borderRadius: 4 }} />
                    <ThemedText style={{ fontSize: 12, lineHeight: 16, fontWeight: 600 }} >{finalText("Locked Slot", translations, selectedLanguage)}</ThemedText>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}} >
                    <View style={{ height: 16, width: 16, marginRight: 6, backgroundColor: getBgColor("BOOKED"), borderWidth: 1, borderColor: getBorderColor("BOOKED"), borderRadius: 4 }} />
                    <ThemedText style={{ fontSize: 12, lineHeight: 16, fontWeight: 600 }} >{finalText("Booked Slot", translations, selectedLanguage)}</ThemedText>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}} >
                    <View style={{ height: 16, width: 16, marginRight: 6, backgroundColor: getBgColor("SELECT_TO_LOCK"), borderWidth: 1, borderColor: getBorderColor("SELECT_TO_LOCK"), borderRadius: 4 }} />
                    <ThemedText style={{ fontSize: 12, lineHeight: 16, fontWeight: 600 }} >{finalText("Selected to Lock", translations, selectedLanguage)}</ThemedText>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}} >
                    <View style={{ height: 16, width: 16, marginRight: 6, backgroundColor: getBgColor("SELECT_TO_UNLOCK"), borderWidth: 1, borderColor: getBorderColor("SELECT_TO_UNLOCK"), borderRadius: 4 }} />
                    <ThemedText style={{ fontSize: 12, lineHeight: 16, fontWeight: 600 }} >{finalText("Selected to Unlock", translations, selectedLanguage)}</ThemedText>
                </View>
            </View>
            <View style={{ height: height * 0.52 }} >
                <ScrollView
                    ref={scrollViewRef} 
                    style={{ marginTop: 16 }}>
                    {slotsToShow?.length === 0 ?
                        <View style={{ 
                            marginTop: 12, 
                            height: 260,
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
                            <ThemedText style={{ marginTop: 24, fontSize: 18, lineHeight: 18, fontWeight: 700 }} >{finalText(`No Slot Available`, translations, selectedLanguage)}!</ThemedText>
                        </View>
                    : 
                        <View style={{ marginTop: 12, marginBottom: 12, display:'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
                            {slotsToShow?.map((slot: any) => {
                                return (
                                    <Slot key={slot?.startTime} isSelected={slot?.isSelected} slot={slot} onSelectSlot={handleSelect} />
                                );
                            })}
                        </View>
                    }
                </ScrollView>
            </View>
            {!loader && <View style={{ display: "flex", alignItems: "center", position: 'absolute', bottom: 16, right: 16, left: 16, paddingBottom: 16 }} >
                <CustomButton multiLingual={true} width='FULL' title="Block Slots" onPress={handleBlock}  isDisabled={handleDisable()} />
            </View>}
            {loader && <Loader />}
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        flex: 1,
        position: 'relative'
    },
});

export default BlockSlots;
