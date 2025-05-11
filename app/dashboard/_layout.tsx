import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Slot, usePathname } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { finalText } from '@/components/Utils';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import Icon from '@/components/Icons';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Colors } from '@/constants/Colors';

export default function DashboardLayout() {
    const pathname = usePathname();
    const { translations, selectedLanguage } = useAppContext();
    const { width } = Dimensions.get('window');
    const colorSchema = useColorScheme() ?? 'light';
    
    // Determine the current route for header and footer
    const [currentRoute, setCurrentRoute] = useState('home');
    
    useEffect(() => {
        // Extract the current route from pathname
        if (pathname === '/dashboard') {
            setCurrentRoute('home');
        } else if (pathname === '/dashboard/tasks') {
            setCurrentRoute('task');
        } else if (pathname === '/dashboard/appointments') {
            setCurrentRoute('appointment');
        } else if (pathname === '/dashboard/profile') {
            setCurrentRoute('profile');
        } else if (pathname.includes('/dashboard/profile')) {
            setCurrentRoute('profile');
        } else if (pathname.includes('/clinicDetail')) {
            // Handle clinic detail routes
            if (pathname.includes('manageSlotAndTiming')) {
                setCurrentRoute('manageSlotAndTiming');
            } else if (pathname.includes('manageSlotTiming')) {
                setCurrentRoute('manageSlotTiming');
            } else if (pathname.includes('consultationFee')) {
                setCurrentRoute('consultationFee');
            } else if (pathname.includes('appLanguage')) {
                setCurrentRoute('appLanguage');
            } else if (pathname.includes('blockSlots')) {
                setCurrentRoute('block');
            } else {
                setCurrentRoute('clinicDetails');
            }
        } else if (pathname.includes('/personalDetails')) {
            setCurrentRoute('personalDetails');
        } else if (pathname.includes('/patientProfile')) {
            setCurrentRoute('patientProfile');
        }
    }, [pathname]);

    // Handle back navigation based on current route
    const handleBackNav = () => {
        switch (currentRoute) {
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
                router.replace({
                    pathname: "/clinicDetail/manageSlotAndTiming",
                    params: {
                        selectedNav: "Clinic Timing",
                    }
                });
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
    };

    // Get header title based on current route
    const getHeaderTitle = () => {
        let text;
        switch (currentRoute) {
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
                // For patient profile, the title might come from params
                // This would need to be handled differently
                text = "Patient Profile";
                break;
            default:
                text = "";
                break;
        }
        return text;
    };

    // Handle footer tab navigation
    const handleFooterTabClick = (value: string) => {
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
                break;
            default:
                break;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Custom Header */}
            {currentRoute !== "home" && 
                <ThemedView style={[styles.headerContainer, { width }]}>
                    <Pressable 
                        style={{ position: 'absolute', left: 16, top: 12, height: 32 }} 
                        onPress={handleBackNav}
                    >
                        <Icon type='goBack' fill={Colors[colorSchema].icon} />
                    </Pressable>
                    <ThemedText style={styles.headerText}>
                        {finalText(getHeaderTitle(), translations, selectedLanguage)}
                    </ThemedText>
                </ThemedView>
            }
            
            {/* Page Content */}
            <View style={styles.content}>
                <Slot />
            </View>
            
            {/* Footer Tabs */}
            <ThemedView style={[styles.footerContainer, { backgroundColor: Colors[colorSchema].background }]}>
                <Pressable 
                    onPress={() => handleFooterTabClick("home")} 
                    style={[
                        styles.footerTab, 
                        { borderColor: currentRoute === "home" ? "#5257E9" : Colors[colorSchema].background }
                    ]}
                >
                    <Icon type="home" fill={currentRoute === "home" ? "#5257E9" : "#A9A9AB"} />
                    <ThemedText 
                        style={[
                            styles.footerTabText, 
                            { color: currentRoute === "home" ? "#5257E9" : "#A9A9AB" }
                        ]}
                    >
                        {finalText("Home", translations, selectedLanguage)}
                    </ThemedText>
                </Pressable>
                
                <Pressable 
                    onPress={() => handleFooterTabClick("task")} 
                    style={[
                        styles.footerTab, 
                        { borderColor: currentRoute === "task" ? "#5257E9" : Colors[colorSchema].background }
                    ]}
                >
                    <Icon type="task" fill={currentRoute === "task" ? "#5257E9" : "#A9A9AB"} />
                    <ThemedText 
                        style={[
                            styles.footerTabText, 
                            { color: currentRoute === "task" ? "#5257E9" : "#A9A9AB" }
                        ]}
                    >
                        {finalText("Task", translations, selectedLanguage)}
                    </ThemedText>
                </Pressable>
                
                <Pressable 
                    onPress={() => handleFooterTabClick("appointment")} 
                    style={[
                        styles.footerTab, 
                        { borderColor: currentRoute === "appointment" ? "#5257E9" : Colors[colorSchema].background }
                    ]}
                >
                    <Icon type="appointment" fill={currentRoute === "appointment" ? "#5257E9" : "#A9A9AB"} />
                    <ThemedText 
                        style={[
                            styles.footerTabText, 
                            { color: currentRoute === "appointment" ? "#5257E9" : "#A9A9AB" }
                        ]}
                    >
                        {finalText("Appointment", translations, selectedLanguage)}
                    </ThemedText>
                </Pressable>
                
                <Pressable 
                    onPress={() => handleFooterTabClick("profile")} 
                    style={[
                        styles.footerTab, 
                        { borderColor: currentRoute === "profile" ? "#5257E9" : Colors[colorSchema].background }
                    ]}
                >
                    <Icon 
                        type="profile" 
                        fill={currentRoute === "profile" ? "#5257E9" : "#A9A9AB"} 
                    />
                    <ThemedText 
                        style={[
                            styles.footerTabText, 
                            { color: currentRoute === "profile" ? "#5257E9" : "#A9A9AB" }
                        ]}
                    >
                        {finalText("Profile", translations, selectedLanguage)}
                    </ThemedText>
                </Pressable>
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        display: 'flex',
        position: 'relative',
        flexDirection: 'row',
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 12,
        paddingTop: 12,
        // Bottom border shadow effect
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(128, 128, 128, 0.1)',
        // iOS shadow - only at bottom
        shadowColor: 'rgba(128, 128, 128, 0.5)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        zIndex: 100,
    },
    headerText: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 32,
        textTransform: 'capitalize',
    },
    content: {
        flex: 1,
        paddingBottom: 60, // Space for footer
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: 'transparent',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 10,
        zIndex: 10,
    },
    footerTab: {
        width: 60,
        borderTopWidth: 3,
        paddingVertical: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    footerTabText: {
        fontSize: 10,
        lineHeight: 14,
        fontWeight: '600',
        marginTop: 4,
    },
});
