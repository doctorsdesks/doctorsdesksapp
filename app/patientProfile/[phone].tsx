import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Pressable } from 'react-native';
import { getPatient } from '@/components/Utils';
import Toast from 'react-native-toast-message';
import CustomText from '@/components/CustomText';
import MainHeader from '@/components/MainHeader';
import { Ionicons } from '@expo/vector-icons';

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
}

const PatientProfile = () => {
    const { phone } = useLocalSearchParams();
    const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showMore, setShowMore] = useState(false);
    const { width, height } = Dimensions.get('window');

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
            <View style={{ marginHorizontal: 16, marginTop: 52, height }} >
                <MainHeader selectedNav="patientProfile" />
                <CustomText multiLingual={true} text="Loading..." textStyle={styles.loadingText} />
            </View>
        );
    }

    if (error || !patientDetails) {
        return (
            <View style={{ marginHorizontal: 16, marginTop: 52, height }} >
                <MainHeader selectedNav="patientProfile" />
                <CustomText multiLingual={true} text={error || 'Patient not found'} textStyle={styles.errorText} />
            </View>
        );
    }

    const getAddress = (address: any) => {
        const fullAddress = address?.addressLine + ", " + address?.landmark + ", " + address?.city + ", " + address?.state + ", " + address?.pincode;
        return fullAddress;
    }

    return (
        <View style={{ marginHorizontal: 16, marginTop: 52, height }} >
            <MainHeader selectedNav="patientProfile" title={patientDetails?.name} />
            <View style={[styles.profileCard, { width: width - 32 }]}>
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
                        <CustomText text={patientDetails?.name} textStyle={styles.nameText} />
                        <View style={styles.infoRow}>
                            <CustomText multiLingual={true} text={patientDetails?.gender} textStyle={styles.infoText} />
                            <View style={styles.dot} />
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <CustomText textStyle={styles.infoText}  text={patientDetails?.age}/>
                                <CustomText multiLingual={true} textStyle={[styles.infoText, { marginLeft: 4 }]} text="years"/>
                            </View>
                        </View>
                        <View style={styles.phoneContainer}>
                            <Ionicons name="call" size={16} color="#fff" />
                            <CustomText text={patientDetails?.phone} textStyle={styles.phoneText} />
                        </View>
                    </View>
                </View>

                <Pressable onPress={() => setShowMore(!showMore)} style={styles.moreButton}>
                    <CustomText multiLingual={true} text={showMore ? "Less Details" :"More Details"} textStyle={styles.moreText} />
                    <Ionicons 
                        name={showMore ? "chevron-up" : "chevron-down"} 
                        size={24} 
                        color="#fff" 
                    />
                </Pressable>

                {showMore && (
                    <View style={styles.detailsContainer}>
                        <View style={styles.detailRow}>
                            <View style={styles.detailItem}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="call" size={20} color="#fff" />
                                </View>
                                <View>
                                    <CustomText multiLingual={true} text="Alternate No." textStyle={styles.labelText} />
                                    <CustomText text={patientDetails?.alternatePhone || '-'} textStyle={styles.valueText} />
                                </View>
                            </View>
                            <View style={styles.detailItem}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="water" size={20} color="#fff" />
                                </View>
                                <View>
                                    <CustomText multiLingual={true} text="Blood Group" textStyle={styles.labelText} />
                                    <CustomText text={patientDetails?.bloodGroup || '-'} textStyle={styles.valueText} />
                                </View>
                            </View>
                        </View>

                        <View style={styles.detailRow}>
                            <View style={styles.detailItem}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="heart" size={20} color="#fff" />
                                </View>
                                <View>
                                    <CustomText multiLingual={true} text="Marital Status" textStyle={styles.labelText} />
                                    <CustomText text={patientDetails?.maritalStatus || '-'} textStyle={styles.valueText} />
                                </View>
                            </View>
                            {/* <View style={styles.detailItem}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="person" size={20} color="#fff" />
                                </View>
                            </View> */}
                        </View>

                        <View style={styles.detailRow}>
                            <View style={styles.detailItem}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="mail" size={20} color="#fff" />
                                </View>
                                <View>
                                    <CustomText text="Email ID" textStyle={styles.labelText} />
                                    <CustomText text={patientDetails?.emailId || '-'} textStyle={styles.valueText} />
                                </View>
                            </View>
                            <View style={styles.detailItem}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="location" size={20} color="#fff" />
                                </View>
                                <View>
                                    <CustomText multiLingual={true} text="Address" textStyle={styles.labelText} />
                                    <CustomText text={patientDetails?.address?.addressLine ? getAddress(patientDetails?.address) : '-'} textStyle={styles.valueText} />
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    profileCard: {
        marginTop: 20,
        backgroundColor: '#2DB9B0',
        borderRadius: 24,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        overflow: 'hidden',
    },
    profileHeader: {
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
    },
    headerInfo: {
        flex: 1,
    },
    nameText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 16,
        color: '#fff',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#fff',
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
        color: '#fff',
        marginLeft: 8,
    },
    moreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.2)',
    },
    moreText: {
        fontSize: 16,
        color: '#fff',
        marginRight: 8,
    },
    detailsContainer: {
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    labelText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 2,
    },
    valueText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '500',
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
});

export default PatientProfile;
