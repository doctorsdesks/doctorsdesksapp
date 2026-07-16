import { Image, View } from 'react-native';
import { capitalizeWords, changeTimeToAmPm, finalText } from './Utils';
import { AppointmentStatus } from '@/constants/Enums';
import CustomButton from './CustomButton';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useAppContext } from '@/context/AppContext';
import Icon from './Icons';

interface AppointmentCardProps {
    appointment: Appointment;
    width: number;
    handleStatusUpdate?: (status: string, id: string) => void;
    source?: string;
}

export interface Appointment {
    _id: string,
    doctorId: string,
    hospitalId?: {
        _id: string;
        hospitalName: string;
    },
    hospitalDoctorMappingId?: string,
    doctorImageUrl: string,
    doctorName: string,
    patientId: string,
    patientImageUrl: string,
    patientName: string,
    date: string,
    startTime: string,
    endTime: string,
    appointmentType: string,
    opdAppointmentType?: string,
    status: string,
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, width, handleStatusUpdate, source }) => {
    const { translations, selectedLanguage } = useAppContext();
    const isHospitalAppointment = !!appointment?.hospitalId;

    const getStatusBGColor = (status: string) => {
        switch (status) {
            case AppointmentStatus.ACCEPTED:
                return "#fff";
                break;
            case AppointmentStatus.CANCELLED:
                return "#fff";
                break;
            case AppointmentStatus.COMPLETED:
                return "#2DB9B0";
                break;
            default:
                return "";
                break;
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case AppointmentStatus.ACCEPTED:
                return "#2DB9B0";
                break;
            case AppointmentStatus.CANCELLED:
                return "#2DB9B0";
                break;
            case AppointmentStatus.COMPLETED:
                return "#fff";
                break;
            default:
                return "";
                break;
        }
    }

    const getStatusBorderColor = (status: string) => {
        switch (status) {
            case AppointmentStatus.ACCEPTED:
                return "#2DB9B0";
                break;
            case AppointmentStatus.CANCELLED:
                return "#F5004F";
                break;
            case AppointmentStatus.COMPLETED:
                return "#2DB9B0";
                break;
            default:
                return "";
                break;
        }
    }

    return (
        <ThemedView 
            key={appointment?._id} 
            style={{
                borderWidth: source === "notification" ? 0 : 1,
                borderRadius: 14,
                backgroundColor: isHospitalAppointment
                    ? "#F4F9FF"
                    : "#FFFFFF",
                borderColor: isHospitalAppointment
                    ? "#B8DAFF"
                    : "#D9D9D9",
                padding: 16,
                paddingHorizontal: source === "notification" ? 0 : 16,
                marginBottom: source === "notification" ? 0 : 16,
                shadowColor: isHospitalAppointment
                    ? "#4F8EF7"
                    : "#000",

                shadowOffset: {
                    width: 0,
                    height: 4,
                },

                shadowOpacity: isHospitalAppointment
                    ? 0.12
                    : 0.04,

                shadowRadius: 8,

                elevation: isHospitalAppointment
                    ? 4
                    : 1,
            }}
        >
            {isHospitalAppointment && (
                <View
                    style={{
                        alignSelf: "flex-start",
                        backgroundColor: "#E6F2FF",
                        borderRadius: 20,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        marginBottom: 12,
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Icon type="hospital" />
                    <ThemedText
                        style={{
                            marginLeft: 6,
                            color: "#2F6FED",
                            fontWeight: "700",
                            fontSize: 12,
                        }}
                    >
                        Hospital Appointment
                    </ThemedText>
                </View>
            )}
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderBottomWidth: appointment?.status === AppointmentStatus.PENDING ? 1 : 0, borderBottomColor: "#F1F1F1" }} >
                <View style={{ height: 70, width: 70, borderRadius: 100, display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', backgroundColor: "#2DB9B0" }} >
                    {appointment?.patientImageUrl && appointment?.patientImageUrl !== ""
                    ?
                        <Image source={{uri: appointment?.patientImageUrl}} resizeMode='cover' height={70} width={70} style={{ height: 70, width: 70, borderRadius: 100 }} />  
                    :
                        <ThemedText style={{ fontSize: 40, lineHeight: 52, fontWeight: 700 }}>{capitalizeWords(appointment?.patientName)?.substring(0,1)}</ThemedText>
                    }
                </View>
                <View style={{ marginLeft: 24, display: 'flex', width: width - 236 }} >
                    <ThemedText style={{ fontSize: 16, fontWeight: 600 }}>{capitalizeWords(appointment?.patientName)}</ThemedText>
                    {isHospitalAppointment && (
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 4,
                            }}
                        >
                            <ThemedText
                                style={{
                                    fontSize: 12,
                                    color: "#2F6FED",
                                    fontWeight: "600",
                                }}
                            >
                                🏥 {appointment?.hospitalId?.hospitalName}
                            </ThemedText>
                        </View>
                    )}
                    <View style={{ marginTop: 6, display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                        <Icon type="calendarEmpty" />
                        <ThemedText style={{ marginLeft: 8, fontSize: 12, lineHeight: 16, fontWeight: 400 }} >{appointment?.date}</ThemedText>
                    </View>
                    <View style={{ marginTop: 6, display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                        <Icon type="watchEmpty" />
                        <ThemedText style={{ marginLeft: 8, fontSize: 12, lineHeight: 16, fontWeight: 400 }}>{changeTimeToAmPm(appointment?.startTime)}</ThemedText>
                    </View>
                    <View style={{ marginTop: 6, marginBottom: 10, paddingHorizontal: 6, paddingVertical: 6, borderRadius: 40, backgroundColor: "#1EA6D6", display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                        <ThemedText style={{ fontSize: 11, lineHeight: 16, fontWeight: 600, color: "#FFFFFF" }} >{finalText(appointment?.appointmentType === "OPD" ? "Normal Appointment" : "Emergency Appointment", translations, selectedLanguage)} </ThemedText>
                    </View>
                </View>
                {appointment?.status !== AppointmentStatus.PENDING && 
                    <View 
                        style={{ width: 80, paddingHorizontal: 8, paddingVertical: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 40, borderWidth: 1, borderColor: getStatusBorderColor(appointment?.status), backgroundColor: getStatusBGColor(appointment?.status), alignSelf: 'flex-start' }} 
                    >
                        <ThemedText style={{ fontSize: 10, lineHeight: 16, fontWeight: 600, color: getStatusColor(appointment?.status) }} >{finalText(appointment?.status, translations, selectedLanguage)} </ThemedText>
                    </View>
                }
            </View>
            {appointment?.status === AppointmentStatus.PENDING && 
                <View style={{ marginTop: 10 }} >
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                        <CustomButton multiLingual={true} width='HALF' title="Deny" onPress={() => handleStatusUpdate && handleStatusUpdate("CANCEL", appointment?._id)} textColor="#009688" containerStyle={{ backgroundColor: "#fff", borderWidth: 1, borderColor: "#009688" }} icon="deny" />
                        <CustomButton multiLingual={true} width='HALF' title="Approve" onPress={() => handleStatusUpdate && handleStatusUpdate("ACCEPT", appointment?._id)} icon='approve' />
                    </View>
                </View>
            }
        </ThemedView>
    );
};

export default AppointmentCard;