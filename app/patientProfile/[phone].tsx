import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Pressable } from 'react-native';
import { finalText, getPatient } from '@/components/Utils';
import Toast from 'react-native-toast-message';
import CustomText from '@/components/CustomText';
import MainHeader from '@/components/MainHeader';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAppContext } from '@/context/AppContext';

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
                <MainHeader selectedNav="patientProfile" />
                <ThemedText style={styles.loadingText} >{finalText("Loading", translations, selectedLanguage)}...</ThemedText>
            </ThemedView>
        );
    }

    if (error || !patientDetails) {
        return (
            <ThemedView style={styles.container} >
                <MainHeader selectedNav="patientProfile" />
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
            <MainHeader selectedNav="patientProfile" title={patientDetails?.name} />
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
                            <Ionicons name="call" size={16} color="#fff" />
                            <ThemedText style={styles.phoneText} >{finalText(patientDetails?.phone, translations, selectedLanguage)} </ThemedText>
                        </View>
                    </View>
                </View>
                {showMore && (
                    <View style={styles.detailsContainer}>
                        <View style={styles.detailRow}>
                            <View style={styles.detailItem}>
                                <Image
                                    source={require('@/assets/images/alternatePhoneIcon.png')}
                                    style={styles.moreDetailsIcon}
                                />
                                <View>
                                    <ThemedText style={styles.labelText} >{finalText("Alternate No", translations, selectedLanguage)}.</ThemedText>
                                    <ThemedText style={styles.valueText} >{finalText(patientDetails?.alternatePhone || '-', translations, selectedLanguage)} </ThemedText>
                                </View>
                            </View>
                            <View style={styles.detailItem}>
                                <Image
                                    source={require('@/assets/images/bloodGroupIcon.png')}
                                    style={styles.moreDetailsIcon}
                                />
                                <View>
                                    <ThemedText style={styles.labelText} >{finalText("Blood Group", translations, selectedLanguage)} </ThemedText>
                                    <ThemedText style={styles.valueText} >{finalText(patientDetails?.bloodGroup || '-', translations, selectedLanguage)} </ThemedText>
                                </View>
                            </View>
                        </View>

                        <View style={styles.detailRow}>
                            <View style={styles.detailItem}>
                                <Image
                                    source={require('@/assets/images/maritalStatusIcon.png')}
                                    style={styles.moreDetailsIcon}
                                />
                                <View>
                                    <ThemedText style={styles.labelText} >{finalText("Marital Status", translations, selectedLanguage)} </ThemedText>
                                    <ThemedText style={styles.valueText} >{finalText(patientDetails?.maritalStatus || '-', translations, selectedLanguage)} </ThemedText>
                                </View>
                            </View>
                            <View style={styles.detailItem}>
                                <Image
                                    source={require('@/assets/images/personIcon.png')}
                                    style={styles.moreDetailsIcon}
                                />
                                <View>
                                    <ThemedText style={styles.labelText} >{finalText("Primary User", translations, selectedLanguage)} </ThemedText>
                                    <ThemedText style={styles.valueText} >{finalText(patientDetails?.familyMemberOf || '-', translations, selectedLanguage)} </ThemedText>
                                </View>
                            </View>
                        </View>

                        <View style={styles.detailRow}>
                            <View style={styles.detailItem}>
                                <Image
                                    source={require('@/assets/images/emailIcon.png')}
                                    style={styles.moreDetailsIcon}
                                />
                                <View>
                                    <ThemedText style={styles.labelText} >{finalText("Email ID", translations, selectedLanguage)} </ThemedText>
                                    <ThemedText style={styles.valueText} >{finalText(patientDetails?.emailId || '-', translations, selectedLanguage)} </ThemedText>
                                </View>
                            </View>
                            <View style={styles.detailItem}>
                                <Image
                                    source={require('@/assets/images/locationIcon.png')}
                                    style={styles.moreDetailsIcon}
                                />
                                <View>
                                    <ThemedText style={styles.labelText} >{finalText("Address", translations, selectedLanguage)} </ThemedText>
                                    <ThemedText style={styles.valueText} >{finalText(patientDetails?.address?.addressLine ? getAddress(patientDetails?.address) : '-', translations, selectedLanguage)} </ThemedText>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
                <Pressable onPress={() => setShowMore(!showMore)} style={styles.moreButton}>
                    {showMore ?
                        <Image
                            source={require('@/assets/images/chevronUpIcon.png')}
                            style={styles.icon}
                        />
                    :
                        <Image
                            source={require('@/assets/images/chevronDownIcon.png')}
                            style={styles.icon}
                        />
                    }
                </Pressable>
            </View>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 62,
        height: "100%",
        position: 'relative',
    },
    profileCard: {
        marginTop: 20,
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
    labelText: {
        fontSize: 11,
        lineHeight: 11,
        fontWeight: 400,
        color: '#FCFCFC',
    },
    valueText: {
        fontSize: 14,
        marginTop: 8,
        lineHeight: 14,
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
        width: 32,
        height: 32,
        marginRight: 12,
    }
});

export default PatientProfile;
