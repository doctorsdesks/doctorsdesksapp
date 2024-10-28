import { AppProvider } from '@/context/AppContext';
import { TranslationProvider } from '@/context/LanguageContext';
import { Slot } from 'expo-router';// Adjust the path to your context file
import Toast from 'react-native-toast-message';

export default function Layout() {
  return (
    <AppProvider>
      <TranslationProvider>
        <Slot />
        <Toast />
      </TranslationProvider>
    </AppProvider>
  );
}
