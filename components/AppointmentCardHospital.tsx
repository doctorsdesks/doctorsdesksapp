import { useState } from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import { AppointmentStatus } from '@/constants/Enums';
import { changeTimeToAmPm, finalText } from './Utils';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useAppContext } from '@/context/AppContext';
import Icon from './Icons';

interface AppointmentCardHospitalProps {
    lastAppointment: boolean;
    firstAppointment: boolean;
    docName: string;
    docNumber: string;
    patientName: string;
    patientNumber: string;
    startTime: string;
    status: string;
}

const AppointmentCardHospital: React.FC<AppointmentCardHospitalProps> = ({ lastAppointment, firstAppointment, docName, docNumber, patientName, patientNumber, startTime, status }) => {
    const { translations, selectedLanguage } = useAppContext();
    const [parentHeight, setParentHeight] = useState(0);
    const { width } = Dimensions.get("window");

    const handleLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        setParentHeight(height);
    };

    const calculatedTop = parentHeight ? (parentHeight / 2) - 10 : 0;

    return (
        <ThemedView 
            style={{ 
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                position: 'relative',
                alignItems: 'center'
            }}
            onLayout={handleLayout}
        >
            <View
                style={{
                    position: 'absolute',
                    left: 0,
                    top: calculatedTop,
                    height: 20,
                    width: 20,
                    display: "flex",
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 3,
                }}
            >
                <View
                    style={{
                        borderWidth: 1,
                        borderRadius: 20,
                        borderColor: "#2DB9B0",
                        backgroundColor: "#fff",
                        height: 20,
                        width: 20,
                    }}
                />
            </View>
            <View 
                style={{
                    position: 'absolute',
                    left: 9,
                    top: firstAppointment && parentHeight ? parentHeight/2 : 0,
                    height: (firstAppointment || lastAppointment) && parentHeight ? parentHeight/2 : parentHeight,
                    width: 2,
                    backgroundColor: "#2DB9B0",
                    zIndex: 2
                }}
            />
            <View
                style={{
                    marginLeft: 24,
                }}
            >
                <ThemedText style={{ fontSize: 12, lineHeight: 14, fontWeight: 600, width: 62 }}>{changeTimeToAmPm(startTime)}</ThemedText>
            </View>
            <View style={{ paddingVertical: 10 }}>
                <View
                    style={{
                        marginLeft: 8,
                        backgroundColor: "#EAF4F3",
                        paddingVertical: 10,
                        paddingHorizontal: 6,
                        borderLeftWidth: 8,
                        borderLeftColor: "#2DB9B0",
                        borderRadius: 8,
                        width: width - 128,
                    }}
                >
                    {/* Header Row */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            {/* Doctor Info */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <Icon type="docUser" fill="#2DB9B0" />

                                <ThemedText
                                    style={{
                                        fontSize: 14,
                                        lineHeight: 18,
                                        fontWeight: "600",
                                        marginLeft: 4,
                                    }}
                                    lightColor="#000"
                                    darkColor="#000"
                                >
                                    Dr. {docName?.trim().length > 12
                                            ? `${docName.trim().substring(0, 10)}...`
                                            : docName?.trim()}
                                </ThemedText>
                            </View>

                            <ThemedText
                                style={{
                                    fontSize: 11,
                                    lineHeight: 15,
                                    marginTop: 2,
                                }}
                                lightColor="#555"
                                darkColor="#555"
                            >
                                {docNumber}
                            </ThemedText>
                        </View>

                        {/* Status */}
                        <View
                            style={{
                                borderRadius: 12,
                                backgroundColor: "#fff",
                                borderColor: "#2DB9B0",
                                borderWidth: 1,
                                paddingHorizontal: 8,
                                paddingVertical: 2,
                                marginLeft: 6,
                                alignSelf: 'flex-end'
                            }}
                        >
                            <ThemedText
                                style={{
                                    fontSize: 10,
                                    lineHeight: 14,
                                    fontWeight: "600",
                                    color: "#2DB9B0",
                                }}
                            >
                                {finalText(status, translations, selectedLanguage)}
                            </ThemedText>
                        </View>
                    </View>


                    {/* Divider */}
                    <View
                        style={{
                            height: 1,
                            backgroundColor: "#D5E8E6",
                            marginVertical: 8,
                        }}
                    />


                    {/* Patient Info */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Icon type="patientUser" fill="#2DB9B0" />

                        <View style={{ marginLeft: 6 }}>
                            <ThemedText
                                style={{
                                    fontSize: 14,
                                    lineHeight: 18,
                                    fontWeight: "600",
                                }}
                                lightColor="#000"
                                darkColor="#000"
                            >
                                {patientName?.trim().length > 12
                                    ? `${patientName.trim().substring(0, 12)}...`
                                    : patientName?.trim()}
                            </ThemedText>

                            <ThemedText
                                style={{
                                    fontSize: 11,
                                    lineHeight: 15,
                                }}
                                lightColor="#555"
                                darkColor="#555"
                            >
                                {patientNumber}
                            </ThemedText>
                        </View>
                    </View>
                </View>
            </View>
        </ThemedView>
    );
};

export default AppointmentCardHospital;