import AppointmentCancelPopUp from '@/components/AppointmentCancelPopUp';
import AppointmentCard from '@/components/AppointmentCard';
import CustomPopUp from '@/components/CustomPopUp';
import EachNotification from '@/components/EachNotification';
import Loader from '@/components/Loader';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { finalText, getAllNotifications, getNotificationCount, getOneAppointment, getSecureKey, markNotificationRead, markReadAllNotifications } from '@/components/Utils';
import { NotificationType } from '@/constants/Enums';
import { URLS } from '@/constants/Urls';
import { useAppContext } from '@/context/AppContext';
import { textObject } from '@/context/InitialState';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { BackHandler, Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Toast from "react-native-toast-message";


const Notifications = () => {
    const { selectedAppointment } = useLocalSearchParams();
    const { notifications, setNotifications, translations, selectedLanguage, doctorDetails } = useAppContext();
    const { height, width } = Dimensions.get('window');
    const [loader, setLoader] = useState(false);
    const [isUnReadNotificationExist, setIsUnReadNotificationExist] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const scrollViewRef = useRef(null);
    const [appointment, setAppointment] = useState(null);
    const [showCancelPopUp, setShowCancelPopUp] = useState<boolean>(false);
    const [cancelReason, setCancelReason] = useState<any>(textObject);

    useEffect(() => {
        const backAction = () => {
            router.replace("/dashboard");
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        if (selectedAppointment &&  selectedAppointment as string !== "") {
            fetchAppointment(selectedAppointment as string);
        }
    },[selectedAppointment])

    useEffect(() => {
        if (notifications && notifications?.length > 0) {
            const count = getNotificationCount(notifications);
            setIsUnReadNotificationExist(count !== 0);
        }
    },[notifications])

    const fetchAppointment = async (appointmentId: string, notification?: NotificationType) => {
        try {
            const response = await getOneAppointment(appointmentId);
            if (response?.status === "SUCCESS") {
                setAppointment(response?.data || null);
                setIsModalVisible(true);
                if (notification) {
                    await markNotificationRead({ isRead: true } ,notification?.id);
                }
                await fetchNotifications();
            } else {
                Toast.show({
                    type: 'error',
                    text1: response.error,
                    visibilityTime: 3000,
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: error as string ?? "Network error",
                visibilityTime: 3000,
            });
        }
    }

    const onNotificationClick = async (notification: NotificationType) => {
        const appointmentId = notification?.metadata?.appointmentId;
        fetchAppointment(appointmentId, notification);
    }

    const fetchNotifications = async () => {
        try {
            const response = await getAllNotifications(doctorDetails?.phone, "DOCTOR");
            if (response?.status === "SUCCESS") {
                const notifications = response?.data;
                const notificationsToSave: NotificationType[] = notifications?.map((notification: { _id: string, title: string, body: string, image: string, icon: string, metadata: { notificationId: string, category: string }, isRead: boolean, category: string }) => {
                    return {
                        id: notification._id,
                        title: notification.title,
                        body: notification.body,
                        image: notification.image || "",
                        metadata: notification.metadata,
                        isRead: notification.isRead,
                        icon: notification.icon,
                        category: notification.category
                    }
                })
                setNotifications(notificationsToSave);
            } else {
                Toast.show({
                    type: 'error',
                    text1: response.error,
                    visibilityTime: 3000,
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: error as string ?? "Network error",
                visibilityTime: 3000,
            });
        } finally {
            setLoader(false);
        }
    }

    const handleMarkAllRead = async () => {
        setLoader(true);
        try {
            const response = await markReadAllNotifications(doctorDetails?.phone ,"DOCTOR");
            if (response.status === "SUCCESS") {
                Toast.show({
                    type: 'success',  
                    text1: "All notifications marked as read.",
                    visibilityTime: 3000,
                });
                await fetchNotifications();
            } else {
                Toast.show({
                    type: 'error',  
                    text1: response?.error,
                    visibilityTime: 3000,
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',  
                text1: error as string ?? "Something went wrong.",
                visibilityTime: 3000,
            });
        } finally {
            setLoader(false);
        }
    }

    const handleStatusUpdate = (status: string, appointmentId: string) => {
        if(status === "CANCEL") {
            setCancelReason({ ...cancelReason, appointmentId: appointmentId });
            setShowCancelPopUp(true);
        } else {
            setLoader(true)
            setIsModalVisible(false);
            updateAppointment(status, appointmentId)
        }
    }

    const updateAppointment = async (selectedStatus: string, appointmentId: string) => {
        setLoader(true);
        let updateData: any = {
            appointmentUpdateType: selectedStatus,
            updatedBy: "DOCTOR"
        }
        if (selectedStatus === "CANCEL") {
            updateData.reasonForCancel = cancelReason?.value;
        }
        const url = URLS.BASE + URLS.UPDATE_APPOINTMENTS + "?id=" + appointmentId;
        const authToken = await getSecureKey("userAuthtoken");
        try {
            const response = await axios.post(url, updateData,
              {
                headers: {
                  'X-Requested-With': 'nirvaanhealth_web_app',
                  "Authorization": `Bearer ${authToken}`
                },
              }
            );
            const { data, status } = response;
            if (status === 201){
                setIsModalVisible(false);
                setShowCancelPopUp(false);
                Toast.show({
                    type: 'success',  
                    text1: `Appointment has been ${selectedStatus === "CANCEL" ? "cancelled" : "accepted"}`,
                    visibilityTime: 3000,
                });
            } else {
                Toast.show({
                    type: 'error',  
                    text1: "Something wrong happened! Please try again.",
                    visibilityTime: 3000,
                });
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',  
                text1: error.response.data.message,
                visibilityTime: 3000,
            });
        } finally {
            setLoader(false);
        }
    }

     const handleCancelReason = (value: string, id: string) => {
        setCancelReason({ ...cancelReason, value: value, isError: value === "" });
    }

    return (
        <ThemedView style={[styles.container, { height: height }]} >
            <TouchableOpacity 
                style={{ display: "flex", alignItems: "flex-end", paddingVertical: 4 }}  
                onPress={handleMarkAllRead}
                activeOpacity={0.7}
                disabled={!isUnReadNotificationExist}
            >
                <ThemedText style={{ fontSize: 14, fontWeight: isUnReadNotificationExist ? 600 : 400, color: isUnReadNotificationExist ? "#009688" : "#bcf5efff", lineHeight: 16 }}> {loader ? "..." : finalText("Mark all as read", translations, selectedLanguage)} </ThemedText>
            </TouchableOpacity>
            {loader ? 
                <Loader /> 
            : 
                <View style={{ height: height }} > 
                    {notifications?.length > 0 ?
                        <ScrollView
                            ref={scrollViewRef} 
                            showsVerticalScrollIndicator={false}
                            style={{ marginTop: 20 }}
                        >
                            {notifications.map((item, index) => (
                                    <EachNotification
                                        key={item.id || index.toString()}
                                        notification={item}
                                        onPress={() => onNotificationClick(item)}
                                    />
                                ))
                            }
                            <ThemedView style={styles.bottomSpace} ></ThemedView>
                        </ScrollView>
                    :
                        <ThemedText style={{ fontSize: 16, lineHeight: 20, fontWeight: 400 }} >{finalText("No notifications", translations, selectedLanguage)}</ThemedText>
                    }
                </View>
            }
            <CustomPopUp visible={isModalVisible} onClose={() => setIsModalVisible(false)}>
                {appointment ? <AppointmentCard handleStatusUpdate={handleStatusUpdate} width={width} appointment={appointment} source="notification" />
                    : null
                }
            </CustomPopUp>
            {showCancelPopUp &&
                <AppointmentCancelPopUp showCancelPopUp={showCancelPopUp} setShowCancelPopUp={setShowCancelPopUp} width={width} cancelReason={cancelReason} handleCancelReason={handleCancelReason} updateAppointment={updateAppointment} />
            }
        </ThemedView>
    )
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        paddingBottom: 40,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 100,
    },
    // scrollContainer: {
    //     flex: 1,
    // },
    content: {
        paddingBottom: 16,
    },
    bottomSpace: {
        height: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    closeButton: {
        marginTop: 12,
        backgroundColor: '#009688',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
});

export default Notifications;