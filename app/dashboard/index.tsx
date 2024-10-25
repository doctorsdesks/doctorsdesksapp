import { useAppContext } from '@/context/AppContext';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';


const Dashboard = () => {
    const { doctorDetails, setDoctorDetails } = useAppContext();

    const handleLogout = () => {
        setDoctorDetails({});
        router.replace({
            pathname: "/login",
            params: {
                allowBack: "false",
            }
        });
    }

    return (
        <View style={{ marginHorizontal: 16, marginVertical: 20 }} >
            <Text style={{ marginTop: 12, fontSize: 16, fontWeight: 700 }} >
                Welcome Doctor {doctorDetails?.name}
            </Text>
            <Pressable onPress={handleLogout} style={{ marginTop: 24, borderWidth: 1, borderRadius: 8, borderColor: "#333", paddingVertical: 4, paddingHorizontal: 8, width: 100 }}>
                <Text>
                    Logout
                </Text>
            </Pressable>
        </View>
    )
};

export default Dashboard;