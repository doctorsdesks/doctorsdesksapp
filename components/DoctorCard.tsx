import React, { useState } from "react";
import {
    Image,
    Pressable,
    View,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import Icon from "./Icons";
import { getHospitalClinicForDoctor } from "./Utils";
import Toast from "react-native-toast-message";
import Loader from "./Loader";
import { ThemedView } from "./ThemedView";
import { router } from "expo-router";
import { RequestStatus } from "@/constants/Enums";

interface DoctorCardProps {
    doctorMapping: any;
    hospitalId: string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
    doctorMapping,
    hospitalId
}) => {
    const [showMore, setShowMore] = useState(false);
    const [loader, setLoader] = useState(false);
    const [clinicData, setClinicData] = useState<any>({});
    const colorScheme = useColorScheme() ?? "light";
    const doctor = doctorMapping?.doctorId;

    const handleShowMore = async () => {
        if (showMore) {
            setShowMore(false);
        } else {
            setLoader(true);
            const respnose = await getHospitalClinicForDoctor(doctor?._id, hospitalId);
            if (respnose.status === "SUCCESS") {
                const clinicDetails = respnose.data;
                setClinicData(clinicDetails);
                setShowMore(true);
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
    }

    return (
        <View
            style={{
                backgroundColor: Colors[colorScheme].cardBg,
                marginHorizontal: 4,
                marginBottom: 20,
                borderRadius: 12,
                padding: 12,
                shadowColor: doctorMapping?.requestStatus === RequestStatus.REJECTED ? "#fb0000" : doctorMapping?.requestStatus === RequestStatus.PENDING ? "#fcf000" : "#EAF4F3",
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 6,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Icon type='user' />
                <View
                    style={{
                        flex: 1,
                        marginLeft: 12,
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: 16,
                            fontWeight: "700",
                            lineHeight: 20,
                        }}
                    >
                        Dr. {doctor?.name}
                    </ThemedText>
                    <ThemedText
                        style={{
                            fontSize: 12,
                            marginTop: 3,
                        }}
                        lightColor="#555"
                        darkColor="#555"
                    >
                        {doctor?.specialisation} • {doctor?.graduation}
                    </ThemedText>
                    <ThemedText
                        style={{
                            fontSize: 12,
                            marginTop: 3,
                        }}
                        lightColor="#555"
                        darkColor="#555"
                    >
                        {doctor?.phone}
                    </ThemedText>
                </View>
                {doctorMapping.requestStatus === RequestStatus.ACCEPTED ?
                    <View
                        style={{
                            backgroundColor: doctorMapping?.isActive
                                ? "#E7F8F5"
                                : "#FFECEC",
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 12,
                        }}
                    >
                        <ThemedText
                            style={{
                                fontSize: 11,
                                fontWeight: "600",
                                color: doctorMapping?.isActive
                                    ? "#2DB9B0"
                                    : "#E74C3C",
                            }}
                        >
                            {
                                doctorMapping?.isActive
                                    ? "Active"
                                    : "Inactive"
                            }
                        </ThemedText>
                    </View>
                :
                    <View
                        style={{
                            backgroundColor:
                                doctorMapping.requestStatus === RequestStatus.PENDING
                                    ? "#F5B400"
                                    : "#E74C3C",
                            borderWidth: 1,
                            borderColor:
                                doctorMapping.requestStatus === RequestStatus.PENDING
                                    ? "#F5B400"
                                    : "#E74C3C",
                            paddingHorizontal: 10,
                            paddingVertical: 3,
                            marginLeft: 8,
                            borderRadius: 20,
                        }}
                    >
                        <ThemedText
                            style={{
                                color: "#fff",
                                fontSize: 12,
                                fontWeight: "700",
                            }}
                        >
                            {doctorMapping.requestStatus}
                        </ThemedText>
                    </View>
                }
            </View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 14,
                }}
            >
                <View>
                    <ThemedText
                        style={{
                            fontSize:12
                        }}
                        lightColor="#777"
                        darkColor="#777"
                    >
                        Doctor Code
                    </ThemedText>
                    <ThemedText
                        style={{
                            fontSize:13,
                            fontWeight:"600"
                        }}
                    >
                        {doctor?.doctorCode}
                    </ThemedText>
                </View>
                <View>
                    <ThemedText
                        style={{
                            fontSize:12
                        }}
                        lightColor="#777"
                        darkColor="#777"
                    >
                        Role
                    </ThemedText>
                    <View
                    >
                        <ThemedText
                            style={{
                                color: "#2DB9B0",
                                fontSize: 12,
                                fontWeight: "700",
                            }}
                        >
                            {doctorMapping.role.replace(/_/g, " ")}
                        </ThemedText>
                    </View>
                </View>
            </View>
            {doctorMapping.requestStatus === RequestStatus.ACCEPTED && (loader ? 
                <Loader /> 
            :
                <Pressable
                    onPress={() => handleShowMore()}
                    style={{
                        marginTop:14,
                        alignSelf:"center",
                        paddingHorizontal:20,
                        paddingVertical:7,
                        borderRadius:20,
                        borderWidth:1,
                        borderColor:"#2DB9B0",
                    }}
                >
                    <ThemedText
                        style={{
                            color:"#2DB9B0",
                            fontSize:13,
                            fontWeight:"600",
                        }}
                    >
                        {
                            showMore
                                ? "Hide Details"
                                : "Show More"
                        }
                    </ThemedText>
                </Pressable>
            )}
            {
                showMore && (
                    <View
                        style={{
                            marginTop: 16,
                            paddingTop: 16,
                            borderTopWidth: 1,
                            borderTopColor: "#D9E8E7",
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: Colors[colorScheme].cardBackgroud,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: Colors[colorScheme].cardBg,
                                padding: 14,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 14,
                                }}
                            >
                                <ThemedText
                                    style={{
                                        fontSize: 14,
                                        lineHeight: 18,
                                        fontWeight: "700",
                                    }}
                                >
                                    💰 Consultation Fee
                                </ThemedText>
                                <Pressable
                                    onPress={() => {
                                        router.replace({
                                            pathname: "/clinicDetail/consultationFee",
                                            params: {
                                                source: "hospitalClinic",
                                                clinicData: JSON.stringify(clinicData)
                                            }
                                        })
                                    }}
                                    style={{
                                        backgroundColor: "#2DB9B0",
                                        paddingHorizontal: 14,
                                        paddingVertical: 7,
                                        borderRadius: 8,
                                    }}
                                >
                                    <ThemedText
                                        style={{
                                            color: "#fff",
                                            fontWeight: "600",
                                            fontSize: 12,
                                            lineHeight: 16
                                        }}
                                    >
                                        Edit Fee
                                    </ThemedText>
                                </Pressable>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    paddingVertical: 8,
                                }}
                            >
                                <ThemedText
                                    lightColor="#666"
                                    darkColor="#999"
                                    style={{ fontSize: 14, lineHeight: 18 }}
                                >
                                    Appointment Fee
                                </ThemedText>

                                <ThemedText
                                    style={{
                                        fontWeight: "700",
                                        color: "#2DB9B0",
                                        fontSize: 14,
                                        lineHeight: 18
                                    }}
                                >
                                    ₹ {clinicData?.appointmentFee ?? "-"}
                                </ThemedText>
                            </View>
                            <View
                                style={{
                                    height: 1,
                                    backgroundColor: "#E5EEEE",
                                }}
                            />
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    paddingVertical: 8,
                                }}
                            >
                                <ThemedText
                                    lightColor="#666"
                                    darkColor="#999"
                                    style={{ fontSize: 14, lineHeight: 18 }}
                                >
                                    Emergency Fee
                                </ThemedText>
                                <ThemedText
                                    style={{
                                        fontWeight: "700",
                                        color: "#E67E22",
                                        fontSize: 14,
                                        lineHeight: 18
                                    }}
                                >
                                    ₹ {clinicData?.emergencyFee ?? "-"}
                                </ThemedText>
                            </View>

                        </View>
                        <View
                            style={{
                                marginTop: 18,
                                backgroundColor: Colors[colorScheme].cardBackgroud,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: Colors[colorScheme].cardBg,
                                padding: 14,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 14,
                                }}
                            >
                                <ThemedText
                                    style={{
                                        fontSize: 14,
                                        lineHeight: 18,
                                        fontWeight: "700",
                                    }}
                                >
                                    🕒 Clinic Timings
                                </ThemedText>
                                <Pressable
                                    onPress={() => {
                                        router.replace({
                                            pathname: "/clinicDetail/manageSlotAndTiming",
                                            params: {
                                                source: "hospitalClinic",
                                                clinicData: JSON.stringify(clinicData)
                                            }
                                        })
                                    }}
                                    style={{
                                        backgroundColor: "#2DB9B0",
                                        paddingHorizontal: 14,
                                        paddingVertical: 7,
                                        borderRadius: 8,
                                    }}
                                >
                                    <ThemedText
                                        style={{
                                            color: "#fff",
                                            fontWeight: "600",
                                            fontSize: 12,
                                            lineHeight: 16
                                        }}
                                    >
                                        Edit Timings
                                    </ThemedText>
                                </Pressable>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    marginBottom: 14,
                                }}
                            >
                                <ThemedText
                                    lightColor="#666"
                                    darkColor="#999"
                                    style={{ fontSize: 14, lineHeight: 18 }}
                                >
                                    Slot Duration
                                </ThemedText>
                                <ThemedText
                                    style={{
                                        color: "#2DB9B0",
                                        fontWeight: "700",
                                        fontSize: 14,
                                        lineHeight: 18
                                    }}
                                >
                                    {clinicData?.slotDuration ?? "-"} mins
                                </ThemedText>
                            </View>
                            {clinicData?.clinicTimings?.map((clinic: any) => (
                                <View
                                    key={clinic.day}
                                    style={{
                                        backgroundColor: Colors[colorScheme].cardBg,
                                        borderRadius: 10,
                                        padding: 12,
                                        marginBottom: 10,
                                        borderWidth: 1,
                                        borderColor: Colors[colorScheme].cardBackgroud,
                                    }}
                                >
                                    <ThemedText
                                        style={{
                                            fontWeight: "700",
                                            marginBottom: 8,
                                            fontSize: 14,
                                            lineHeight: 18
                                        }}
                                    >
                                        {clinic.day}
                                    </ThemedText>
                                    {clinic.timings?.map((timing: any, index: number) => (
                                        <View
                                            key={index}
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                marginBottom: 6,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: 6,
                                                    width: 6,
                                                    borderRadius: 3,
                                                    backgroundColor: "#2DB9B0",
                                                    marginRight: 8,
                                                }}
                                            />
                                            <ThemedText
                                                lightColor="#555"
                                                darkColor="#AAA"
                                                style={{ fontSize: 12, lineHeight: 16 }}
                                            >
                                                {timing.startTime} - {timing.endTime}
                                            </ThemedText>
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </View>
                    </View>
                )
            }
        </View>
    );
};

export default DoctorCard;