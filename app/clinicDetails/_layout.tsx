import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

export default function () {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Clinic Details',
                    headerLeft: () => (
                        <Pressable onPress={() => {
                            router.replace("/dashboard/profile");
                        }}>
                            <Ionicons style={styles.icon} name="arrow-back" size={24} color="black" />
                        </Pressable>
                    ),
                    headerTitleAlign: 'center',
                }}
            />
            <Stack.Screen
                name="manageSlotAndTiming"
                options={{
                    title: 'Manage Slot',
                    headerLeft: () => (
                        <Pressable onPress={() => {
                            router.replace("/dashboard/profile");
                        }}>
                            <Ionicons style={styles.icon} name="arrow-back" size={24} color="black" />
                        </Pressable>
                    ),
                    headerTitleAlign: 'center',
                }}
            />
            <Stack.Screen
                name="manageSlotTiming"
                options={{
                    title: 'Add Slot',
                    headerLeft: () => (
                        <Pressable onPress={() => {
                            router.replace("/clinicDetails/manageSlotAndTiming");
                        }}>
                            <Ionicons style={styles.icon} name="arrow-back" size={24} color="black" />
                        </Pressable>
                    ),
                    headerTitleAlign: 'center',
                }}
            />
            <Stack.Screen
                name="consultationFee"
                options={{
                    title: 'Consultation Fee',
                    headerLeft: () => (
                        <Pressable onPress={() => {
                            router.replace("/dashboard/profile");
                        }}>
                            <Ionicons style={styles.icon} name="arrow-back" size={24} color="black" />
                        </Pressable>
                    ),
                    headerTitleAlign: 'center',
                }}
            />
            <Stack.Screen
                name="appLanguage"
                options={{
                    title: 'App Language',
                    headerLeft: () => (
                        <Pressable onPress={() => {
                            router.replace("/dashboard/profile");
                        }}>
                            <Ionicons style={styles.icon} name="arrow-back" size={24} color="black" />
                        </Pressable>
                    ),
                    headerTitleAlign: 'center',
                }}
            />
        </Stack>
    );
};

const styles = StyleSheet.create({
    icon: {
        marginLeft: 12,
    },
});
