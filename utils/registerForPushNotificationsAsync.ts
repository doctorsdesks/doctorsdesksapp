import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as Application from "expo-application";
import { Platform } from "react-native";
import uuid from 'react-native-uuid';
import { getSecureKey, saveSecureKey } from "@/components/Utils";

export async function registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            throw new Error(
                "Permission not granted to get push token for push notifications!"
            );
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.easConfig?.projectId;
        if (!projectId) {
            throw new Error("Project ID not found");
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            console.log("Push token generated: ", pushTokenString);
            return pushTokenString;
        } catch (e: unknown) {
            throw new Error(`${e}`);
        }
    } else {
        throw new Error("Must use physical device for push notifications");
    }
}

export const getDeviceId = async (): Promise<string> => {
  // Try from secure store to persist same ID
  let id = await getSecureKey("deviceId");
  if (!id) {
    id =
      Device.osInternalBuildId ||
      Application.applicationId ||
      uuid.v4();
    await saveSecureKey("deviceId", id);
  }
  return id;
};
