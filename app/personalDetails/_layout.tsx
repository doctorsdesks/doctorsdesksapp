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
                    title: 'Personal Details',
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