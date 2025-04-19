import CustomButton from '@/components/CustomButton';
import { DaysForSlot } from '@/constants/Enums';
import LowerPanel from '@/components/LowerPanel';
import TimeSelection from '@/components/TimeSelection';
import CustomSwitch from '@/components/CustomSwitch';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { finalText } from './Utils';
import { useAppContext } from '@/context/AppContext';
import Icon from './Icons';
import Toast from 'react-native-toast-message';

export interface ManageSlotTimingProps {
    timings: any[];
    setTimings: (data: any) => void;
    eachDayChange: any;
}

const ManageSlotTiming: React.FC<ManageSlotTimingProps> = ({ timings, setTimings, eachDayChange }) => {
    const { translations, selectedLanguage } = useAppContext();
    const { height } = Dimensions.get('window');
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
    const [sessions, setSessions] = useState<any>([]);
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [lowerPanel, setLowerPanel] = useState<boolean>(false);
    const [lowerPanelChild, setLowerPanelChild] = useState<any>();

    useEffect(() => {
        const backAction = () => {
            router.replace("/clinicDetail/manageSlotAndTiming");
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        if (eachDayChange && eachDayChange !== null) {
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
            let selectedDaytimings = timings?.find((item: any) => item?.day === selectedDay)?.timings;
            setSessions(selectedDaytimings);
        } else {
            setSessions([]);
        }
        if (newDays?.some((day: DaysForSlot) => !day?.isSelected)) {
            setAllDaysSelected(false);
        } else {
            setAllDaysSelected(true);
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
                setLowerPanelChild(<TimeSelection title="Start Time" time={startTime} closeLoserPanel={() => setLowerPanel(false)} handleTimeSelection={(hour: string, minute: string, period: string) => handleTimeSelection(hour, minute, period, "start")} />)
            } else {
                setLowerPanelChild(<TimeSelection title="End Time" time={endTime} closeLoserPanel={() => setLowerPanel(false)} handleTimeSelection={(hour: string, minute: string, period: string) => handleTimeSelection(hour, minute, period, "end")} />)
            }
            setLowerPanel(true);
        }
    }

    const convertTo24Hour = (time: string) => {
        const [timeStr, period] = time.split(" ");
        let [hours, minutes] = timeStr.split(":");
        let hour = parseInt(hours);
        
        if (period === "PM" && hour !== 12) {
            hour += 12;
        } else if (period === "AM" && hour === 12) {
            hour = 0;
        }
        
        return `${hour.toString().padStart(2, '0')}:${minutes}`;
    };

    const isOverlapping = (newStart: string, newEnd: string, existingSessions: any[]) => {
        const newStartTime = convertTo24Hour(newStart);
        const newEndTime = convertTo24Hour(newEnd);
        
        return existingSessions.some(session => {
            const sessionStartTime = convertTo24Hour(session.startTime);
            const sessionEndTime = convertTo24Hour(session.endTime);
            
            return (newStartTime < sessionEndTime && newEndTime > sessionStartTime);
        });
    };

    const handleAddSession = () => {
        if (startTime !== "" && endTime !== "") {
            const currentSessions = sessions ? [...sessions] : [];
            
            // Check if end time is greater than start time
            const startTime24 = convertTo24Hour(startTime);
            const endTime24 = convertTo24Hour(endTime);
            
            if (endTime24 <= startTime24) {
                Toast.show({
                    type: 'error',
                    text1: finalText("End time must be greater than start time", translations, selectedLanguage),
                    visibilityTime: 3000,
                    props: { 
                        style: { width: '80%' },
                        numberOfLines: 2
                    }
                });
                return;
            }
            
            if (isOverlapping(startTime, endTime, currentSessions)) {
                Toast.show({
                    type: 'error',
                    text1: finalText("Session overlaps with existing time slot", translations, selectedLanguage),
                    visibilityTime: 3000,
                    props: { 
                        style: { width: '80%' },
                        numberOfLines: 2
                    }
                });
                return;
            }

            const newSession = {
                startTime: startTime,
                endTime: endTime
            }
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
                const otherDaysTimings = timings?.find((item: any) => item?.day === day?.day)?.timings;
                finalDays.push({ day: day?.day, timings: otherDaysTimings });
            }
        })
        setTimings(finalDays);
    }

    return (
        <ThemedView style={styles.container} >
            <View style={{ marginTop: 24, marginHorizontal: 16, height, position: 'relative' }} >
                <View style={{ borderWidth: 1, borderColor: "#DDDDDDDD", borderRadius: 8, backgroundColor: "#F9F9F9", padding: 16 }} >
                    <View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                            <ThemedText style={{ fontSize: 16, fontWeight: 600 }} >{finalText("Select Week Days", translations, selectedLanguage)} </ThemedText>
                            {!eachDayChange && <CustomSwitch isActive={allDaysSelected} onClick={handleAllDays} />}
                        </View>
                        <View style={{ display: 'flex', flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }} >
                            {eachDayChange && eachDayChange !== null ?
                                <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderColor: "#2DB9B0", borderWidth: 1, borderRadius: 32, backgroundColor: "#2DB9B0" }} >
                                    <ThemedText style={{ textAlign: 'center', fontSize: 14, lineHeight: 19, fontWeight: 700, color: "#ffffff" }} >{finalText(eachDayChange, translations, selectedLanguage)}</ThemedText>
                                </View>
                            :
                                days?.map((day: DaysForSlot) => {
                                    return (
                                        <Pressable
                                            key={day?.label}
                                            id={day?.label} 
                                            style={{ height: 32, width: 32, display: 'flex', alignItems: "center", justifyContent: 'center', borderColor: "#2DB9B0", borderWidth: 1, borderRadius: 32, backgroundColor: day?.isSelected ? "#2DB9B0" : "#F9F9F9" }}
                                            onPress={() => handleDaySelect(day?.day)}
                                        >
                                            <ThemedText style={{ textAlign: 'center', fontSize: 14, lineHeight: 19, fontWeight: day?.isSelected ? 700 : 600, color: day?.isSelected ? "#FFFFFF" : "#32383D" }} >{finalText(day?.label, translations, selectedLanguage)} </ThemedText>
                                        </Pressable>
                                    )
                                })
                            }
                        </View>
                    </View>
                    <View style={{ marginTop: 24 }} >
                        <ThemedText style={{ fontSize: 16, fontWeight: 600 }} >{finalText("Timings", translations, selectedLanguage)} </ThemedText>
                        {sessions?.length > 0 && 
                            <View style={{ marginTop: 16 }} >
                                {sessions?.map((session: {[key: string]: string}, index: number) => {
                                    return(
                                        <View key={session?.startTime} style={{ marginBottom: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}} >
                                            <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderRadius: 8, borderColor: "#D9D9D9", display: 'flex', flexDirection: 'row' }} >
                                                <View style={{ display:'flex', flexDirection: 'row' }} >
                                                    <ThemedText style={{ fontSize: 14, lineHeight: 20, fontWeight: 600, color: "#1EA6D6" }} >{finalText("Timing", translations, selectedLanguage)} </ThemedText>
                                                    <ThemedText style={{ marginLeft: 4, fontSize: 14, lineHeight: 20, fontWeight: 600, color: "#1EA6D6" }} >{index+1}</ThemedText>
                                                </View>
                                                <View  style={{ marginLeft: 16, marginRight: 12, height: 20, width: 2, backgroundColor: "#D9D9D9" }} />
                                                <ThemedText style={{ fontSize: 14, lineHeight: 20, fontWeight: 400, color: "#32383D" }} >{session?.startTime} - {session?.endTime} </ThemedText>
                                            </View>
                                            <Pressable onPress={() => handleDeleteSession(index)} >
                                                <Icon type='delete' />
                                            </Pressable>
                                        </View>
                                    )
                                })}
                            </View>
                        }
                        <View style={{ marginTop: 16, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ display: 'flex', flexDirection: 'column' }}>
                                <ThemedText style={{ fontSize: 11, lineHeight: 15, fontWeight: 600 }} >{finalText("Start Time", translations, selectedLanguage)} </ThemedText>
                                <Pressable 
                                    style={{ borderWidth: 1, borderRadius: 8, borderColor: "#D9D9D9", backgroundColor: "#FFFFFF", paddingHorizontal: 10, paddingVertical: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 8 }} 
                                    onPress={() => handleOpenTime("start")}
                                >
                                    {startTime === "" ? 
                                        <ThemedText style={{ fontSize: 14, lineHeight: 19, fontWeight: 400, color: "#757575" }} >{finalText("Select Time", translations, selectedLanguage)} </ThemedText>
                                    :
                                        <ThemedText style={{ fontSize: 14, lineHeight: 19, fontWeight: 400, color: "#757575" }} >
                                            {startTime}
                                        </ThemedText>
                                    }
                                    <View style={{ marginLeft: 4 }} >
                                        <Icon type='clock' />
                                    </View>
                                </Pressable>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'column' }}>
                                <ThemedText style={{ fontSize: 11, lineHeight: 15, fontWeight: 600 }} >{finalText("End Time", translations, selectedLanguage)} </ThemedText>
                                <Pressable 
                                    style={{ borderWidth: 1, borderRadius: 8, borderColor: "#D9D9D9", backgroundColor: "#FFFFFF", paddingHorizontal: 10, paddingVertical: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 8 }}
                                    onPress={() => handleOpenTime("end")}
                                >
                                    {endTime === "" ? 
                                        <ThemedText style={{ fontSize: 14, lineHeight: 19, fontWeight: 400, color: "#757575" }} >{finalText("Select Time", translations, selectedLanguage)} </ThemedText>
                                    :
                                        <ThemedText style={{ fontSize: 14, lineHeight: 19, fontWeight: 400, color: "#757575" }} >
                                            {endTime}
                                        </ThemedText>
                                    }
                                    <View style={{ marginLeft: 4 }} >
                                        <Icon type='clock' />
                                    </View>
                                </Pressable>
                            </View>
                            <View style={{  marginTop: 23, marginLeft: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                                <Pressable style={{ backgroundColor: startTime !== "" && endTime !== "" ? '#009688' : '#99E4DF', borderRadius: 8, paddingHorizontal: 5, paddingVertical: 3 }} onPress={handleAddSession} >
                                    <ThemedText style={{ fontSize: 14, lineHeight: 18, fontWeight: 700, color: "#fff"  }} >{finalText("Add", translations, selectedLanguage)} </ThemedText>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ display: "flex", alignItems: "center", position: 'absolute', bottom: 16, right: 16, left: 16 }} >
                <CustomButton  multiLingual={true} width='FULL' title="Save Timings" onPress={handleAddFinal}  />
            </View>
            {lowerPanel && <LowerPanel children={lowerPanelChild} closeLoserPanel={() => setLowerPanel(false)} />}
        </ThemedView>
    );
};


const styles = StyleSheet.create({
    container: {
        height: "90%",
        position: 'relative'
    },
});

export default ManageSlotTiming;
