import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/providers/AuthProvider';
export default function Layout() { return <SafeAreaProvider><AuthProvider><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}><Stack.Screen name="index" /><Stack.Screen name="(auth)" /><Stack.Screen name="(onboarding)" /><Stack.Screen name="(tabs)" /></Stack></AuthProvider></SafeAreaProvider>; }
