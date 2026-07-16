import Loader from '@/components/Loader';
import { ThemedView } from '@/components/ThemedView';
import { finalText, logout, saveSecureKey } from '@/components/Utils';
import { useAppContext } from '@/context/AppContext';
import { router } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { BackHandler, Dimensions, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DocStatusType } from '@/constants/Enums';
import { ThemedText } from '@/components/ThemedText';
import Icon from '@/components/Icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme.web';

const Profile = () => {
    const { setHospitalDetails, hospitalDetails, translations, selectedLanguage } = useAppContext();
    const { width, height } = Dimensions.get('window');
    const scrollViewRef = useRef(null);
    const [loader, setLoader] = useState<boolean>(false);
    const colorScheme = useColorScheme() ?? 'light';

    const handleLogout = async () => {
        setLoader(true);
        const payload = {
            phone: hospitalDetails?.phone,
            type: "ADMIN"
        };
        await logout(payload);
        await saveSecureKey("userId", ""); 
        await saveSecureKey("userType", ""); 
        await saveSecureKey("doctorId", ""); 
        await saveSecureKey("hospitalId", ""); 
        await saveSecureKey("userAuthtoken", ""); 
        setHospitalDetails({});
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
            router.replace("/hospitalDashboard");
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    }, []);

    return (
        <ThemedView style={styles.container} >
            <View style={{ position: 'relative', width: width, marginLeft: -16 }} >
                <LinearGradient
                    colors={['#2DB9B0', '#14534F']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ width: "100%", height: 86, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
                />
                <View style={{ marginTop: -52, display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                    <ThemedText style={{ fontSize: 20, lineHeight: 24, fontWeight: 700 }} >{hospitalDetails?.hospitalName}</ThemedText>
                </View>
            </View>
            <ScrollView 
                ref={scrollViewRef}
                style={{ maxHeight: height - 320, marginTop: 48 }} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                <View style={{ marginTop: 16, borderRadius: 8, borderColor: "#D9D9D9", borderWidth: 1, display: 'flex', flexDirection: 'column', paddingHorizontal: 16, paddingRight: 8, paddingVertical: 12, width: "100%" }} >
                    <Pressable 
                        onPress={() => {
                            router.replace({
                                pathname: "/clinicDetail/appLanguage",
                                params: {
                                    userType: "ADMIN",
                                }
                            });
                        }}
                        style={{ paddingVertical: 8, display: 'flex', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }} 
                    >
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                            <Icon type='clinicSetting' fill={Colors[colorScheme].icon} />
                            <ThemedText style={{ marginLeft: 8, fontSize: 15, lineHeight: 24, fontWeight: 500 }} >{finalText("App Language", translations, selectedLanguage)} </ThemedText>
                        </View>
                        <Icon type='arrowRight' fill={Colors[colorScheme].icon} />
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            router.replace({
                                pathname: "/dashboard/tnc",
                                params: {
                                    sourcePath: "/hospitalDashboard/profile",
                                }
                            })
                        }}
                        style={{ paddingVertical: 8, display: 'flex', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                            <Icon type='tnc' fill={Colors[colorScheme].icon} />
                            <ThemedText style={{ marginLeft: 8, fontSize: 15, lineHeight: 24, fontWeight: 500 }} >{finalText("Terms & Conditions", translations, selectedLanguage)} </ThemedText>
                        </View>
                        <Icon type='arrowRight' fill={Colors[colorScheme].icon} />
                    </Pressable>
                </View>
                <View style={{ borderRadius: 8, borderColor: "#D9D9D9", borderWidth: 1, display: 'flex', flexDirection: 'column', paddingHorizontal: 16, paddingRight: 8, paddingVertical: 12, width: "100%", marginTop: 16 }} >
                    <Pressable 
                        onPress={handleLogout}
                        style={{ paddingVertical: 8, display: 'flex', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                            <Icon type='logout' fill={Colors[colorScheme].icon} />
                            <ThemedText style={{ marginLeft: 8, fontSize: 15, lineHeight: 24, fontWeight: 500 }} >{finalText("Logout", translations, selectedLanguage)} </ThemedText>
                        </View>
                        <Icon type='arrowRight' fill={Colors[colorScheme].icon} />
                    </Pressable>
                </View>
            </ScrollView>
            {loader && <Loader />}
        </ThemedView>
    )
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 80, // Increased bottom padding to account for footer
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
