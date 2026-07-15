import EachNotification from '@/components/EachNotification';
import Loader from '@/components/Loader';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { finalText, getAllNotifications, getNotificationCount, markNotificationRead, markReadAllNotifications } from '@/components/Utils';
import { NotificationType } from '@/constants/Enums';
import { useAppContext } from '@/context/AppContext';
import { router } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { BackHandler, Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Toast from "react-native-toast-message";


const Notifications = () => {
    const { notifications, setNotifications, translations, selectedLanguage, hospitalDetails } = useAppContext();
    const { height, width } = Dimensions.get('window');
    const [loader, setLoader] = useState(false);
    const [isUnReadNotificationExist, setIsUnReadNotificationExist] = useState(false);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        const backAction = () => {
            router.replace("/hospitalDashboard");
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        if (notifications && notifications?.length > 0) {
            const count = getNotificationCount(notifications);
            setIsUnReadNotificationExist(count !== 0);
        }
    },[notifications])


    const onNotificationClick = async (notification: NotificationType) => {
        await markNotificationRead({ isRead: true } ,notification?.id);
    }

    const fetchNotifications = async () => {
        try {
            const response = await getAllNotifications(hospitalDetails?.phone, "ADMIN");
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
            const response = await markReadAllNotifications(hospitalDetails?.phone ,"ADMIN");
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
                                        onNotificationClick={() => onNotificationClick(item)}
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