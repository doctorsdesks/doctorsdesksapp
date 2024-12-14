import CustomButton from '@/components/CustomButton';
import CustomSwitch from '@/components/CustomSwitch';
import Icon from '@/components/Icon';
import LowerPanel from '@/components/LowerPanel';
import TimeSelection from '@/components/TimeSelection';
import { DaysForSlot } from '@/constants/Enums';
import { useAppContext } from '@/context/AppContext';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, Pressable, Text, View } from 'react-native';

const ManageSlotTiming = () => {
    const { height, width } = Dimensions.get('window');
    const { eachDayChange } = useLocalSearchParams();
    const { clinicTimings, setClinicTimings } = useAppContext();
    const [allDaysSelected, setAllDaysSelected] = useState<boolean>(false);
    const [days, setDays] = useState<Array<DaysForSlot>>([
        {
            day: "SUNDAY",
            label: "Sn",
            isSelected: false,
            timings: [{}]
        },
        {
            day: "MONDAY",
            label: "Mo",
            isSelected: false,
            timings: [{}]
        },
        {
            day: "TUESDAY",
            label: "Tu",
            isSelected: false,
            timings: [{}]
        },
        {
            day: "WEDNESDAY",
            label: "We",
            isSelected: false,
            timings: [{}]
        },
        {
            day: "THURSDAY",
            label: "Th",
            isSelected: false,
            timings: [{}]
        },
        {
            day: "FRIDAY",
            label: "Fr",
            isSelected: false,
            timings: [{}]
        },
        {
            day: "SATURDAY",
            label: "St",
            isSelected: false,
            timings: [{}]
        }
    ]);
    const [sessions, setSessions] = useState<Array<{[key: string]: string}>>([]);
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [lowerPanel, setLowerPanel] = useState<boolean>(false);
    const [lowerPanelChild, setLowerPanelChild] = useState<any>();

    useEffect(() => {
        const backAction = () => {
            router.replace("/clinicDetails/manageSlotAndTiming");
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        if (eachDayChange) {
            handleDaySelect(eachDayChange as string);
        }
    }, [eachDayChange])

    const handleAllDays = (value: boolean) => {
        setAllDaysSelected(!value);
        let newDays = [...days];
        newDays = newDays?.map((day: DaysForSlot) => {
            return { ...day, isSelected: !value }
        });
        setDays(newDays);
    }

    const handleDaySelect = (value: string) => {
        let newDays = [...days];
        newDays = newDays?.map((day: DaysForSlot) => {
            return { ...day, isSelected: day?.day === value ? !day?.isSelected : day?.isSelected }
        });
        setDays(newDays);
        const selectedDays = newDays?.filter((day: DaysForSlot) => day?.isSelected);
        if (selectedDays?.length === 1) {
            const selectedDay = selectedDays[0]?.day;
            let selectedDaytimings = JSON.parse(clinicTimings)?.find((item: any) => item?.day === selectedDay)?.timings;
            setSessions(selectedDaytimings);
        } else {
            setSessions([]);
        }
    }

    const checkDaySelected = () => {
        const selectedDays = days?.find((day: DaysForSlot) => day?.isSelected)
        if (selectedDays) {
            return true;
        } else {
            return false;
        }
    }

    const handleTimeSelection = (hour: string, minute: string, period: string, type: string) => {
        const finalTime = hour + ":" + minute + " " + period;
        if (type === "start") {
            setStartTime(finalTime);
        } else {
            setEndTime(finalTime);
        }
    }

    const handleOpenTime = (type: string) => {
        if (checkDaySelected()) {
            if(type === "start") {
                setLowerPanelChild(<TimeSelection title="Start Time" time="12:00" closeLoserPanel={() => setLowerPanel(false)} handleTimeSelection={(hour: string, minute: string, period: string) => handleTimeSelection(hour, minute, period, "start")} />)
            } else {
                setLowerPanelChild(<TimeSelection title="End Time" time="14:00" closeLoserPanel={() => setLowerPanel(false)} handleTimeSelection={(hour: string, minute: string, period: string) => handleTimeSelection(hour, minute, period, "end")} />)
            }
            setLowerPanel(true);
        }
    }

    const handleAddSession = () => {
        if (startTime !== "" && endTime !== "") {
            const newSession = {
                startTime: startTime,
                endTime: endTime
            }
            const currentSessions = [...sessions];
            currentSessions.push(newSession);
            setSessions(currentSessions);
            setStartTime("");
            setEndTime("");
        }
    }

    const handleDeleteSession = (index: number) => {
        const currentSessions = [...sessions];
        currentSessions?.splice(index, 1);
        setSessions(currentSessions);
    }

    const handleAddFinal = () => {
        let currentDays = [...days];
        const finalDays: any = [];
        currentDays?.forEach((day: DaysForSlot) => {
            if (day?.isSelected) {
                finalDays.push({ day: day?.day, timings: sessions })
            } else {
                const otherDaysTimings = JSON.parse(clinicTimings)?.find((item: any) => item?.day === day?.day)?.timings;
                finalDays.push({ day: day?.day, timings: otherDaysTimings });
            }
        })
        setClinicTimings(JSON.stringify(finalDays));
        router.replace({
            pathname: "/clinicDetails/manageSlotAndTiming",
            params: {
                isEditablePath: "true",
            }
        })
    }

    return (
        <View>
            <View style={{ marginTop: 24, marginHorizontal: 16, height, position: 'relative' }} >
                <View style={{ borderWidth: 1, borderColor: "#DDDDDDDD", borderRadius: 8, backgroundColor: "#F9F9F9", padding: 16 }} >
                    <View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                            <Text style={{ fontSize: 16, fontWeight: 600, color: "#32383D" }} >
                                Select Week Days
                            </Text>
                            <CustomSwitch isDisabled={eachDayChange ? true : false} isActive={allDaysSelected} onClick={handleAllDays} />
                        </View>
                        <View style={{ display: 'flex', flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }} >
                            {days?.map((day: DaysForSlot) => {
                                return (
                                    <Pressable
                                        id={day?.label} 
                                        style={{ height: 32, width: 32, display: 'flex', alignItems: "center", justifyContent: 'center', borderColor: "#2DB9B0", borderWidth: 1, borderRadius: 32, backgroundColor: day?.isSelected ? "#2DB9B0" : "#F9F9F9" }}
                                        onPress={() => !eachDayChange && handleDaySelect(day?.day)}
                                    >
                                        <Text style={{ fontSize: 14, lineHeight: 19, fontWeight: day?.isSelected ? 700 : 600, color: day?.isSelected ? "#FFFFFF" : "#32383D" }} >{day?.label}</Text>
                                    </Pressable>
                                )
                            })}
                        </View>
                    </View>
                    <View style={{ marginTop: 24 }} >
                        <Text style={{ fontSize: 16, fontWeight: 600, color: "#32383D" }} >
                            Sessions
                        </Text>
                        <View style={{ marginTop: 16 }} >
                            {sessions?.map((session: {[key: string]: string}, index: number) => {
                                return(
                                    <View key={session?.startTime} style={{ marginBottom: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}} >
                                        <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderRadius: 8, borderColor: "#D9D9D9", display: 'flex', flexDirection: 'row' }} >
                                            <Text style={{ fontSize: 14, lineHeight: 20, fontWeight: 600, color: "#1EA6D6" }} >Session {index+1}</Text>
                                            <View  style={{ marginLeft: 16, marginRight: 12, height: 20, width: 2, backgroundColor: "#D9D9D9" }} />
                                            <Text style={{ fontSize: 14, lineHeight: 20, fontWeight: 400, color: "#32383D" }} >{session?.startTime} - {session?.endTime} </Text>
                                        </View>
                                        <Pressable onPress={() => handleDeleteSession(index)} >
                                            <Icon iconType='deleteIcon' />
                                        </Pressable>
                                    </View>
                                )
                            })}
                        </View>
                        <View style={{ marginTop: 16, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ display: 'flex', flexDirection: 'column' }}>
                                <Text style={{ fontSize: 11, lineHeight: 15, fontWeight: 600, color: "#32383D" }} >
                                    Start Time
                                </Text>
                                <Pressable 
                                    style={{ borderWidth: 1, borderRadius: 8, borderColor: "#D9D9D9", backgroundColor: "#FFFFFF", paddingHorizontal: 14, paddingVertical: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 8 }} 
                                    onPress={() => handleOpenTime("start")}
                                >
                                    <Text style={{ fontSize: 14, lineHeight: 19, fontWeight: 400, color: "#757575" }} >
                                        {startTime === "" ? "Select Time" : startTime}
                                    </Text>
                                    <View style={{ marginLeft: 8 }} >
                                        <Icon iconType='unFilledClockIcon' height='18' width='18' />
                                    </View>
                                </Pressable>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'column' }}>
                                <Text style={{ fontSize: 11, lineHeight: 15, fontWeight: 600, color: "#32383D" }} >
                                    End Time
                                </Text>
                                <Pressable 
                                    style={{ borderWidth: 1, borderRadius: 8, borderColor: "#D9D9D9", backgroundColor: "#FFFFFF", paddingHorizontal: 14, paddingVertical: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 8 }}
                                    onPress={() => handleOpenTime("end")}
                                >
                                    <Text style={{ fontSize: 14, lineHeight: 19, fontWeight: 400, color: "#757575" }} >
                                        {endTime === "" ? "Select Time" : endTime}
                                    </Text>
                                    <View style={{ marginLeft: 8 }} >
                                        <Icon iconType='unFilledClockIcon' height='18' width='18' />
                                    </View>
                                </Pressable>
                            </View>
                            <Pressable style={{ marginTop: 34 }} onPress={handleAddSession} >
                                <Icon iconType='unFilledAddIcon' />
                            </Pressable>
                        </View>
                    </View>
                </View>
                <View style={{ display: "flex", alignItems: "center", marginTop: 24, position: 'absolute', bottom: 100, width: width - 32 }} >
                        <CustomButton width='FULL' title="Add" onPress={handleAddFinal} />
                </View>
            </View>
            {lowerPanel && <LowerPanel children={lowerPanelChild} closeLoserPanel={() => setLowerPanel(false)} />}
        </View>
    );
};

export default ManageSlotTiming;