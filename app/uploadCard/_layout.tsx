import Icon from '@/components/Icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

export default function () {
    const { docType } = useLocalSearchParams();
    const colorScheme = useColorScheme() ?? 'light';
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
                            <Icon type='goBack' fill={Colors[colorScheme].icon} />
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
        marginLeft: 0,
    },
});
