import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';
import CustomText from './CustomText';
import { router } from 'expo-router';

interface MainHeaderProps {
    selectedNav: string;
}

const MainHeader: React.FC<MainHeaderProps> = ({ selectedNav }) => {

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
            default:
                break;
        }
        return text;
    }

    return (
        <View style={{ display: 'flex', position: 'relative', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }} >
            {selectedNav !== "home" && <Pressable style={{ position: 'absolute', left: 0 }} onPress={handleBackNav}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>}
            <CustomText text={showtext()} textStyle={{ fontSize: 16, fontWeight: 600, color: "#32383D", lineHeight: 22 }} />
        </View>
    );
};

export default MainHeader;