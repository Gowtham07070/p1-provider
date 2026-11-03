import { Redirect } from 'expo-router'; import { Loading } from '@/components/common/UI'; import { useAuth } from '@/providers/AuthProvider';
export default function Index() { const { ready, user } = useAuth(); if (!ready) return <Loading />; return <Redirect href={user ? '/(tabs)/dashboard' : '/(auth)/welcome'} />; }
