import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Slot, usePathname } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { finalText } from '@/components/Utils';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import Icon from '@/components/Icons';

export default function ClinicDetailLayout() {
    const pathname = usePathname();
    const { translations, selectedLanguage } = useAppContext();
    const { width } = Dimensions.get('window');
    
    // Determine the current route for header
    const [currentRoute, setCurrentRoute] = useState('clinicDetails');
    
    useEffect(() => {
        // Extract the current route from pathname
        if (pathname === '/clinicDetail') {
            setCurrentRoute('clinicDetails');
        } else if (pathname.includes('/clinicDetail/manageSlotAndTiming')) {
            setCurrentRoute('manageSlotAndTiming');
        } else if (pathname.includes('/clinicDetail/manageSlotTiming')) {
            setCurrentRoute('manageSlotTiming');
        } else if (pathname.includes('/clinicDetail/consultationFee')) {
            setCurrentRoute('consultationFee');
        } else if (pathname.includes('/clinicDetail/appLanguage')) {
            setCurrentRoute('appLanguage');
        } else if (pathname.includes('/clinicDetail/blockSlots')) {
            setCurrentRoute('block');
        }
    }, [pathname]);

    // Handle back navigation based on current route
    const handleBackNav = () => {
        switch (currentRoute) {
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
            case "block":
                router.replace("/dashboard/profile");
                break;
            default:
                router.replace("/dashboard/profile");
                break;
        }
    };

    // Get header title based on current route
    const getHeaderTitle = () => {
        let text;
        switch (currentRoute) {
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
            default:
                text = "Clinic Details";
                break;
        }
        return text;
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Custom Header */}
            <ThemedView style={[styles.headerContainer, { width }]}>
                <Pressable 
                    style={{ position: 'absolute', left: 16, top: 12, height: 32 }} 
                    onPress={handleBackNav}
                >
                    <Icon type="goBack" />
                </Pressable>
                <ThemedText style={styles.headerText}>
                    {finalText(getHeaderTitle(), translations, selectedLanguage)}
                </ThemedText>
            </ThemedView>
            
            {/* Page Content */}
            <View style={styles.content}>
                <Slot />
            </View>
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
        backgroundColor: '#FFFFFF',
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
    },
});
