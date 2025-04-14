import Loader from '@/components/Loader';
import MainFooter from '@/components/MainFooter';
import MainHeader from '@/components/MainHeader';
import { ThemedView } from '@/components/ThemedView';
import { finalText, logout } from '@/components/Utils';
import { useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DocStatusType } from '@/constants/Enums';
import { ThemedText } from '@/components/ThemedText';

const Profile = () => {
    const { setDoctorDetails, doctorDetails, translations, selectedLanguage } = useAppContext();
    const { width } = Dimensions.get('window');
    const [loader, setLoader] = useState<boolean>(false);

    const handleLogout = async () => {
        setLoader(true);
        const payload = {
            phone: doctorDetails?.phone,
            type: "DOCTOR"
        };
        await logout(payload);
        setDoctorDetails({});
        setLoader(false);
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

    const getQualification = () => {
        let finalString = doctorDetails?.graduation;
        finalString = finalString + ", " + doctorDetails?.specialisation;
        return finalString;
    }

    return (
        <ThemedView style={styles.container} >
            <MainHeader selectedNav='profile' />
            <View style={{ position: 'relative', width: width, marginLeft: -16 }} >
                <LinearGradient
                    colors={['#2DB9B0', '#14534F']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ width: "100%", height: 86, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
                />
                <View style={{ position: 'absolute', top: 0, left: "36%" }} >
                    <View style={{ position: 'relative', right: -72, top: 32, zIndex: 20 }} >
                        {doctorDetails?.docStatus === DocStatusType.VERIFIED ? 
                            <Image
                                source={require('@/assets/images/verified.png')}
                                style={styles.icon}
                            /> 
                        : 
                            <Image
                                source={require('@/assets/images/notVerifiedIcon.png')}
                                style={styles.icon}
                            /> 
                        }
                    </View>
                    {doctorDetails && doctorDetails?.imageUrl && doctorDetails?.imageUrl !== "" ? <Image source={{uri: doctorDetails?.imageUrl}} resizeMode='cover' height={100} width={100} style={{ marginTop: 8, height: 100, width: 100, borderRadius: 100 }} />
                    : 
                        <Image
                            source={require('@/assets/images/Girl_doctor.png')}
                            style={styles.profileImage}
                        />
                    }
                </View>
            </View>
            <View style={{ marginTop: 56, display: 'flex', alignItems: 'center' }}>
                <ThemedText style={{ fontSize: 14, lineHeight: 14, fontWeight: 500 }} >Dr. {doctorDetails?.name}</ThemedText>
                <ThemedText style={{ fontSize: 12, lineHeight: 12, fontWeight: 400, marginTop: 6 }} >{getQualification()}</ThemedText>
            </View>
            <View style={{ marginTop: 16, borderRadius: 8, borderColor: "#D9D9D9", borderWidth: 1, display: 'flex', flexDirection: 'column', paddingHorizontal: 16, paddingRight: 8, paddingVertical: 12, width: "100%" }} >
                <View style={{ paddingVertical: 8, display: 'flex', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }} >
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                        <Image
                                source={require('@/assets/images/userIcon.png')}
                                style={styles.icon}
                        /> 
                        <ThemedText style={{ marginLeft: 8, fontSize: 15, lineHeight: 24, fontWeight: 500 }} >{finalText("Personal Details", translations, selectedLanguage)}</ThemedText>
                    </View>
                    <Pressable
                        onPress={() => {
                            router.replace("/personalDetails");
                        }}
                        style={{ paddingHorizontal: 8 }}
                    >
                        <Ionicons size={24} color={"#0F1828"} name='chevron-forward' />
                    </Pressable>
                </View>
                <View style={{ paddingVertical: 8, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }} >
                    <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }} >
                        <Image
                            source={require('@/assets/images/clinicIcon.png')}
                            style={styles.icon}
                        /> 
                        <ThemedText style={{ marginLeft: 8, fontSize: 15, lineHeight: 24, fontWeight: 500 }} >{finalText("Clinic Address", translations, selectedLanguage)} </ThemedText>
                    </View>
                    <Pressable
                        onPress={() => {
                            router.replace("/clinicDetail");
                        }}
                        style={{ paddingHorizontal: 8 }}
                    >
                        <Ionicons size={24} color={"#0F1828"} name='chevron-forward' />
                    </Pressable>
                </View>
            </View>
            <View style={{ borderRadius: 8, borderColor: "#D9D9D9", borderWidth: 1, display: 'flex', flexDirection: 'column', paddingHorizontal: 16, paddingRight: 8, paddingVertical: 12, width: "100%", marginTop: 16 }} >
                <View style={{ paddingVertical: 8, display: 'flex', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }} >
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                        <Image
                            source={require('@/assets/images/calendarIcon.png')}
                            style={styles.icon}
                        /> 
                        <ThemedText style={{ marginLeft: 8, fontSize: 15, lineHeight: 24, fontWeight: 500 }} >{finalText("Clinic Timings", translations, selectedLanguage)} </ThemedText>
                    </View>
                    <Pressable
                        onPress={() => {
                            router.replace("/clinicDetail/manageSlotAndTiming");
                        }}
                        style={{ paddingHorizontal: 8 }}
                    >
                        <Ionicons size={24} color={"#0F1828"} name='chevron-forward' />
                    </Pressable>
                </View>
                <View style={{ paddingVertical: 8, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }} >
                    <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }} >
                        <Image
                            source={require('@/assets/images/calendarIcon.png')}
                            style={styles.icon}
                        /> 
                        <ThemedText style={{ marginLeft: 8, fontSize: 15, lineHeight: 24, fontWeight: 500 }} >{finalText("Consultation Fees", translations, selectedLanguage)} </ThemedText>
                    </View>
                    <Pressable
                        onPress={() => {
                            router.replace("/clinicDetail/consultationFee");
                        }}
                        style={{ paddingHorizontal: 8 }}
                    >
                        <Ionicons size={24} color={"#0F1828"} name='chevron-forward' />
                    </Pressable>
                </View>
                <View style={{ paddingVertical: 8, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }} >
                    <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }} >
                        <Image
                            source={require('@/assets/images/calendarIcon.png')}
                            style={styles.icon}
                        /> 
                        <ThemedText style={{ marginLeft: 8, fontSize: 15, lineHeight: 24, fontWeight: 500 }} >{finalText("Block Slots", translations, selectedLanguage)} </ThemedText>
                    </View>
                    <Pressable
                        onPress={() => {
                            router.replace("/clinicDetail/blockSlots");
                        }}
                        style={{ paddingHorizontal: 8 }}
                    >
                        <Ionicons size={24} color={"#0F1828"} name='chevron-forward' />
                    </Pressable>
                </View>
            </View>
            <View style={{ borderRadius: 8, borderColor: "#D9D9D9", borderWidth: 1, display: 'flex', flexDirection: 'column', paddingHorizontal: 16, paddingRight: 8, paddingVertical: 12, width: "100%", marginTop: 16 }} >
                <View style={{ paddingVertical: 8, display: 'flex', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }} >
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                        <Image
                            source={require('@/assets/images/calendarIcon.png')}
                            style={styles.icon}
                        /> 
                        <ThemedText style={{ marginLeft: 8, fontSize: 15, lineHeight: 24, fontWeight: 500 }} >{finalText("App Language", translations, selectedLanguage)} </ThemedText>
                    </View>
                    <Pressable
                        onPress={() => {
                            router.replace("/clinicDetail/appLanguage");
                        }}
                        style={{ paddingHorizontal: 8 }}
                    >
                        <Ionicons size={24} color={"#0F1828"} name='chevron-forward' />
                    </Pressable>
                </View>
                <View style={{ paddingVertical: 8, display: 'flex', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }} >
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                        <Image
                            source={require('@/assets/images/logoutIcon.png')}
                            style={styles.icon}
                        /> 
                        <ThemedText style={{ marginLeft: 8, fontSize: 15, lineHeight: 24, fontWeight: 500 }} >{finalText("Logout", translations, selectedLanguage)} </ThemedText>
                    </View>
                    <Pressable
                        onPress={handleLogout}
                        style={{ paddingHorizontal: 8 }}
                    >
                        <Ionicons size={24} color={"#0F1828"} name='chevron-forward' />
                    </Pressable>
                </View>
           </View>
           <MainFooter selectedNav='profile' />
           {loader && <Loader />}
        </ThemedView>
    )
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 62,
        height: "100%",
        position: 'relative'
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 100,
    },
    icon: {
        width: 24,
        height: 24
    }
});

export default Profile;
