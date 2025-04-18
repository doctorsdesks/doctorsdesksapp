import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { finalText } from './Utils';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import Icon from './Icons';

interface MainHeaderProps {
    selectedNav: string;
    title?: string;
}

const MainHeader: React.FC<MainHeaderProps> = ({ selectedNav, title = "" }) => {
    const { translations, selectedLanguage } = useAppContext();

    const handleBackNav = () => {
        switch (selectedNav) {
            case 'task':
                router.replace("/dashboard");
                break;
            case 'appointment':
                router.replace("/dashboard");
                break;
            case 'profile': 
                router.replace("/dashboard");
                break;
            case 'personalDetails':
                router.replace("/dashboard/profile");
                break;
            case "clinicDetails":
                router.replace("/dashboard/profile");
                break;
            case "manageSlotAndTiming":
                router.replace("/dashboard/profile");
                break;
            case "manageSlotTiming":
                router.replace("/clinicDetail/manageSlotAndTiming");
                break;
            case "consultationFee":
                router.replace("/dashboard/profile");
                break;
            case "appLanguage":
                router.replace("/dashboard/profile");
                break;
            case "patientProfile":
                router.replace("/dashboard");
                break;
            case "block":
                router.replace("/dashboard/profile");
                break;
            default:
                break;
        }
    }

    const showtext = () => {
        let text;
        switch (selectedNav) {
            case "home":
                text = "Home";
                break;
            case "task":
                text = "Tasks";
                break;
            case "appointment":
                text = "Appointments";
                break;
            case "profile":
                text = "My Profile";
                break;
            case "personalDetails":
                text = "Personal Details";
                break;
            case "clinicDetails":
                text = "Clinic Address";
                break;
            case "manageSlotAndTiming":
                text = "Clinic Timings";
                break;
            case "manageSlotTiming":
                text = "Add Timings";
                break;
            case "consultationFee":
                text = "Consultation Fee";
                break;
            case "appLanguage":
                text = "App Language";
                break;
            case "block":
                text = "Block Slots";
                break;
            case "patientProfile":
                text = title || "";
                break;
            default:
                text = "";
                break;
        }
        return text;
    }

    return (
        <ThemedView style={{ display: 'flex', position: 'relative', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }} >
            {selectedNav !== "home" && <Pressable style={{ position: 'absolute', left: 0 }} onPress={handleBackNav}>
                <Icon type="goBack" />
            </Pressable>}
            <ThemedText style={styles.text} >{finalText(showtext(), translations, selectedLanguage)}</ThemedText>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    text: { 
        fontSize: 16, 
        fontWeight: 600, 
        lineHeight: 22,
        textTransform: "capitalize"
    }
})

export default MainHeader;