import { create } from 'zustand';
import { getRequest } from '../server/methods';
import { ENDPOINTS } from '../server/endpoint';
import { FileItem, useFileStore } from './fileStore';

interface StarredState {
    starredFiles: FileItem[];
    isLoading: boolean;
    error: string | null;

    fetchStarredFiles: () => Promise<void>;
    toggleStar: (fileId: string, isStarred: boolean) => Promise<void>;
}

export const useStarredStore = create<StarredState>((set) => ({
    starredFiles: [],
    isLoading: false,
    error: null,

    fetchStarredFiles: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await getRequest(ENDPOINTS.files.starred);
            set({ starredFiles: response as unknown as FileItem[], isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false, starredFiles: [] });
        }
    },

    toggleStar: async (fileId: string, isStarred: boolean) => {
        try {
            const { patchRequest } = await import('../server/methods');
            await patchRequest(ENDPOINTS.files.toggleStar(fileId), { is_starred: isStarred });

            // If we are unstarring, remove it from the list immediately
            if (!isStarred) {
                set((state) => ({
                    starredFiles: state.starredFiles.filter((f) => f.id !== fileId)
                }));
            } else {
                // If we are staring (which shouldn't happen from the starred page typically, but just in case)
                set((state) => ({
                    starredFiles: state.starredFiles.map(f => f.id === fileId ? { ...f, is_starred: isStarred } : f)
                }));
            }

            // Also update the global file store so other views reflect the change instantly
            const fileStore = useFileStore.getState();
            useFileStore.setState({
                files: fileStore.files.map(f => f.id === fileId ? { ...f, is_starred: isStarred } : f)
            });

        } catch (error: any) {
            console.error("Failed to toggle star:", error);
            throw error;
        }
    }
}));
