import { ThemedView } from './ThemedView';
import { Pressable, StyleSheet, View } from 'react-native';
import CustomPopUp from './CustomPopUp';
import Icon from './Icons';
import CustomInput2 from './CustomInput2';
import CustomButton from './CustomButton';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme.web';

interface AppointmentCancelPopUpProps {
    width: number;
    showCancelPopUp: boolean;
    setShowCancelPopUp: (value: boolean) => void;
    cancelReason: any;   
    handleCancelReason: (value: string, id: string) => void;
    updateAppointment: (type: string, id: string) => void;
}

const AppointmentCancelPopUp: React.FC<AppointmentCancelPopUpProps> = ({ showCancelPopUp, width, setShowCancelPopUp, cancelReason, handleCancelReason, updateAppointment }) => {

    const colorScheme = useColorScheme() ?? 'light';

    return (
        <CustomPopUp visible={showCancelPopUp} onClose={() => setShowCancelPopUp(true)}>
            <ThemedView style={{ display: 'flex', alignItems: "flex-start", paddingVertical: 32, paddingTop: 40, position: 'relative' }} >
                <Pressable
                    onPress={() => setShowCancelPopUp(false)}
                    style={styles.closeButton}
                >
                    <Icon type='cross' fill={Colors[colorScheme].icon} />
                </Pressable>
                <View style={{ display: "flex", width: width - 64, marginTop: 20 }} >
                    <CustomInput2 data={cancelReason} onChange={handleCancelReason} />
                </View>
                <View style={{ display: "flex", width: width - 64, marginTop: 20 }} >
                    <CustomButton multiLingual={true} width='FULL' title="Cancel Appointment" isDisabled={cancelReason?.value === ""} onPress={() => updateAppointment("CANCEL", cancelReason?.appointmentId)} />
                </View>
            </ThemedView>
        </CustomPopUp>
    )
}

export default AppointmentCancelPopUp;

const styles = StyleSheet.create({
    closeButton: {
        padding: 8,
        position: 'absolute',
        right: 0,
        top: 8
    },
});