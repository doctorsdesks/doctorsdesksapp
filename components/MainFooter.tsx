import React from 'react';
import { Dimensions, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from './ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import Icon from './Icons';
import { ThemedText } from './ThemedText';
import { finalText } from './Utils';
import { useAppContext } from '@/context/AppContext';

interface MainFooterProps {
    selectedNav: string;
}

const MainFooter: React.FC<MainFooterProps> = ({ selectedNav }) => {
    const { translations, selectedLanguage } = useAppContext();
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
                <Icon type="home" fill={selectedNav === "home" ? "#5257E9" : "#A9A9AB" } />
                <ThemedText style={{ fontSize: 10, lineHeight: 14, fontWeight: 600, color: selectedNav === "home" ? "#5257E9" : "#A9A9AB", marginTop: 4 }} >{finalText("Home", translations, selectedLanguage)} </ThemedText>
            </Pressable>
            <Pressable onPress={() => handleClick("task")} style={{  width: 60, paddingVertical: 10, borderTopWidth: selectedNav === "task" ? 3 : 3, borderColor: selectedNav === "task" ? "#5257E9" : colorSchema === 'dark' ? "#303135" : "#fff", display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                <Icon type="task" fill={selectedNav === "task" ? "#5257E9" : "#A9A9AB" } />
                <ThemedText style={{ fontSize: 10, lineHeight: 14, fontWeight: 600, color: selectedNav === "task" ? "#5257E9" : "#A9A9AB", marginTop: 4 }} >{finalText("Task", translations, selectedLanguage)} </ThemedText>
            </Pressable>
            <Pressable onPress={() => handleClick("appointment")} style={{  width: 60, paddingVertical: 10, borderTopWidth: selectedNav === "appointment" ? 3 : 3, borderColor: selectedNav === "appointment" ? "#5257E9" : colorSchema === 'dark' ? "#303135" : "#fff", display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                <Icon type="appointment" fill={selectedNav === "appointment" ? "#5257E9" : "#A9A9AB" } />
                <ThemedText style={{ fontSize: 10, lineHeight: 14, fontWeight: 600, color: selectedNav === "appointment" ? "#5257E9" : "#A9A9AB", marginTop: 4 }} >{finalText("Appointment", translations, selectedLanguage)} </ThemedText>
            </Pressable>
            <Pressable onPress={() => handleClick("profile")} style={{ width: 60, paddingVertical: 10, borderTopWidth: selectedNav === "profile" ? 3 : 3, borderColor: selectedNav === "profile" ? "#5257E9" : colorSchema === 'dark' ? "#303135" : "#fff", display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                <Icon type="profile" fill={selectedNav === "profile" ? "#5257E9" : "#A9A9AB" } />
                <ThemedText style={{ fontSize: 10, lineHeight: 14, fontWeight: 600, color: selectedNav === "profile" ? "#5257E9" : "#A9A9AB", marginTop: 4 }} >{finalText("Profile", translations, selectedLanguage)} </ThemedText>
            </Pressable>
        </ThemedView>
    );
};

export default MainFooter;
