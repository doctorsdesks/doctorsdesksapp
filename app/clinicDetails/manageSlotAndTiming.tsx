import CustomButton from '@/components/CustomButton';
import CustomInput2 from '@/components/CustomInput2';
import Icon from '@/components/Icon';
import Loader from '@/components/Loader';
import { changeTimeToAmPm, changeTimeTwentyFourHours, getClinics } from '@/components/Utils';
import { StringObject } from '@/constants/Enums';
import { URLS } from '@/constants/Urls';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, Pressable, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

const ManageSlotDurationAndTiming = () => {
    const { doctorDetails, clinicTimings, setClinicTimings, slotDuration, setSlotDuration } = useAppContext();
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
                setSlotDuration(comingSlotDuration);
                comingSlotTimings = comingSlotTimings?.map((day: any) => {
                    let newTimings = [...day?.timings];
                    newTimings = newTimings?.map((eachTime: any) => {
                        return { startTime : changeTimeToAmPm(eachTime?.startTime), endTime: changeTimeToAmPm(eachTime?.endTime) };
                    })
                    return { ...day, timings: newTimings };
                })
                setClinicTimings(JSON.stringify(comingSlotTimings));
                if (comingSlotDuration === "" && comingSlotTimings?.length === 0) {
                    setIsEditable(true);
                }
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
        if (clinicTimings && clinicTimings !== "") {
            setTimings(JSON.parse(clinicTimings));
        } else {
            getTimingDetails();
        }
    },[doctorDetails, clinicTimings])

    useEffect(() => {
        if (slotDuration) {
            setSlotDurationObject({ ...slotDurationObject, value: slotDuration });
        }
    }, [slotDuration])

    const handleSlotChange = (value: string) => {
        setSlotDuration(value);
    }

    const handlAddSlots = () => {
        router.replace("/clinicDetails/manageSlotTiming");
    }

    const handleClickEachDay = (day: string) => {
        router.replace({
            pathname: "/clinicDetails/manageSlotTiming",
            params: {
                eachDayChange: day
            }
        });
    }

    const handleSave = () => {
        if (isEditable) {
            setLoader(true)
            setIsEditable(false)
            updateClinic()
        } else {
            setSlotDurationObject({ ...slotDurationObject, isDisabled: false })
            setIsEditable(true);
        }
    }

    const updateClinic = async () => {
        let finalTimings = JSON.parse(clinicTimings);
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
                slotDuration: slotDuration,
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
                    visibilityTime: 5000,
                });
            }
            setLoader(false);
            router.replace("/dashboard/profile");
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
        <View style={{ marginHorizontal: 16, height, position: 'relative' }} >
            <View style={{ marginTop: 32 }} >
                <View>
                    {isEditable ?
                        <CustomInput2 data={slotDurationObject} onChange={(value) => handleSlotChange(value)} />
                    :   slotDurationObject?.value === "" ? 
                            <Text style={{ fontSize: 16, lineHeight: 20, fontWeight: 600, color: "#32383D" }} >
                                Please add slot duration
                            </Text>
                        :
                        <CustomInput2 data={slotDurationObject} onChange={(value) => handleSlotChange(value)} />
                    }
                </View>
                <View style={{ marginTop: 32 }} >
                    <Text style={{ fontSize: 16, lineHeight: 20, fontWeight: 600, color: "#32383D" }} >Slot Timings</Text>
                </View>
                <View style={{ marginTop: 8 }}  >
                    {timings?.length > 0 ?
                        <View>
                            {timings?.map((timing: any) => {
                                if (timing?.timings?.length > 0) {
                                    return (
                                        <View key={timing?.day} style={{ borderWidth: 1, borderColor: "#DDDDDD", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, display: 'flex', flexDirection:  'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }} >
                                            <View>
                                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                    <Icon iconType='calendarIcon' height='20' width='20' />
                                                    <Text style={{ fontSize: 16, lineHeight: 20, fontWeight: 600, color: "#32383D", marginLeft: 8 }} >
                                                        {timing?.day}
                                                    </Text>
                                                </View>
                                                <View style={{ marginTop: 10, marginLeft: 20 }} >
                                                    {timing?.timings?.map((eachTime: any) => {
                                                        return (
                                                            <View key={eachTime?.startTime + "-" + eachTime?.end}  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 8 }} >
                                                                <Icon iconType='clockIcon' height='16' width='16' />
                                                                <Text style={{ fontSize: 12, lineHeight: 14, fontWeight: 400, color: "#1EA6D6", marginLeft: 8 }} >
                                                                    {eachTime?.startTime} - {eachTime?.endTime}
                                                                </Text>
                                                            </View>
                                                        )
                                                    })}
                                                </View>
                                            </View>
                                            <Pressable onPress={() => handleClickEachDay(timing?.day)} >
                                                <Icon iconType='rightArrow' />
                                            </Pressable>
                                        </View>
                                    )
                                } else {
                                    return <></>
                                }
                            })}
                        </View>
                    :
                        <Text style={{ marginTop: 32, fontSize: 16, lineHeight: 21, fontWeight: 600, color: "#32383D" }} >
                            Please add slots
                        </Text>
                    }
                    <View style={{ display: "flex", alignItems: "center", marginTop: 24, marginBottom: 32 }} >
                        <CustomButton width='FULL' title="Add Slots" onPress={handlAddSlots} iconType='add' isDisabled={!isEditable} />
                    </View>
                </View>
            </View>
            <View style={{ display: "flex", alignItems: "center", marginTop: 24, position: 'absolute', bottom: 100, width: width - 32 }} >
                    <CustomButton width='FULL' title={isEditable ? "Save" : "Update"} onPress={handleSave} />
            </View>
            {loader && <Loader />}
        </View>
    );
};

export default ManageSlotDurationAndTiming;