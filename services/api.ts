import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://keystone-mj7m.onrender.com/api/v1';
export const api = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } });
let refreshTask: Promise<string | null> | null = null;
const tokens = { access: 'keystone.access', refresh: 'keystone.refresh' };
export async function saveTokens(accessToken: string, refreshToken: string) { await SecureStore.setItemAsync(tokens.access, accessToken); await SecureStore.setItemAsync(tokens.refresh, refreshToken); }
export async function clearTokens() { await SecureStore.deleteItemAsync(tokens.access); await SecureStore.deleteItemAsync(tokens.refresh); }
export async function accessToken() { return SecureStore.getItemAsync(tokens.access); }
api.interceptors.request.use(async (config) => { const token = await accessToken(); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
async function refresh() { if (!refreshTask) refreshTask = (async () => { try { const refreshToken = await SecureStore.getItemAsync(tokens.refresh); if (!refreshToken) return null; const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken }); const access = data.accessToken ?? data.tokens?.accessToken; const nextRefresh = data.refreshToken ?? data.tokens?.refreshToken ?? refreshToken; if (!access) return null; await saveTokens(access, nextRefresh); return access; } catch { await clearTokens(); return null; } finally { refreshTask = null; } })(); return refreshTask; }
api.interceptors.response.use((r) => r, async (error: AxiosError) => { const request = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined; if (error.response?.status === 401 && request && !request._retried && !request.url?.includes('/auth/refresh')) { request._retried = true; const token = await refresh(); if (token) { request.headers.Authorization = `Bearer ${token}`; return api(request); } } return Promise.reject(error); });
export function friendlyError(error: unknown) { const e = error as AxiosError<{ message?: string }>; return e.response?.data?.message || (e.response?.status === 403 ? 'You do not have access to this action.' : 'Something went wrong. Please try again.'); }
