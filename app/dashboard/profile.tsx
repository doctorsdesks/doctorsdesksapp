import CustomText from '@/components/CustomText';
import Icon from '@/components/Icon';
import { useAppContext } from '@/context/AppContext';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { BackHandler, Dimensions, View } from 'react-native';


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
        <View style={{ marginHorizontal: 16, marginTop: 60 }} >
           <View style={{ borderRadius: 8, borderColor: "#D9D9D9", borderWidth: 1, display: 'flex', flexDirection: 'column', paddingHorizontal: 16, paddingVertical: 12, width: "100%" }} >
                <View style={{ paddingVertical: 8, display: 'flex', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }} >
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                        <Icon iconType='personalDetails' />
                        <CustomText textStyle={{ marginLeft: 8, fontSize: 15, lineHeight: 24, fontWeight: 500, color: "#0F1828" }} text="Personal Details" multiLingual={true} />
                    </View>
                    <Icon iconType='rightArrow' onClick={() => router.replace("/personalDetails")} />
                </View>
                <View style={{ paddingVertical: 8, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }} >
                    <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }} >
                        <Icon iconType='personalDetails' />
                        <CustomText textStyle={{ marginLeft: 8, fontSize: 15, lineHeight: 24, fontWeight: 500, color: "#0F1828" }} multiLingual={true} text="Clinic Details" />
                    </View>
                    <Icon iconType='rightArrow' onClick={() => router.replace("/clinicDetails")}  />
                </View>
           </View>
           <View style={{ borderRadius: 8, borderColor: "#D9D9D9", borderWidth: 1, display: 'flex', flexDirection: 'column', paddingHorizontal: 16, paddingVertical: 12, width: "100%", marginTop: 20}} >
                <View style={{ paddingVertical: 8, display: 'flex', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }} >
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                        <Icon iconType='manageSlot' />
                        <CustomText textStyle={{ marginLeft: 8, fontSize: 15, lineHeight: 24, fontWeight: 500, color: "#0F1828" }} multiLingual={true} text="Manage Slots" />
                    </View>
                    <Icon iconType='rightArrow' onClick={() => router.replace("/clinicDetails/manageSlotAndTiming")} />
                </View>
                <View style={{ paddingVertical: 8, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }} >
                    <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }} >
                        <Icon iconType='rupee' />
                        <CustomText textStyle={{ marginLeft: 8, fontSize: 15, lineHeight: 24, fontWeight: 500, color: "#0F1828" }} multiLingual={true} text="Consultation Fees" />
                    </View>
                    <Icon iconType='rightArrow' onClick={() => router.replace("/clinicDetails/consultationFee")}  />
                </View>
           </View>
           <View style={{ borderRadius: 8, borderColor: "#D9D9D9", borderWidth: 1, display: 'flex', flexDirection: 'column', paddingHorizontal: 16, paddingVertical: 12, width: "100%", marginTop: 20}} >
                <View style={{ paddingVertical: 8, display: 'flex', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }} >
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                        {/* <Icon iconType='manageSlot' /> */}
                        <CustomText textStyle={{ marginLeft: 8, fontSize: 15, lineHeight: 24, fontWeight: 500, color: "#0F1828" }} multiLingual={true} text="App Language" />
                    </View>
                    <Icon iconType='rightArrow' onClick={() => router.replace("/clinicDetails/appLanguage")} />
                </View>
           </View>
           <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: height-600 }}>
                <Icon iconType='logout' onClick={handleLogout} />
                <CustomText textStyle={{ fontSize: 15, lineHeight: 24, fontWeight: 600, color: "#0F1828", marginLeft: 8 }} text="Logout" multiLingual={true} />
           </View>
        </View>
    )
};

export default Profile;