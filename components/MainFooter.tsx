import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Pressable } from 'react-native';
import CustomText from './CustomText';
import { router } from 'expo-router';
import { ThemedView } from './ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme.web';

interface MainFooterProps {
    selectedNav: string;
}

const MainFooter: React.FC<MainFooterProps> = ({ selectedNav }) => {
    const { width } = Dimensions.get('window');
    const colorSchema = useColorScheme() ?? 'light';

    const handleClick = (value: string) => {
        switch (value) {
            case "home":
                router.replace("/dashboard")
                break;
            case "task":
                router.replace("/dashboard/tasks");
                break;
            case "appointment":
                router.replace("/dashboard/appointments");
                break;
            case "profile":
                router.replace("/dashboard/profile");
            default:
                break;
        }
    }

    return (
        <ThemedView style={{ 
            width: width,
            paddingHorizontal: 16,
            position: 'absolute', 
            bottom: 0,
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            backgroundColor: colorSchema === 'dark' ? '#303135' : '#fff'
        }} >
            <Pressable onPress={() => handleClick("home")} style={{ width: 60, paddingVertical: 10, borderTopWidth: selectedNav === "home" ? 3 : 3, borderColor: selectedNav === "home" ? "#5257E9" : colorSchema === 'dark' ? "#303135" : "#fff", display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                <Ionicons name='home' size={24} color={selectedNav === "home" ? "#5257E9" : "#A9A9AB" } />
                <CustomText text="Home" textStyle={{ fontSize: 10, lineHeight: 14, fontWeight: 600, color: selectedNav === "home" ? "#5257E9" : "#A9A9AB", marginTop: 4 }} />
            </Pressable>
            <Pressable onPress={() => handleClick("task")} style={{  width: 60, paddingVertical: 10, borderTopWidth: selectedNav === "task" ? 3 : 3, borderColor: selectedNav === "task" ? "#5257E9" : colorSchema === 'dark' ? "#303135" : "#fff", display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                <Ionicons name='clipboard-outline' size={24} color={selectedNav === "task" ? "#5257E9" : "#A9A9AB" } />
                <CustomText text="Task" textStyle={{ fontSize: 10, lineHeight: 14, fontWeight: 600, color: selectedNav === "task" ? "#5257E9" : "#A9A9AB", marginTop: 4 }} />
            </Pressable>
            <Pressable onPress={() => handleClick("appointment")} style={{  width: 60, paddingVertical: 10, borderTopWidth: selectedNav === "appointment" ? 3 : 3, borderColor: selectedNav === "appointment" ? "#5257E9" : colorSchema === 'dark' ? "#303135" : "#fff", display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                <Ionicons name='calendar-outline' size={24} color={selectedNav === "appointment" ? "#5257E9" : "#A9A9AB" } />
                <CustomText text="Appointment" textStyle={{ fontSize: 10, lineHeight: 14, fontWeight: 600, color: selectedNav === "appointment" ? "#5257E9" : "#A9A9AB", marginTop: 4 }} />
            </Pressable>
            <Pressable onPress={() => handleClick("profile")} style={{ width: 60, paddingVertical: 10, borderTopWidth: selectedNav === "profile" ? 3 : 3, borderColor: selectedNav === "profile" ? "#5257E9" : colorSchema === 'dark' ? "#303135" : "#fff", display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                <Ionicons name='person-outline' size={24} color={selectedNav === "profile" ? "#5257E9" : "#A9A9AB" } />
                <CustomText text="Profile" textStyle={{ fontSize: 10, lineHeight: 14, fontWeight: 600, color: selectedNav === "profile" ? "#5257E9" : "#A9A9AB", marginTop: 4 }} />
            </Pressable>
        </ThemedView>
    );
};

export default MainFooter;
