import React from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Slot, useLocalSearchParams } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { finalText } from '@/components/Utils';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import Icon from '@/components/Icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme.web';

export default function PatientProfileLayout() {
    const params = useLocalSearchParams();
    const { translations, selectedLanguage } = useAppContext();
    const { width } = Dimensions.get('window');
    const colorScheme = useColorScheme() ?? 'light';
    
    // Get patient name from params if available
    const patientName = params.name as string || '';
    
    // Handle back navigation
    const handleBackNav = () => {
        router.replace("/dashboard");
    };

    // Get header title
    const getHeaderTitle = () => {
        return patientName || "Patient Profile";
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Custom Header */}
            <ThemedView style={[styles.headerContainer, { width }]}>
                <Pressable 
                    style={{ position: 'absolute', left: 16, top: 12, height: 32 }} 
                    onPress={handleBackNav}
                >
                    <Icon type='goBack' fill={Colors[colorScheme].icon} />
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
