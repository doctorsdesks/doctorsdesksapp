import { useState } from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import { AppointmentStatus } from '@/constants/Enums';
import { changeTimeToAmPm, finalText } from './Utils';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useAppContext } from '@/context/AppContext';
import Icon from './Icons';

interface AppointmentCardTwoProps {
    lastAppointment: boolean;
    firstAppointment: boolean;
    name: string;
    number: string;
    startTime: string;
    status: string;
    handleStatusUpdate: (status: string) => void;
    hospitalName?: string;
    isHospitalAppointment?: boolean;
}

const AppointmentCardTwo: React.FC<AppointmentCardTwoProps> = ({ lastAppointment, firstAppointment, name, number, startTime, status, handleStatusUpdate, hospitalName, isHospitalAppointment }) => {
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
                {status === AppointmentStatus.COMPLETED ?
                    <Icon type='rightTick' />
                :
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
                }
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
                    marginLeft: 36,
                }}
            >
                <ThemedText style={{ fontSize: 14, lineHeight: 16, fontWeight: 600, width: 62 }}>{changeTimeToAmPm(startTime)}</ThemedText>
            </View>
            <View style={{ paddingVertical: 10 }} >
                <View
                    style={{
                        marginLeft: 16,
                        paddingVertical: 8,
                        paddingRight: 16,
                        paddingLeft: 8,
                        borderLeftWidth: 8,
                        borderRadius: 8,
                        width: width - 152,
                        backgroundColor: isHospitalAppointment
                            ? "#F4F9FF"
                            : "#EAF4F3",
                        borderLeftColor: isHospitalAppointment
                            ? "#2F6FED"
                            : "#2DB9B0",
                        borderWidth: isHospitalAppointment ? 1 : 0,
                        borderColor: isHospitalAppointment ? "#B8DAFF" : undefined,
                        shadowColor: isHospitalAppointment ? "#2F6FED" : "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: isHospitalAppointment ? 0.12 : 0.05,
                        shadowRadius: 4,
                        elevation: isHospitalAppointment ? 3 : 1,
                    }}
                >
                    <ThemedText style={{ fontSize: 14, lineHeight: 16, fontWeight: 600 }} lightColor='#000' darkColor='#000' >{name}</ThemedText>
                    {isHospitalAppointment && (
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                alignSelf: "flex-start",
                                backgroundColor: "#E6F2FF",
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                borderRadius: 20,
                                marginTop: 8,
                            }}
                        >
                            <Icon type="hospital" />

                            <ThemedText
                                style={{
                                    marginLeft: 6,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: "#2F6FED",
                                }}
                            >
                                {hospitalName}
                            </ThemedText>
                        </View>
                    )}
                    <ThemedText style={{ fontSize: 11, lineHeight: 16, fontWeight: 400, marginTop: isHospitalAppointment ? 10 : 8 }} lightColor='#333' darkColor='#333' >{number}</ThemedText>
                    <Pressable
                        style={{
                            borderRadius: 4,
                            borderColor: isHospitalAppointment
                                ? "#2F6FED"
                                : "#2DB9B0",
                            borderWidth: 1,
                            paddingHorizontal: 8,
                            paddingVertical: 6,
                            alignSelf: 'flex-end',
                            marginTop: 10
                        }}
                        onPress={() => handleStatusUpdate("COMPLETE")}
                    >
                        <ThemedText style={{ fontSize: 14, lineHeight: 16, fontWeight: 600, color: isHospitalAppointment ? "#2F6FED" : "#2DB9B0" }} >{finalText("Complete", translations, selectedLanguage)}</ThemedText>
                    </Pressable>
                </View>
            </View>
        </ThemedView>
    );
};

export default AppointmentCardTwo;