import CustomButton from '@/components/CustomButton';
import CustomInput2 from '@/components/CustomInput2';
import Loader from '@/components/Loader';
import MainHeader from '@/components/MainHeader';
import ManageSlotTiming from '@/components/ManageSlotTiming';
import Navbar, { NavbarObject } from '@/components/Navbar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { changeTimeToAmPm, changeTimeTwentyFourHours, finalText, getClinics, updateClinic } from '@/components/Utils';
import { StringObject } from '@/constants/Enums';
import { useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
    const [slotDurationObjectEmergency, setSlotDurationObjectEmergency] = useState<StringObject>({
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
    const [loader, setLoader] = useState<boolean>(false);
    const [timings, setTimings] = useState<any>([]);
    const [timingsEmergency, setTimingsEmergency] = useState<any>([]);
    const [clinicId, setClinicId] = useState<string>("");
    const [isAddSlots, setIsAddSlots] = useState<boolean>(false);
    const [eachDayChange, setEachDayChange] = useState<any>(null);
    const [navData, setNavData] = useState<Array<NavbarObject>>([
        {
            label: "Normal Slot",
            isActive: true,
        },
        {
            label: "Emergency Slot",
            isActive: false,
        }
    ]);

    useEffect(() => {
        const backAction = () => {
            router.replace("/dashboard/profile");
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        const getTimingDetails = async () => {
            setLoader(true);
            const respnose = await getClinics(doctorDetails?.phone);
            if (respnose.status === "SUCCESS") {
                const timingDetails = respnose.data;
                setClinicId(timingDetails?._id);
                const comingSlotDuration = timingDetails?.slotDurationNormal || "";
                let comingSlotTimings = timingDetails?.clinicTimingsNormal || [];
                const comingSlotDurationEmergency = timingDetails?.slotDurationEmergency || "";
                let comingSlotTimingsEmergency = timingDetails?.clinicTimingsEmergency || [];
                setSlotDurationObject({ ...slotDurationObject, value: JSON.stringify(comingSlotDuration) });
                setSlotDurationObjectEmergency({ ...slotDurationObjectEmergency, value: JSON.stringify(comingSlotDurationEmergency) });
                comingSlotTimings = comingSlotTimings?.map((day: any) => {
                    let newTimings = [...day?.timings];
                    newTimings = newTimings?.map((eachTime: any) => {
                        return { startTime : changeTimeToAmPm(eachTime?.startTime), endTime: changeTimeToAmPm(eachTime?.endTime) };
                    })
                    return { ...day, timings: newTimings };
                })
                setTimings(comingSlotTimings);
                comingSlotTimingsEmergency = comingSlotTimingsEmergency?.map((day: any) => {
                    let newTimings = [...day?.timings];
                    newTimings = newTimings?.map((eachTime: any) => {
                        return { startTime : changeTimeToAmPm(eachTime?.startTime), endTime: changeTimeToAmPm(eachTime?.endTime) };
                    })
                    return { ...day, timings: newTimings };
                })
                setTimingsEmergency(comingSlotTimingsEmergency);
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
        if (navData[0]?.isActive) {
            setSlotDurationObject({ ...slotDurationObject, value: value });
        } else {
            setSlotDurationObjectEmergency({ ...slotDurationObjectEmergency, value: value });
        }
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
            const newObjectEmergency = { ...slotDurationObjectEmergency };
            newObjectEmergency.isDisabled = false;
            setSlotDurationObjectEmergency(newObjectEmergency)
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

        let finalTimingsEmergency = timingsEmergency;
        finalTimingsEmergency = finalTimingsEmergency?.filter((day: any) => day?.timings && day?.timings?.length > 0);
        finalTimingsEmergency = finalTimingsEmergency?.map((day: any) => {
            let timings = [...day?.timings];
            timings = timings?.map((eachTime: any) => {
                return { startTime: changeTimeTwentyFourHours(eachTime?.startTime), endTime: changeTimeTwentyFourHours(eachTime?.endTime) }
            })
            return { ...day, timings : timings };
        });
        const updateData = {
            timingPayload: {
                slotDurationNormal: slotDurationObject?.value,
                eachDayInfoNormal: finalTimings,
                slotDurationEmergency: slotDurationObjectEmergency?.value,
                eachDayInfoEmergency: finalTimingsEmergency
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

    const handleNavClick = (value: string) => {
        setIsAddSlots(false);
        setEachDayChange(null);
        const newNavData = navData?.map((item: NavbarObject) => ({ ...item, isActive: item?.label === value ? true : false }));
        setNavData(newNavData);
    }

    const handleSetTiming = (data: any) => {
        setIsAddSlots(false);
        setEachDayChange(null);
        if (navData[0]?.isActive) {
            setTimings(data);
        } else {
            setTimingsEmergency(data);
        }
    }

    return (loader ?
            <Loader />
        :
            <ThemedView style={styles.container} >
                <MainHeader selectedNav={ isAddSlots ? 'manageSlotTiming' : 'manageSlotAndTiming'} />
                <Navbar data={navData} onClick={handleNavClick} />
                <View>
                    {!isAddSlots && 
                        <View style={{ position: 'relative', height }}>
                            <View style={{ marginTop: 32 }} >
                                <View>
                                    {isEditable ?
                                        <CustomInput2 data={navData[0]?.isActive ? slotDurationObject : slotDurationObjectEmergency} onChange={(value) => handleSlotChange(value)} />
                                    :   slotDurationObject?.value === "" ?
                                            <ThemedText style={{ fontSize: 16, lineHeight: 20, fontWeight: 600 }} >{finalText("Please add slot duration", translations, selectedLanguage)} </ThemedText>
                                        :
                                            <CustomInput2 data={navData[0]?.isActive ? slotDurationObject : slotDurationObjectEmergency} onChange={(value) => handleSlotChange(value)} />
                                    }
                                </View>
                                <View style={{ marginTop: 24 }} >
                                    <ThemedText style={{ fontSize: 16, lineHeight: 20, fontWeight: 600 }} >{finalText("Slot Timings", translations, selectedLanguage)} </ThemedText>
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
                                        position: 'relative'
                                    }}
                                >
                                    {navData[0]?.isActive ?
                                        timings?.length > 0 ?
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
                                                                                {timing?.day}
                                                                            </ThemedText>
                                                                        </View>
                                                                        <View style={{ marginTop: 10, marginLeft: 20 }} >
                                                                            {timing?.timings?.map((eachTime: any, i: number) => {
                                                                                return (
                                                                                    <View key={eachTime?.startTime + "-" + eachTime?.end + "_" + i + "_" + index}  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 8 }} >
                                                                                        <Ionicons size={16} color={"#1EA6D6"} name='timer' />
                                                                                        <ThemedText style={{ fontSize: 12, lineHeight: 14, fontWeight: 400, marginLeft: 8 }} >
                                                                                            {eachTime?.startTime} - {eachTime?.endTime}
                                                                                        </ThemedText>
                                                                                    </View>
                                                                                )
                                                                            })}
                                                                        </View>
                                                                    </View>
                                                                    <Pressable onPress={() => handleClickEachDay(timing?.day)} >
                                                                        <Ionicons size={24} color={"#32383D"} name='chevron-forward' />
                                                                    </Pressable>
                                                                </View>
                                                            )
                                                        } else {
                                                            return <></>
                                                        }
                                                    })}
                                                </View>
                                            </ScrollView>
                                        :
                                            <View style={{ height: height - 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                                                <Image source={require('../../assets/images/noTasks.png')} style={{ height: 175, width: 200 }} resizeMode='contain' />
                                                <ThemedText style={{ marginTop: 4, fontSize: 14, lineHeight: 21, fontWeight: 600, color: "red" }} >{finalText("No slot exist, Please click on Update and Add Slots", translations, selectedLanguage)}</ThemedText>
                                            </View>
                                    :
                                        timingsEmergency?.length > 0 ?
                                            <ScrollView
                                                ref={scrollViewRef}
                                                style={{ 
                                                    display: 'flex',
                                                    paddingVertical: 16,
                                                    maxHeight: 340,
                                                }}
                                            >
                                                <View style={{ paddingBottom: 16 }} >
                                                    {timingsEmergency?.map((timing: any, index: number) => {
                                                        if (timing?.timings?.length > 0) {
                                                            return (
                                                                <View key={timing?.day} style={{ borderWidth: 1, borderColor: "#DDDDDD", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, display: 'flex', flexDirection:  'row', alignItems: 'center', justifyContent: 'space-between', marginTop: index === 0 ? 0 : 12 }} >
                                                                    <View>
                                                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                                            <Ionicons size={20} color={"#2DB9B0"} name='calendar' />
                                                                            <ThemedText style={{ fontSize: 16, lineHeight: 20, fontWeight: 600, marginLeft: 8 }} >
                                                                                {timing?.day}
                                                                            </ThemedText>
                                                                        </View>
                                                                        <View style={{ marginTop: 10, marginLeft: 20 }} >
                                                                            {timing?.timings?.map((eachTime: any, i: number) => {
                                                                                return (
                                                                                    <View key={eachTime?.startTime + "-" + eachTime?.end + "_" + i + "_" + index}  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 8 }} >
                                                                                        <Ionicons size={16} color={"#1EA6D6"} name='timer' />
                                                                                        <ThemedText style={{ fontSize: 12, lineHeight: 14, fontWeight: 400, marginLeft: 8 }} >
                                                                                            {eachTime?.startTime} - {eachTime?.endTime}
                                                                                        </ThemedText>
                                                                                    </View>
                                                                                )
                                                                            })}
                                                                        </View>
                                                                    </View>
                                                                    <Pressable onPress={() => handleClickEachDay(timing?.day)} >
                                                                        <Ionicons size={24} color={"#32383D"} name='chevron-forward' />
                                                                    </Pressable>
                                                                </View>
                                                            )
                                                        } else {
                                                            return <></>
                                                        }
                                                    })}
                                                </View>
                                            </ScrollView>
                                        :
                                            <View style={{ height: height - 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                                                <Image source={require('../../assets/images/noTasks.png')} style={{ height: 175, width: 200 }} resizeMode='contain' />
                                                <ThemedText style={{ marginTop: 4, fontSize: 14, lineHeight: 21, fontWeight: 600, color: "red" }} >{finalText("No slot exist, Please click on Update and Add Slots", translations, selectedLanguage)}</ThemedText>
                                            </View>
                                    }
                                    <View style={{ display: "flex", alignItems: "center", marginTop: 24, position: 'absolute', bottom: 12, right: 12, left: 12 }} >
                                        <CustomButton multiLingual={true} width='FULL' title="Add Slots" onPress={handlAddSlots} isDisabled={!isEditable} />
                                    </View>
                                </View>
                            </View>
                        </View>
                    }
                    {isAddSlots && <ManageSlotTiming eachDayChange={eachDayChange} timings={navData[0]?.isActive ? timings : timingsEmergency} setTimings={(data: any) => handleSetTiming(data)} />}
                </View>
                {!isAddSlots && <View style={{ display: "flex", alignItems: "center", position: 'absolute', bottom: 16, right: 16, left: 16 }} >
                    <CustomButton width='FULL' title={isEditable ? "Save" : "Update"} onPress={handleSave} />
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