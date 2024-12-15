import CustomText from '@/components/CustomText';
import MainFooter from '@/components/MainFooter';
import MainHeader from '@/components/MainHeader';
import { useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { BackHandler, Dimensions, Pressable, View } from 'react-native';


const Profile = () => {
    const { setDoctorDetails } = useAppContext();
    const { height } = Dimensions.get('window');

    const handleLogout = () => {
        setDoctorDetails({});
        router.replace({
            pathname: "/login",
            params: {
                allowBack: "false",
            }
        });
    }

    useEffect(() => {
        const backAction = () => {
            router.replace("/dashboard");
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    }, []);

    return (
        <View style={{ marginHorizontal: 16, marginTop: 52, position: 'relative', height }} >
            <MainHeader selectedNav='profile' />
            <View style={{ borderRadius: 8, borderColor: "#D9D9D9", borderWidth: 1, display: 'flex', flexDirection: 'column', paddingHorizontal: 16, paddingVertical: 12, width: "100%" }} >
                <View style={{ paddingVertical: 8, display: 'flex', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }} >
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                        <Ionicons size={24} name='person' color={"#0F1828"} />
                        <CustomText textStyle={{ marginLeft: 8, fontSize: 15, lineHeight: 24, fontWeight: 500, color: "#0F1828" }} text="Personal Details" multiLingual={true} />
                    </View>
                    <Pressable
                        onPress={() => {
                            router.replace("/personalDetails");
                        }}
                    >
                        <Ionicons size={24} color={"#0F1828"} name='chevron-forward' />
                    </Pressable>
                </View>
                <View style={{ paddingVertical: 8, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }} >
                    <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }} >
                        <Ionicons size={24} name='settings-outline' color={"#0F1828"} />
                        <CustomText textStyle={{ marginLeft: 8, fontSize: 15, lineHeight: 24, fontWeight: 500, color: "#0F1828" }} multiLingual={true} text="Clinic Details" />
                    </View>
                    <Pressable
                        // onPress={() => {
                        //     router.replace("/personalDetails");
                        // }}
                    >
                        <Ionicons size={24} color={"#0F1828"} name='chevron-forward' />
                    </Pressable>
                </View>
           </View>
           <View style={{ borderRadius: 8, borderColor: "#D9D9D9", borderWidth: 1, display: 'flex', flexDirection: 'column', paddingHorizontal: 16, paddingVertical: 12, width: "100%", marginTop: 20}} >
                <View style={{ paddingVertical: 8, display: 'flex', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }} >
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                        <Ionicons size={24} name='settings-outline' color={"#0F1828"} />
                        <CustomText textStyle={{ marginLeft: 8, fontSize: 15, lineHeight: 24, fontWeight: 500, color: "#0F1828" }} multiLingual={true} text="Manage Slots" />
                    </View>
                    <Pressable
                        // onPress={() => {
                        //     router.replace("/personalDetails");
                        // }}
                    >
                        <Ionicons size={24} color={"#0F1828"} name='chevron-forward' />
                    </Pressable>
                </View>
                <View style={{ paddingVertical: 8, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }} >
                    <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }} >
                        <Ionicons size={24} name='settings-outline' color={"#0F1828"} />
                        <CustomText textStyle={{ marginLeft: 8, fontSize: 15, lineHeight: 24, fontWeight: 500, color: "#0F1828" }} multiLingual={true} text="Consultation Fees" />
                    </View>
                    <Pressable
                        // onPress={() => {
                        //     router.replace("/personalDetails");
                        // }}
                    >
                        <Ionicons size={24} color={"#0F1828"} name='chevron-forward' />
                    </Pressable>
                </View>
           </View>
           <View style={{ borderRadius: 8, borderColor: "#D9D9D9", borderWidth: 1, display: 'flex', flexDirection: 'column', paddingHorizontal: 16, paddingVertical: 12, width: "100%", marginTop: 20}} >
                <View style={{ paddingVertical: 8, display: 'flex', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }} >
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                        <Ionicons size={24} name='language-outline' color={"#0F1828"} />
                        <CustomText textStyle={{ marginLeft: 8, fontSize: 15, lineHeight: 24, fontWeight: 500, color: "#0F1828" }} multiLingual={true} text="App Language" />
                    </View>
                    <Pressable
                        // onPress={() => {
                        //     router.replace("/personalDetails");
                        // }}
                    >
                        <Ionicons size={24} color={"#0F1828"} name='chevron-forward' />
                    </Pressable>
                </View>
           </View>
           <Pressable onPress={handleLogout} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: height-600 }}>
                <Ionicons size={24} name='log-out-outline' color={"#0F1828"} />
                <CustomText textStyle={{ fontSize: 15, lineHeight: 24, fontWeight: 600, color: "#0F1828", marginLeft: 8 }} text="Logout" multiLingual={true} />
           </Pressable>
           <MainFooter selectedNav='profile' />
        </View>
    )
};

export default Profile;