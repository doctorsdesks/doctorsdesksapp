import { AppProvider } from '@/context/AppContext';
import { Slot } from 'expo-router';// Adjust the path to your context file
import { Pressable } from 'react-native';
import Toast, { BaseToast } from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: "#2DB9B0", backgroundColor: "#fff" }}
        contentContainerStyle={{ paddingHorizontal: 15, flexDirection: "row", alignItems: "center" }} // Center vertically
        text1Style={{ fontSize: 16, fontWeight: "600" }}
        text2Style={{ fontSize: 14 }}
        renderTrailingIcon={() => (
          <Pressable onPress={() => Toast.hide()} style={{ justifyContent: "center", alignItems: "center", padding: 10 }}>
            <Ionicons name='close-circle-outline' size={20} color="red" />
          </Pressable>
        )}
      />
    ),
  };
  return (
    <AppProvider>
      <Slot />
      <Toast config={toastConfig} />
    </AppProvider>
  );
}
