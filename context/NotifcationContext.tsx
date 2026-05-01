import { getDeviceId, registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import * as Notifications from "expo-notifications";
import { Subscription } from "expo-notifications";
import {
  createContext,
  ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
import { deleteToken, markNotificationRead, pushToken, saveSecureKey } from "@/components/Utils";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import InAppFloatingBanner from "@/components/InAppFloatingBanner";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

Notifications.setNotificationCategoryAsync("GENERAL_ACTIONS", [
    {
        identifier: "ACCEPT",
        buttonTitle: "Accept",
        options: { opensAppToForeground: false },
    },
    {
        identifier: "OPEN",
        buttonTitle: "Open",
        options: { opensAppToForeground: true },
    },
]);

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
  initializeNotifications: (userId: string, auth: string) => Promise<void>;
  cleanupNotifications: (payload: { userId: string, deviceId: string }) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const notificationListener = useRef<Subscription | null>(null);
  const responseListener = useRef<Subscription | null>(null);
  const [inAppData, setInAppData] = useState<any>(null);

  const updateNotification = async (notificationId: string) => {
    const payload = {
        isRead: true
    }
    await markNotificationRead(payload, notificationId);
  }

  // ✅ Called only after successful login
  const initializeNotifications = async (userId: string, auth: string) => {
    try {
      console.log("Registering for push notifications...");
      const token = await registerForPushNotificationsAsync();
      if (!token) throw new Error("Failed to get Expo Push Token");
      setExpoPushToken(token);
      saveSecureKey("pushToken", token);

      const deviceId = await getDeviceId();
      saveSecureKey("deviceId", deviceId);

      const payload = {
        userId,
        deviceId,
        pushToken: token,
      }

      // ✅ Send token to backend
      const response = await pushToken(payload, auth);
      if (response.status !== "SUCCESS") {
        Toast.show({
          type: 'error',  
          text1: response.error,
          visibilityTime: 3000,
        });
      }

      console.log("Push token registered successfully with backend.");

      // ✅ Register listeners
      notificationListener.current =
        Notifications.addNotificationReceivedListener(async (notification) => {
          console.log("Notification received in foreground:");

          setNotification(notification);

          const title = notification.request.content.title || "New Notification";
          const body = notification.request.content.body || "";
          const data = notification.request.content.data as any;

          const notificationId = data?.notificationId;
          if (notificationId) {
            updateNotification(notificationId);
          }

          // ✅ 1. Show IN-APP notification
          setInAppData({
            title,
            body,
            data
          });

        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(
            "User interacted with notification:",
            JSON.stringify(response, null, 2)
          );

          const action = response.actionIdentifier;
          const data = response.notification.request.content.data as any;
          const notificationId = response.notification.request.content.data?.notificationId
          updateNotification(notificationId);
          if (action) {
            if (action === "ACCEPT") {
              const appointmentId = data.appointmentId;
              
            } else if (action === "OPEN") {
              if (data?.category === "APPOINTMENT") {
                router.replace({
                  pathname: "/dashboard/notifications",
                  params: {
                      selectedAppointment: data.appointmentId
                  }
                })
              }
            }
          } else {
            if (data?.category === "APPOINTMENT") {
              router.replace({
                pathname: "/dashboard/notifications",
                params: {
                    selectedAppointment: data.appointmentId
                }
              })
            }
          }
        });
    } catch (err) {
      console.error("Error initializing notifications:", err);
      setError(err as Error);
    }
  };

  // ✅ Called on logout to remove listeners and clean state
  const cleanupNotifications = async (payload: { userId: string, deviceId: string }) => {
    await deleteToken(payload)
    if (notificationListener.current) {
      notificationListener.current.remove();
      notificationListener.current = null;
    }
    if (responseListener.current) {
      responseListener.current.remove();
      responseListener.current = null;
    }
    setExpoPushToken(null);
    setNotification(null);
    console.log("Notification listeners cleaned up.");
  };

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        notification,
        error,
        initializeNotifications,
        cleanupNotifications,
      }}
    >
      {children}
      {inAppData && (
        <InAppFloatingBanner
          title={inAppData.title}
          message={inAppData.body}
          onPress={() => {
            if (inAppData.data?.category === "APPOINTMENT") {
              router.replace({
                pathname: "/dashboard/notifications",
                params: {
                    selectedAppointment: inAppData.data.appointmentId
                }
              })
            }
            setInAppData(null);
          }}
          onClose={() => setInAppData(null)}
        />
      )}
    </NotificationContext.Provider>
  );
};
