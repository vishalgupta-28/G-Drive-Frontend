import { create } from 'zustand';
import { getRequest } from '@/server/methods';
import { ENDPOINTS } from '@/server/endpoint';

export interface User {
    id: string;
    email: string;
    name: string;
    profile_image: string | null;
    quota: number;
    used_storage: number;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    error: null,
    fetchUser: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await getRequest(ENDPOINTS.auth.me) as User;
            set({ user: response, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch user profile',
                isLoading: false
            });
        }
    },
}));
