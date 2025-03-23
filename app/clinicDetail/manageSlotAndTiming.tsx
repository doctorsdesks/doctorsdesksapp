import CustomButton from '@/components/CustomButton';
import CustomInput2 from '@/components/CustomInput2';
import CustomText from '@/components/CustomText';
import Loader from '@/components/Loader';
import MainHeader from '@/components/MainHeader';
import ManageSlotTiming from '@/components/ManageSlotTiming';
import { changeTimeToAmPm, changeTimeTwentyFourHours, getClinics } from '@/components/Utils';
import { StringObject } from '@/constants/Enums';
import { URLS } from '@/constants/Urls';
import { useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

const ManageSlotDurationAndTiming = () => {
    const scrollViewRef = React.useRef(null);
    const { doctorDetails } = useAppContext();
    const { isEditablePath } = useLocalSearchParams();
    const { height, width } = Dimensions.get('window');
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
    const [loader, setLoader] = useState<boolean>(false);
    const [timings, setTimings] = useState<any>([]);
    const [clinicId, setClinicId] = useState<string>("");
    const [isAddSlots, setIsAddSlots] = useState<boolean>(false);
    const [eachDayChange, setEachDayChange] = useState<any>(null);

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
                if (comingSlotDuration === "" && comingSlotTimings?.length === 0) {
                    setIsEditable(true);
                }
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
            updateClinic()
        } else {
            const newObject = { ...slotDurationObject };
            newObject.isDisabled = false;
            setSlotDurationObject(newObject)
            setIsEditable(true);
        }
    }

    const updateClinic = async () => {
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
                eachDayInfo: finalTimings
            }
        }
        const url = URLS.BASE + URLS.UPDATE_CLINIC + "/" + doctorDetails?.phone + "/" + clinicId;
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
            router.replace("/dashboard/profile");
        } catch (error: any) {
                Toast.show({
                    type: 'error',  
                    text1: error.response.data.message,
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

    return (
        <View style={{ marginHorizontal: 16, marginTop: 52 }} >
            <MainHeader selectedNav={ isAddSlots ? 'manageSlotTiming' : 'manageSlotAndTiming'} />
            {!isAddSlots && <View style={{ position: 'relative', height }}>
                <View style={{ marginTop: 32 }} >
                    <View>
                        {isEditable ?
                            <CustomInput2 data={slotDurationObject} onChange={(value) => handleSlotChange(value)} />
                        :   slotDurationObject?.value === "" ?
                                <CustomText multiLingual={true} textStyle={{ fontSize: 16, lineHeight: 20, fontWeight: 600, color: "#32383D" }} text="Please add slot duration" />
                            :
                                <CustomInput2 data={slotDurationObject} onChange={(value) => handleSlotChange(value)} />
                        }
                    </View>
                    <View style={{ marginTop: 32 }} >
                        <CustomText multiLingual={true} textStyle={{ fontSize: 16, lineHeight: 20, fontWeight: 600, color: "#32383D" }} text="Slot Timings" />
                    </View>
                    <ScrollView
                        ref={scrollViewRef}
                        style={{ 
                            display: 'flex',
                            backgroundColor: "#F9F9F9",
                            borderRadius: 8,
                            borderColor: "#DDDDDD",
                            marginTop: 12,
                            borderWidth: 1,
                            paddingHorizontal: 12,
                            paddingVertical: 16,
                            maxHeight: height - 300
                        }}
                    >
                        <View style={{ paddingBottom: 12 }} >
                            {timings?.length > 0 ?
                                <View>
                                    {timings?.map((timing: any) => {
                                        if (timing?.timings?.length > 0) {
                                            return (
                                                <View key={timing?.day} style={{ borderWidth: 1, borderColor: "#DDDDDD", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, display: 'flex', flexDirection:  'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }} >
                                                    <View>
                                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                            <Ionicons size={20} color={"#2DB9B0"} name='calendar' />
                                                            <Text style={{ fontSize: 16, lineHeight: 20, fontWeight: 600, color: "#32383D", marginLeft: 8 }} >
                                                                {timing?.day}
                                                            </Text>
                                                        </View>
                                                        <View style={{ marginTop: 10, marginLeft: 20 }} >
                                                            {timing?.timings?.map((eachTime: any, i: number) => {
                                                                return (
                                                                    <View key={eachTime?.startTime + "-" + eachTime?.end + "_" + i}  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 8 }} >
                                                                        <Ionicons size={16} color={"#1EA6D6"} name='timer' />
                                                                        <Text style={{ fontSize: 12, lineHeight: 14, fontWeight: 400, color: "#1EA6D6", marginLeft: 8 }} >
                                                                            {eachTime?.startTime} - {eachTime?.endTime}
                                                                        </Text>
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
                            :
                                <CustomText multiLingual={true} textStyle={{ marginTop: 4, fontSize: 14, lineHeight: 21, fontWeight: 600, color: "red" }} text="No slot exist, Please click on Update and Add Slots" />
                            }
                            <View style={{ display: "flex", alignItems: "center", marginTop: 24, marginBottom: 12 }} >
                                <CustomButton multiLingual={true} width='FULL' title="Add Slots" onPress={handlAddSlots} isDisabled={!isEditable} />
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View style={{ display: "flex", alignItems: "center", position: 'absolute', top: height - 116, width: width - 32 }} >
                        <CustomButton width='FULL' title={isEditable ? "Save" : "Update"} onPress={handleSave} />
                </View>
            </View>}
            {isAddSlots && <ManageSlotTiming eachDayChange={eachDayChange} timings={timings} setTimings={(data: any) => handleSetTiming(data)} />}
            {loader && <Loader />}
        </View>
    );
};

export default ManageSlotDurationAndTiming;