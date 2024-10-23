import { AppProvider } from '@/context/AppContext';
import { Slot } from 'expo-router';// Adjust the path to your context file
import Toast from 'react-native-toast-message';

export default function Layout() {
  return (
    <AppProvider>
      <Slot />
      <Toast />
    </AppProvider>
  );
}
