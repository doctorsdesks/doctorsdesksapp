import { AppProvider } from '@/context/AppContext';
import { Slot } from 'expo-router';// Adjust the path to your context file
import { Pressable } from 'react-native';
import Toast, { BaseToast } from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function Layout() {
  const colorScheme = useColorScheme() || 'light';
  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: Colors[colorScheme].successBorder, backgroundColor: Colors[colorScheme].successBackground }}
        contentContainerStyle={{ paddingHorizontal: 15, flexDirection: "row", alignItems: "center" }} // Center vertically
        text1Style={{ fontSize: 16, fontWeight: "600" }}
        text2Style={{ fontSize: 14 }}
        renderTrailingIcon={() => (
          <Pressable onPress={() => Toast.hide()} style={{ justifyContent: "center", alignItems: "center", padding: 10 }}>
            <Ionicons name='close-circle-outline' size={20} color={Colors[colorScheme].successBorder} />
          </Pressable>
        )}
      />
    ),
    error: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: Colors[colorScheme].errorBorder, backgroundColor: Colors[colorScheme].errorBackground }}
        contentContainerStyle={{ paddingHorizontal: 15, flexDirection: "row", alignItems: "center" }} // Center vertically
        text1Style={{ fontSize: 16, fontWeight: "600" }}
        text2Style={{ fontSize: 14 }}
        renderTrailingIcon={() => (
          <Pressable onPress={() => Toast.hide()} style={{ justifyContent: "center", alignItems: "center", padding: 10 }}>
            <Ionicons name='close-circle-outline' size={20} color={Colors[colorScheme].errorBorder} />
          </Pressable>
        )}
      />
    ),
  };
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppProvider>
        <Slot />
        <Toast config={toastConfig} />
      </AppProvider>
    </ThemeProvider>
  );
}
