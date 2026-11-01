import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api, clearTokens, saveTokens } from '@/services/api';

type User = { id: string; fullName?: string; name?: string; email: string; phone?: string };
type Auth = { user: User | null; ready: boolean; signIn: (email: string, password: string) => Promise<void>; register: (body: object) => Promise<void>; signOut: () => Promise<void> };
const Context = createContext<Auth | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null); const [ready, setReady] = useState(false);
  const load = async () => { try { if (await SecureStore.getItemAsync('keystone.access')) setUser((await api.get('/auth/me')).data); } catch { await clearTokens(); } finally { setReady(true); } };
  useEffect(() => { load(); }, []);
  const establish = async (res: any) => { const access = res.data.accessToken ?? res.data.tokens?.accessToken; const refresh = res.data.refreshToken ?? res.data.tokens?.refreshToken; if (access && refresh) await saveTokens(access, refresh); setUser(res.data.user ?? (await api.get('/auth/me')).data); };
  return <Context.Provider value={{ user, ready, signIn: async (email, password) => establish(await api.post('/auth/login', { email, password })), register: async (body) => establish(await api.post('/auth/register', { ...body, role: 'CUSTOMER' })), signOut: async () => { try { await api.post('/auth/logout'); } finally { await clearTokens(); setUser(null); } } }}>{children}</Context.Provider>;
}
export const useAuth = () => { const value = useContext(Context); if (!value) throw new Error('AuthProvider is required'); return value; };
