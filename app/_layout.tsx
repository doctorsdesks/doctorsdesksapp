import { AppProvider } from '@/context/AppContext';
import { Slot } from 'expo-router';// Adjust the path to your context file

export default function Layout() {
  return (
    <AppProvider>
      <Slot />
    </AppProvider>
  );
}
