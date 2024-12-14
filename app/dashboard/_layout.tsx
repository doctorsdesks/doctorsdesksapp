import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Tabs } from 'expo-router';
import Icon from '@/components/Icon';
import { Colors } from '@/constants/Colors';

const Tab = createBottomTabNavigator();

export default function Layout() {
    const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={({ route }) => ({ // Get route in screenOptions
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tabsTextSelected,
        headerShown: true,
        headerLeft: () => {
            if (route.name === 'home') {
                return null; // Don't show headerLeft on 'home'
            }
            return (
                <Pressable onPress={() => router.replace('/dashboard')}>
                    <Ionicons style={styles.icon} name="arrow-back" size={24} color="black" />
                </Pressable>
            );
        },
        headerTitleAlign: 'center',
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Icon iconType="home" fill={focused ? Colors[colorScheme ?? 'light'].tabsTextSelected : Colors[colorScheme ?? 'light'].tabsTextDefault} onClick={() => null} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Task',
          tabBarIcon: ({ color, focused }) => (
            <Icon iconType="task" fill={focused ? Colors[colorScheme ?? 'light'].tabsTextSelected : Colors[colorScheme ?? 'light'].tabsTextDefault} onClick={() => null} />
          ),
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Appointment',
          tabBarIcon: ({ color, focused }) => (
            <Icon iconType="appointment" fill={focused ? Colors[colorScheme ?? 'light'].tabsTextSelected : Colors[colorScheme ?? 'light'].tabsTextDefault} onClick={() => null} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Icon iconType="profile" fill={focused ? Colors[colorScheme ?? 'light'].tabsTextSelected : Colors[colorScheme ?? 'light'].tabsTextDefault} onClick={() => null} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
    icon: {
        marginLeft: 12,
    },
});
