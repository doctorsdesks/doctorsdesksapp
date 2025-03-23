import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';
import CustomText from './CustomText';
import { router } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { finalText } from './Utils';

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
                text = "Clinic Details";
                break;
            case "manageSlotAndTiming":
                text = "Manage Slot";
                break;
            case "manageSlotTiming":
                text = "Slot Timing";
                break;
            case "consultationFee":
                text = "Consultation Fee";
                break;
            case "appLanguage":
                text = "App Language";
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
        <View style={{ display: 'flex', position: 'relative', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }} >
            {selectedNav !== "home" && <Pressable style={{ position: 'absolute', left: 0 }} onPress={handleBackNav}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>}
            <CustomText text={finalText(showtext(), translations, selectedLanguage)} textStyle={{ fontSize: 16, fontWeight: 600, color: "#32383D", lineHeight: 22, textTransform: title ? "capitalize" : "" }} />
        </View>
    );
};

export default MainHeader;