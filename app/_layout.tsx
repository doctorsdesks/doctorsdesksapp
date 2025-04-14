import { AppProvider } from '@/context/AppContext';
import { Slot } from 'expo-router';
import { Pressable, View } from 'react-native';
import Toast, { BaseToast } from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useCallback, useEffect, useState } from 'react';
import AnimatedSplash from '@/components/AnimatedSplash';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const colorScheme = useColorScheme() || 'light';
  const [isReady, setIsReady] = useState(false);
  const [isSplashAnimationComplete, setIsSplashAnimationComplete] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: Colors[colorScheme].successBorder, backgroundColor: Colors[colorScheme].successBackground }}
        contentContainerStyle={{ paddingHorizontal: 15, flexDirection: "row", alignItems: "center" }}
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
        contentContainerStyle={{ paddingHorizontal: 15, flexDirection: "row", alignItems: "center" }}
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

  if (!isReady) {
    return null;
  }

  if (!isSplashAnimationComplete) {
    return (
      <AnimatedSplash
        onAnimationComplete={() => setIsSplashAnimationComplete(true)}
      />
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppProvider>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <Slot />
        </View>
        <Toast config={toastConfig} />
      </AppProvider>
    </ThemeProvider>
  );
}
