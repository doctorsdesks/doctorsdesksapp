import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

export default function () {
    const { docType } = useLocalSearchParams();
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: `Upload ${docType} Card`,
                    headerLeft: () => (
                        <Pressable onPress={() => router.replace({
                            pathname: '/signup',
                            params: {
                                currentStep: "IDP"
                            }
                        })}>
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
