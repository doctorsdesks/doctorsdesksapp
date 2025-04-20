import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Pressable, BackHandler } from 'react-native';
import Svg, { Path, Rect, G, Defs, ClipPath } from 'react-native-svg';
import { finalText, getPatient } from '@/components/Utils';
import Toast from 'react-native-toast-message';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAppContext } from '@/context/AppContext';
import Loader from '@/components/Loader';

interface PatientDetails {
    imageUrl: string;
    name: string;
    age: string;
    gender: string;
    phone: string;
    alternatePhone: string;
    bloodGroup: string;
    maritalStatus: string;
    emailId: string;
    address: any;
    familyMemberOf?: string;
}

const PatientProfile = () => {
    const { translations, selectedLanguage } = useAppContext();
    const { phone } = useLocalSearchParams();
    const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showMore, setShowMore] = useState(false);
    const { width } = Dimensions.get('window');

    useEffect(() => {
        const backAction = () => {
            router.replace("/dashboard");
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                setLoading(true);
                const response = await getPatient(phone);
                if (response.status === "SUCCESS") {
                    setPatientDetails(response?.data || {});
                    setLoading(false);
                    setError(null);
                } else {
                    Toast.show({
                        type: 'error',  
                        text1: response.error,
                        visibilityTime: 3000,
                    });
                    setLoading(false);
                    setError(response.error);
                }
            } catch (err) {
                setError('Failed to fetch patient details');
                console.error('Error fetching patient details:', err);
            } finally {
                setLoading(false);
            }
        };

        if (phone) {
            fetchPatientDetails();
        }
    }, [phone]);

    if (loading) {
        return (
            <ThemedView style={styles.container} >
                <Loader />
            </ThemedView>
        );
    }

    if (error || !patientDetails) {
        return (
            <ThemedView style={styles.container} >
                <ThemedText  style={styles.errorText} >{finalText(error || 'Patient not found', translations, selectedLanguage)} </ThemedText>
            </ThemedView>
        );
    }

    const getAddress = (address: any) => {
        const fullAddress = address?.addressLine + ", " + address?.landmark + ", " + address?.city + ", " + address?.state + ", " + address?.pincode;
        return fullAddress;
    }

    return (
        <ThemedView style={styles.container} >
            <View style={[styles.profileCard, { width: width }]}>
                <View style={styles.profileHeader}>
                    {patientDetails?.imageUrl !== "" ? 
                        <Image 
                            source={{uri: patientDetails?.imageUrl}} 
                            resizeMode='cover' 
                            height={100} 
                            width={100} 
                            style={styles.profileImage} 
                        />
                    :
                        <Image
                            source={require('@/assets/images/Girl_doctor.png')}
                            style={styles.profileImage}
                        />
                    }
                    <View style={styles.headerInfo}>
                        <ThemedText style={styles.nameText} >{finalText(patientDetails?.name, translations, selectedLanguage)} </ThemedText>
                        <View style={styles.infoRow}>
                            <ThemedText style={[styles.infoText, { textTransform: 'capitalize' }]} >{finalText(patientDetails?.gender, translations, selectedLanguage)} </ThemedText>
                            <View style={styles.dot} />
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <ThemedText style={styles.infoText} >{finalText(patientDetails?.age, translations, selectedLanguage)} </ThemedText>
                                <ThemedText style={[styles.infoText, { marginLeft: 4 }]} >{finalText("years", translations, selectedLanguage)} </ThemedText>
                            </View>
                        </View>
                        <View style={styles.phoneContainer}>
                            <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <Path d="M10.985 9.16598C10.985 9.34598 10.945 9.53098 10.86 9.71098C10.775 9.89098 10.665 10.061 10.52 10.221C10.275 10.491 10.005 10.686 9.7 10.811C9.4 10.936 9.075 11.001 8.725 11.001C8.215 11.001 7.67 10.881 7.095 10.636C6.52 10.391 5.945 10.061 5.375 9.64598C4.8 9.22598 4.255 8.76098 3.735 8.24598C3.22 7.72598 2.755 7.18098 2.34 6.61098C1.93 6.04098 1.6 5.47098 1.36 4.90598C1.12 4.33598 1 3.79098 1 3.27098C1 2.93098 1.06 2.60598 1.18 2.30598C1.3 2.00098 1.49 1.72098 1.755 1.47098C2.075 1.15598 2.425 1.00098 2.795 1.00098C2.935 1.00098 3.075 1.03098 3.2 1.09098C3.33 1.15098 3.445 1.24098 3.535 1.37098L4.695 3.00598C4.785 3.13098 4.85 3.24598 4.895 3.35598C4.94 3.46098 4.965 3.56598 4.965 3.66098C4.965 3.78098 4.93 3.90098 4.86 4.01598C4.795 4.13098 4.7 4.25098 4.58 4.37098L4.2 4.76598C4.145 4.82098 4.12 4.88598 4.12 4.96598C4.12 5.00598 4.125 5.04098 4.135 5.08098C4.15 5.12098 4.165 5.15098 4.175 5.18098C4.265 5.34598 4.42 5.56098 4.64 5.82098C4.865 6.08098 5.105 6.34598 5.365 6.61098C5.635 6.87598 5.895 7.12098 6.16 7.34598C6.42 7.56598 6.635 7.71598 6.805 7.80598C6.83 7.81598 6.86 7.83098 6.895 7.84598C6.935 7.86098 6.975 7.86598 7.02 7.86598C7.105 7.86598 7.17 7.83598 7.225 7.78098L7.605 7.40598C7.73 7.28098 7.85 7.18598 7.965 7.12598C8.08 7.05598 8.195 7.02098 8.32 7.02098C8.415 7.02098 8.515 7.04098 8.625 7.08598C8.735 7.13098 8.85 7.19598 8.975 7.28098L10.63 8.45598C10.76 8.54598 10.85 8.65098 10.905 8.77598C10.955 8.90098 10.985 9.02598 10.985 9.16598Z" fill="#FCFCFC"/>
                            </Svg>
                            <ThemedText style={styles.phoneText} >{finalText(patientDetails?.phone, translations, selectedLanguage)} </ThemedText>
                        </View>
                    </View>
                </View>
                {showMore && (
                    <View style={styles.detailsContainer}>
                        <View style={styles.detailRow}>
                            <View style={styles.detailItem}>
                                <Svg width="32" height="33" viewBox="0 0 32 33" fill="none" style={styles.moreDetailsIcon}>
                                    <Rect y="0.5" width="32" height="32" rx="6" fill="#23918A"/>
                                    <Path d="M24.3057 21.7751C24.3057 22.0751 24.2391 22.3834 24.0974 22.6834C23.9557 22.9834 23.7724 23.2667 23.5307 23.5334C23.1224 23.9834 22.6724 24.3084 22.1641 24.5167C21.6641 24.7251 21.1224 24.8334 20.5391 24.8334C19.6891 24.8334 18.7807 24.6334 17.8224 24.2251C16.8641 23.8167 15.9057 23.2667 14.9557 22.5751C13.9974 21.8751 13.0891 21.1001 12.2224 20.2417C11.3641 19.3751 10.5891 18.4667 9.8974 17.5167C9.21406 16.5667 8.66406 15.6167 8.26406 14.6751C7.86406 13.7251 7.66406 12.8167 7.66406 11.9501C7.66406 11.3834 7.76406 10.8417 7.96406 10.3417C8.16406 9.83341 8.48073 9.36675 8.9224 8.95008C9.45573 8.42508 10.0391 8.16675 10.6557 8.16675C10.8891 8.16675 11.1224 8.21675 11.3307 8.31675C11.5474 8.41675 11.7391 8.56675 11.8891 8.78341L13.8224 11.5084C13.9724 11.7167 14.0807 11.9084 14.1557 12.0917C14.2307 12.2667 14.2724 12.4417 14.2724 12.6001C14.2724 12.8001 14.2141 13.0001 14.0974 13.1917C13.9891 13.3834 13.8307 13.5834 13.6307 13.7834L12.9974 14.4417C12.9057 14.5334 12.8641 14.6417 12.8641 14.7751C12.8641 14.8417 12.8724 14.9001 12.8891 14.9667C12.9141 15.0334 12.9391 15.0834 12.9557 15.1334C13.1057 15.4084 13.3641 15.7667 13.7307 16.2001C14.1057 16.6334 14.5057 17.0751 14.9391 17.5167C15.3891 17.9584 15.8224 18.3667 16.2641 18.7417C16.6974 19.1084 17.0557 19.3584 17.3391 19.5084C17.3807 19.5251 17.4307 19.5501 17.4891 19.5751C17.5557 19.6001 17.6224 19.6084 17.6974 19.6084C17.8391 19.6084 17.9474 19.5584 18.0391 19.4667L18.6724 18.8417C18.8807 18.6334 19.0807 18.4751 19.2724 18.3751C19.4641 18.2584 19.6557 18.2001 19.8641 18.2001C20.0224 18.2001 20.1891 18.2334 20.3724 18.3084C20.5557 18.3834 20.7474 18.4917 20.9557 18.6334L23.7141 20.5917C23.9307 20.7417 24.0807 20.9167 24.1724 21.1251C24.2557 21.3334 24.3057 21.5417 24.3057 21.7751Z" stroke="#C4FFFB" stroke-width="1.5" stroke-miterlimit="10"/>
                                    <Path d="M18.9141 11.5H23.0807" stroke="#C4FFFB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <Path d="M20.9961 13.5834V9.41675" stroke="#C4FFFB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </Svg>
                                <View>
                                    <ThemedText style={{ fontSize: 11, lineHeight: 15, fontWeight: 400, color: "#FCFCFC" }} >{finalText("Alternate No", translations, selectedLanguage)}.</ThemedText>
                                    <ThemedText style={styles.valueText} >{finalText(patientDetails?.alternatePhone || '-', translations, selectedLanguage)} </ThemedText>
                                </View>
                            </View>
                            <View style={styles.detailItem}>
                                <Svg width="32" height="33" viewBox="0 0 32 33" fill="none" style={styles.moreDetailsIcon}>
                                    <Rect y="0.5" width="32" height="32" rx="4" fill="#23918A"/>
                                    <Path d="M8.91406 17.8985C8.91406 14.4116 11.8981 10.966 13.9925 8.97693C15.13 7.89669 16.8648 7.89669 18.0023 8.97693C20.0967 10.966 23.0807 14.4116 23.0807 17.8985C23.0807 21.3171 20.3984 24.8334 15.9974 24.8334C11.5964 24.8334 8.91406 21.3171 8.91406 17.8985Z" stroke="#C4FFFB" stroke-width="1.5"/>
                                </Svg>
                                <View>
                                    <ThemedText style={{ fontSize: 11, lineHeight: 15, fontWeight: 400, color: "#FCFCFC" }} >{finalText("Blood Group", translations, selectedLanguage)} </ThemedText>
                                    <ThemedText style={styles.valueText} >{finalText(patientDetails?.bloodGroup || '-', translations, selectedLanguage)} </ThemedText>
                                </View>
                            </View>
                        </View>

                        <View style={styles.detailRow}>
                            <View style={styles.detailItem}>
                                <Svg width="32" height="33" viewBox="0 0 32 33" fill="none" style={styles.moreDetailsIcon}>
                                    <Rect y="0.5" width="32" height="32" rx="4" fill="#23918A"/>
                                    <G clipPath="url(#clip0_1592_439)">
                                        <Path d="M19.3328 13.1637C18.3909 13.1645 17.4599 13.3656 16.6017 13.7535C15.7434 14.1414 14.9774 14.7073 14.3544 15.4137C13.9573 15.2207 13.5393 15.0742 13.1086 14.9771L14.5136 12.1637L13.0111 10.6637H10.6544L9.15442 12.1637L10.5594 14.9729C9.70189 15.1617 8.89806 15.5417 8.20785 16.0845C7.51765 16.6273 6.95888 17.3189 6.57323 18.1077C6.18757 18.8966 5.98497 19.7623 5.98054 20.6403C5.97611 21.5184 6.16996 22.3861 6.54764 23.1788C6.92531 23.9715 7.47707 24.6687 8.16176 25.2184C8.84645 25.7682 9.64641 26.1562 10.502 26.3537C11.3576 26.5512 12.2467 26.5529 13.103 26.3589C13.9594 26.1648 14.7609 25.7799 15.4478 25.2329C16.3005 25.8495 17.2871 26.2554 18.3269 26.4175C19.3666 26.5796 20.43 26.4932 21.4299 26.1655C22.4299 25.8378 23.3381 25.278 24.0802 24.532C24.8224 23.7859 25.3773 22.8748 25.6998 21.8731C26.0222 20.8714 26.103 19.8076 25.9354 18.7688C25.7678 17.7299 25.3567 16.7454 24.7357 15.8959C24.1146 15.0464 23.3013 14.356 22.3623 13.8811C21.4232 13.4062 20.3851 13.1604 19.3328 13.1637ZM15.3611 22.8554C14.8077 22.1364 14.4624 21.2792 14.3627 20.3774C14.2631 19.4756 14.413 18.5637 14.7961 17.7412C15.4564 18.4032 15.8719 19.27 15.9746 20.1993C16.0773 21.1286 15.8609 22.0653 15.3611 22.8554ZM7.66609 20.6637C7.66433 19.9807 7.83097 19.3077 8.15127 18.7043C8.47158 18.101 8.93566 17.5859 9.50246 17.2047C10.0693 16.8234 10.7213 16.5878 11.4009 16.5186C12.0804 16.4494 12.7666 16.5487 13.3986 16.8079C12.804 17.9657 12.5632 19.2729 12.7064 20.5665C12.8495 21.8602 13.3702 23.0831 14.2036 24.0829C13.5796 24.5182 12.8481 24.774 12.0888 24.8224C11.3295 24.8707 10.5714 24.7099 9.89723 24.3572C9.22303 24.0046 8.65849 23.4738 8.26508 22.8225C7.87168 22.1713 7.66449 21.4246 7.66609 20.6637ZM19.3328 24.8304C18.3619 24.8307 17.4122 24.5465 16.6011 24.0129C17.4216 22.8531 17.7881 21.4326 17.6311 20.0206C17.4741 18.6087 16.8046 17.3033 15.7494 16.3521C16.324 15.7587 17.0367 15.3169 17.8238 15.0662C18.6108 14.8156 19.4477 14.7638 20.2597 14.9155C21.0716 15.0672 21.8333 15.4177 22.4768 15.9357C23.1202 16.4537 23.6252 17.1231 23.9468 17.8839C24.2684 18.6447 24.3964 19.4734 24.3195 20.2958C24.2426 21.1182 23.9632 21.9088 23.5062 22.5969C23.0492 23.2849 22.4288 23.849 21.7005 24.2388C20.9722 24.6285 20.1588 24.8318 19.3328 24.8304ZM14.6811 9.8304L13.4994 8.6479L15.4103 6.74124L16.5886 7.91957L14.6811 9.8304ZM8.95192 9.79457L7.07692 7.91957L8.25525 6.74124L10.1303 8.61624L8.95192 9.79457ZM12.6661 8.99707H10.9994V6.49707H12.6661V8.99707Z" fill="#C4FFFB"/>
                                    </G>
                                    <Defs>
                                        <ClipPath id="clip0_1592_439">
                                            <Rect width="20" height="20" fill="white" transform="translate(6 6.5)"/>
                                        </ClipPath>
                                    </Defs>
                                </Svg>
                                <View>
                                    <ThemedText style={{ fontSize: 11, lineHeight: 15, fontWeight: 400, color: "#FCFCFC" }} >{finalText("Marital Status", translations, selectedLanguage)} </ThemedText>
                                    <ThemedText style={styles.valueText} >{finalText(patientDetails?.maritalStatus || '-', translations, selectedLanguage)} </ThemedText>
                                </View>
                            </View>
                            <View style={styles.detailItem}>
                                <Svg width="32" height="33" viewBox="0 0 32 33" fill="none" style={styles.moreDetailsIcon}>
                                    <Rect y="0.5" width="32" height="32" rx="4" fill="#23918A"/>
                                    <Path d="M11.4813 19.4014C10.3023 20.1034 7.21114 21.5368 9.09388 23.3306C10.0136 24.2068 11.0379 24.8334 12.3257 24.8334H19.6743C20.9621 24.8334 21.9864 24.2068 22.9061 23.3306C24.7889 21.5368 21.6977 20.1034 20.5187 19.4014C17.754 17.7552 14.246 17.7552 11.4813 19.4014Z" stroke="#C4FFFB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <Path d="M19.75 11.9167C19.75 13.9878 18.0711 15.6667 16 15.6667C13.9289 15.6667 12.25 13.9878 12.25 11.9167C12.25 9.84568 13.9289 8.16675 16 8.16675C18.0711 8.16675 19.75 9.84568 19.75 11.9167Z" stroke="#C4FFFB" stroke-width="1.5"/>
                                </Svg>
                                <View>
                                    <ThemedText style={{ fontSize: 11, lineHeight: 15, fontWeight: 400, color: "#FCFCFC" }} >{finalText("Primary User", translations, selectedLanguage)} </ThemedText>
                                    <ThemedText style={styles.valueText} >{finalText(patientDetails?.familyMemberOf || '-', translations, selectedLanguage)} </ThemedText>
                                </View>
                            </View>
                        </View>

                        <View style={styles.detailRow}>
                            <View style={styles.detailItem}>
                            <Svg width="32" height="33" viewBox="0 0 32 33" fill="none" style={styles.moreDetailsIcon}>
                                <Rect y="0.5" width="32" height="32" rx="4" fill="#23918A"/>
                                <Path d="M7.66797 11.5L13.4288 14.7641C15.5526 15.9675 16.45 15.9675 18.5738 14.7641L24.3346 11.5" stroke="#C4FFFB" stroke-width="1.5" stroke-linejoin="round"/>
                                <Path d="M7.68111 17.7298C7.73559 20.2844 7.76283 21.5617 8.70543 22.5079C9.64804 23.4541 10.9599 23.487 13.5837 23.5529C15.2007 23.5936 16.8019 23.5936 18.4189 23.5529C21.0427 23.487 22.3546 23.4541 23.2972 22.5079C24.2398 21.5617 24.267 20.2844 24.3215 17.7298C24.339 16.9084 24.339 16.0918 24.3215 15.2704C24.267 12.7158 24.2398 11.4385 23.2972 10.4923C22.3546 9.54611 21.0427 9.51315 18.419 9.44722C16.8019 9.40659 15.2007 9.40659 13.5837 9.44722C10.9599 9.51313 9.64804 9.54609 8.70543 10.4923C7.76282 11.4385 7.73558 12.7158 7.68111 15.2704C7.66359 16.0918 7.66359 16.9084 7.68111 17.7298Z" stroke="#C4FFFB" stroke-width="1.5" stroke-linejoin="round"/>
                            </Svg>
                                <View>
                                    <ThemedText style={{ fontSize: 11, lineHeight: 15, fontWeight: 400, color: "#FCFCFC" }} >{finalText("Email ID", translations, selectedLanguage)} </ThemedText>
                                    <ThemedText style={styles.valueText} >{finalText(patientDetails?.emailId || '-', translations, selectedLanguage)} </ThemedText>
                                </View>
                            </View>
                            <View style={styles.detailItem}>
                                <Svg width="32" height="33" viewBox="0 0 32 33" fill="none" style={styles.moreDetailsIcon}>
                                    <Rect y="0.5" width="32" height="32" rx="4" fill="#23918A"/>
                                    <Path d="M15.9984 17.6917C17.4344 17.6917 18.5984 16.5276 18.5984 15.0917C18.5984 13.6558 17.4344 12.4917 15.9984 12.4917C14.5625 12.4917 13.3984 13.6558 13.3984 15.0917C13.3984 16.5276 14.5625 17.6917 15.9984 17.6917Z" stroke="#C4FFFB" stroke-width="1.5"/>
                                    <Path d="M9.0187 13.5751C10.6604 6.35842 21.352 6.36675 22.9854 13.5834C23.9437 17.8167 21.3104 21.4001 19.002 23.6168C17.327 25.2334 14.677 25.2334 12.9937 23.6168C10.6937 21.4001 8.06037 17.8084 9.0187 13.5751Z" stroke="#C4FFFB" stroke-width="1.5"/>
                                </Svg>
                                <View>
                                    <ThemedText style={{ fontSize: 11, lineHeight: 15, fontWeight: 400, color: "#FCFCFC" }} >{finalText("Address", translations, selectedLanguage)} </ThemedText>
                                    <ThemedText style={styles.valueText} >{finalText(patientDetails?.address?.addressLine ? getAddress(patientDetails?.address) : '-', translations, selectedLanguage)} </ThemedText>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
                <Pressable onPress={() => setShowMore(!showMore)} style={styles.moreButton}>
                    {showMore ?
                        <Svg width="30" height="24" viewBox="0 0 30 24" fill="none" style={styles.icon}>
                            <Path d="M15.0006 4.99997C13.6894 4.99997 12.4556 5.40897 11.5281 6.15097L6.62188 10.026C6.13063 10.414 6.12563 11.047 6.61063 11.44C7.09438 11.834 7.88688 11.836 8.37813 11.449L13.2894 7.56897C14.2106 6.83197 15.7931 6.83597 16.7031 7.56497L21.6219 11.449C22.1119 11.837 22.9006 11.834 23.3894 11.44C23.8744 11.047 23.8694 10.414 23.3769 10.026L18.4644 6.14597C17.5444 5.40797 16.3106 4.99997 14.9994 4.99997H15.0006ZM15.8831 10.327L23.3819 16.291C23.8719 16.68 23.8744 17.313 23.3869 17.705C22.8994 18.098 22.1094 18.1 21.6194 17.709L15.0019 12.446L8.38188 17.709C7.89313 18.098 7.10188 18.095 6.61313 17.705C6.12688 17.313 6.12938 16.68 6.61813 16.29L14.1194 10.326C14.3631 10.132 14.6819 10.035 15.0006 10.035C15.3194 10.035 15.6381 10.132 15.8819 10.326L15.8831 10.327Z" fill="#FCFCFC"/>
                        </Svg>
                    :
                        <Svg width="30" height="24" viewBox="0 0 30 24" fill="none" style={styles.icon}>
                            <Path d="M15.0006 19C13.6894 19 12.4556 18.591 11.5281 17.849L6.62188 13.974C6.13063 13.586 6.12563 12.953 6.61063 12.56C7.09438 12.166 7.88688 12.164 8.37813 12.551L13.2894 16.431C14.2106 17.168 15.7931 17.164 16.7031 16.435L21.6219 12.551C22.1119 12.163 22.9006 12.166 23.3894 12.56C23.8744 12.953 23.8694 13.586 23.3769 13.974L18.4644 17.854C17.5444 18.592 16.3106 19 14.9994 19H15.0006ZM15.8831 13.673L23.3819 7.70903C23.8719 7.32003 23.8744 6.68703 23.3869 6.29503C22.8994 5.90203 22.1094 5.90003 21.6194 6.29103L15.0019 11.554L8.38188 6.29103C7.89313 5.90203 7.10188 5.90503 6.61313 6.29503C6.12688 6.68703 6.12938 7.32003 6.61813 7.71003L14.1194 13.674C14.3631 13.868 14.6819 13.965 15.0006 13.965C15.3194 13.965 15.6381 13.868 15.8819 13.674L15.8831 13.673Z" fill="#FCFCFC"/>
                        </Svg>
                    }
                </Pressable>
            </View>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        flex: 1,
        position: 'relative',
    },
    profileCard: {
        backgroundColor: '#2DB9B0',
        borderRadius: 24,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        overflow: 'hidden',
        marginLeft: -16,
        marginRight: -16,
    },
    profileHeader: {
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 100,
        marginRight: 16,
        borderWidth: 2, 
        borderColor: "#FFFFFF",
    },
    headerInfo: {
        flex: 1,
    },
    nameText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FCFCFC',
        marginBottom: 4,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        fontWeight: 400,
        color: '#FCFCFC',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FCFCFC',
        marginHorizontal: 8,
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    phoneText: {
        fontSize: 16,
        color: '#FCFCFC',
        marginLeft: 8,
    },
    moreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 12,
    },
    detailsContainer: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        backgroundColor: '#2DB9B0',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    valueText: {
        fontSize: 14,
        marginTop: 2,
        lineHeight: 18,
        color: '#FCFCFC',
        fontWeight: '600',
        width: 100,
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: '#32383D',
    },
    errorText: {
        marginTop: 20,
        fontSize: 16,
        color: '#FF4444',
    },
    icon: {
        width: 30,
        height: 24
    },
    moreDetailsIcon: {
        marginRight: 12,
    }
});

export default PatientProfile;
