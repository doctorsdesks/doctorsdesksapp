import CustomButton from '@/components/CustomButton';
import CustomInput2 from '@/components/CustomInput2';
import Icon from '@/components/Icons';
import Loader from '@/components/Loader';
import MainHeader from '@/components/MainHeader';
import ManageSlotTiming from '@/components/ManageSlotTiming';
import Navbar, { NavbarObject } from '@/components/Navbar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { changeTimeToAmPm, changeTimeTwentyFourHours, finalText, getClinics, updateClinic } from '@/components/Utils';
import { Colors } from '@/constants/Colors';
import { StringObject } from '@/constants/Enums';
import { useAppContext } from '@/context/AppContext';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, Image, Keyboard, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

const ManageSlotDurationAndTiming = () => {
    const scrollViewRef = React.useRef(null);
    const { doctorDetails, translations, selectedLanguage } = useAppContext();
    const { isEditablePath } = useLocalSearchParams();
    const { height } = Dimensions.get('window');
    const [slotDurationObject, setSlotDurationObject] = useState<StringObject>({
        id: "slotDuration",
        type: "STRING",
        inputType: "NUMBER",
        value: "",
        label: "Slot Duration (Minutes)",
        isMandatory: true,
        errorMessage: "Slot duration must be at least 5 minutes",
        placeholder: "Enter in minutes",
        isDisabled: true,
    })
    const [isEditable, setIsEditable] = useState<boolean>(isEditablePath && isEditablePath === "true" ? true : false);
    const [loader, setLoader] = useState<boolean>(true);
    const [timings, setTimings] = useState<any>([]);
    const [clinicId, setClinicId] = useState<string>("");
    const [isAddSlots, setIsAddSlots] = useState<boolean>(false);
    const [eachDayChange, setEachDayChange] = useState<any>(null);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);

    const colorScheme = useColorScheme() ?? 'light';

    useEffect(() => {
        const backAction = () => {
            router.replace("/dashboard/profile");
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
            setIsKeyboardOpen(true)
        );
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
           setIsKeyboardOpen(false)
        );

        return () => {
            backHandler?.remove();
            keyboardDidShowListener?.remove();
            keyboardDidHideListener?.remove();
        };
    }, []);

    useEffect(() => {
        const getTimingDetails = async () => {
            setLoader(true);
            const respnose = await getClinics(doctorDetails?.phone);
            if (respnose.status === "SUCCESS") {
                const timingDetails = respnose.data;
                setClinicId(timingDetails?._id);
                const comingSlotDuration = timingDetails?.slotDuration || "";
                let comingSlotTimings = timingDetails?.clinicTimings || [];
                setSlotDurationObject({ ...slotDurationObject, value: JSON.stringify(comingSlotDuration) });
                comingSlotTimings = comingSlotTimings?.map((day: any) => {
                    let newTimings = [...day?.timings];
                    newTimings = newTimings?.map((eachTime: any) => {
                        return { startTime : changeTimeToAmPm(eachTime?.startTime), endTime: changeTimeToAmPm(eachTime?.endTime) };
                    })
                    return { ...day, timings: newTimings };
                })
                setTimings(comingSlotTimings);
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
       getTimingDetails();
    },[doctorDetails])

    const handleSlotChange = (value: string) => {
        setSlotDurationObject({ ...slotDurationObject, value: value });
    }

    const handlAddSlots = () => {
        setIsAddSlots(true);
    }

    const handleClickEachDay = (day: string) => {
        setIsAddSlots(true);
        setEachDayChange(day);
    }

    const handleSave = () => {
        if (isEditable) {
            setLoader(true)
            setIsEditable(false)
            updateClinicInfo()
        } else {
            const newObject = { ...slotDurationObject };
            newObject.isDisabled = false;
            setSlotDurationObject(newObject)
            setIsEditable(true);
        }
    }

    const updateClinicInfo = async () => {
        let finalTimings = timings;
        finalTimings = finalTimings?.filter((day: any) => day?.timings && day?.timings?.length > 0);
        finalTimings = finalTimings?.map((day: any) => {
            let timings = [...day?.timings];
            timings = timings?.map((eachTime: any) => {
                return { startTime: changeTimeTwentyFourHours(eachTime?.startTime), endTime: changeTimeTwentyFourHours(eachTime?.endTime) }
            })
            return { ...day, timings : timings };
        });
        const updateData = {
            timingPayload: {
                slotDuration: slotDurationObject?.value,
                eachDayInfo: finalTimings,
            }
        }
        const response: any = await updateClinic(clinicId, updateData);
        if (response.status === "SUCCESS") {
            Toast.show({
                type: 'success',  
                text1: response.message,
                visibilityTime: 3000,
            });
            setLoader(false);
            router.replace("/dashboard/profile");
        } else {
            Toast.show({
                type: 'error',  
                text1: response.error,
                visibilityTime: 3000,
            });
            setLoader(false);
        }
    }

    const handleSetTiming = (data: any) => {
        setIsAddSlots(false);
        setEachDayChange(null);
        setTimings(data);
    }

    return (loader ?
            <Loader />
        :
            <ThemedView style={styles.container} >
                <MainHeader selectedNav={ isAddSlots ? 'manageSlotTiming' : 'manageSlotAndTiming'} />
                <View>
                    {!isAddSlots && 
                        <View style={{ position: 'relative', height }}>
                            <View style={{ marginTop: 32 }} >
                                <View>
                                    <ThemedText style={{ fontSize: 14, lineHeight: 18, marginBottom: 8, fontWeight: 600, color: "#3B82F6" }} >{finalText("Slot duration is time for seeing one patient", translations, selectedLanguage)}. </ThemedText>
                                    {isEditable ?
                                        <CustomInput2 data={slotDurationObject} onChange={(value) => handleSlotChange(value)} />
                                    :   slotDurationObject?.value === "" ?
                                            <ThemedText style={{ fontSize: 16, lineHeight: 20, fontWeight: 600 }} >{finalText("Please add slot duration", translations, selectedLanguage)} </ThemedText>
                                        :
                                            <CustomInput2 data={slotDurationObject} onChange={(value) => handleSlotChange(value)} />
                                    }
                                </View>
                                <View style={{ marginTop: 24 }} >
                                    <ThemedText style={{ fontSize: 16, lineHeight: 20, fontWeight: 600 }} >{finalText("Clinic Timings for each day", translations, selectedLanguage)} </ThemedText>
                                </View>
                                <View 
                                    style= {{ 
                                        display: 'flex',
                                        borderRadius: 8,
                                        borderColor: "#DDDDDD",
                                        marginTop: 12,
                                        borderWidth: 1,
                                        paddingHorizontal: 12,
                                        height: height - 360,
                                        position: 'relative',
                                        backgroundColor: '#f2f2f2',
                                        shadowColor: '#000000',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 12,
                                        elevation: 4,
                                        marginHorizontal: 4,
                                        marginBottom: 4
                                    }}
                                >
                                    {timings?.length > 0 ?
                                        <ScrollView
                                            ref={scrollViewRef}
                                            style={{ 
                                                display: 'flex',
                                                paddingVertical: 16,
                                                maxHeight: 340,
                                            }}
                                        >
                                            <View style={{ paddingBottom: 16 }} >
                                                {timings?.map((timing: any, index: number) => {
                                                    if (timing?.timings?.length > 0) {
                                                        return (
                                                            <View key={timing?.day} style={{ borderWidth: 1, borderColor: "#DDDDDD", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, display: 'flex', flexDirection:  'row', alignItems: 'center', justifyContent: 'space-between', marginTop: index === 0 ? 0 : 12 }} >
                                                                <View>
                                                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                                        <Ionicons size={20} color={"#2DB9B0"} name='calendar' />
                                                                        <ThemedText style={{ fontSize: 16, lineHeight: 20, fontWeight: 600, marginLeft: 8 }} >
                                                                            {finalText(timing?.day, translations, selectedLanguage)}
                                                                        </ThemedText>
                                                                    </View>
                                                                    <View style={{ marginTop: 10, marginLeft: 20 }} >
                                                                        {timing?.timings?.map((eachTime: any, i: number) => {
                                                                            return (
                                                                                <View key={eachTime?.startTime + "-" + eachTime?.end + timing?.day + "_" + i + "_" + index}  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 8 }} >
                                                                                    <Ionicons size={16} color={"#1EA6D6"} name='timer' />
                                                                                    <ThemedText style={{ fontSize: 12, lineHeight: 14, fontWeight: 400, marginLeft: 8 }} >
                                                                                        {eachTime?.startTime} - {eachTime?.endTime}
                                                                                    </ThemedText>
                                                                                </View>
                                                                            )
                                                                        })}
                                                                    </View>
                                                                </View>
                                                                {isEditable && <Pressable onPress={() => isEditable && handleClickEachDay(timing?.day)} >
                                                                    <Icon type='arrowRight' />
                                                                </Pressable>}
                                                            </View>
                                                        )
                                                    } else {
                                                        return <></>
                                                    }
                                                })}
                                            </View>
                                        </ScrollView>
                                    :
                                        <View style={{ 
                                            marginTop: 12, 
                                            height: 260,
                                            marginHorizontal: 4,
                                            marginBottom: 12,
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            backgroundColor: Colors[colorScheme].background,
                                            shadowColor: '#000000',
                                            shadowOffset: { width: 0, height: 4 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 12,
                                            elevation: 4,
                                            borderRadius: 12,
                                        }} >
                                            <Image source={require('../../assets/images/noTasks.png')} style={{ height: 175, width: 200 }} resizeMode='contain' />
                                            <ThemedText style={{ marginTop: 4, fontSize: 14, lineHeight: 21, fontWeight: 600, color: "red" }} >{finalText("No timing exist, Please click on 'Edit Timings' then click 'Add Timing'", translations, selectedLanguage)}</ThemedText>
                                        </View>
                                    }
                                    <View style={{ display: "flex", alignItems: "center", marginTop: 24, position: 'absolute', bottom: 12, right: 12, left: 12 }} >
                                        <CustomButton multiLingual={true} width='FULL' title="Add Timings" onPress={handlAddSlots} isDisabled={!isEditable} />
                                    </View>
                                </View>
                            </View>
                        </View>
                    }
                    {isAddSlots && <ManageSlotTiming eachDayChange={eachDayChange} timings={ timings } setTimings={(data: any) => handleSetTiming(data)} />}
                </View>
                {!isAddSlots && !isKeyboardOpen && <View style={{ display: "flex", alignItems: "center", position: 'absolute', bottom: 16, right: 16, left: 16 }} >
                    <CustomButton width='FULL' title={isEditable ? "Save" : "Edit Timings"} onPress={handleSave} />
                </View>}
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

export default ManageSlotDurationAndTiming;