import { create } from 'zustand';
import { getRequest } from '../server/methods';
import { ENDPOINTS } from '../server/endpoint';
import { FileItem } from './fileStore';

interface TrashState {
    trashedFiles: FileItem[];
    isLoading: boolean;
    error: string | null;

    fetchTrash: () => Promise<void>;
    restoreFile: (fileId: string) => Promise<void>;
    permanentDeleteFile: (fileId: string) => Promise<void>;
}

export const useTrashStore = create<TrashState>((set) => ({
    trashedFiles: [],
    isLoading: false,
    error: null,

    fetchTrash: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await getRequest(ENDPOINTS.files.trash);
            set({ trashedFiles: response as unknown as FileItem[], isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false, trashedFiles: [] });
        }
    },

    restoreFile: async (fileId: string) => {
        try {
            const { patchRequest } = await import('../server/methods');
            await patchRequest(ENDPOINTS.files.restore(fileId));
            set((state) => ({
                trashedFiles: state.trashedFiles.filter((f) => f.id !== fileId)
            }));
        } catch (error: any) {
            console.error("Failed to restore file:", error);
            throw error;
        }
    },

    permanentDeleteFile: async (fileId: string) => {
        try {
            const { deleteRequest } = await import('../server/methods');
            await deleteRequest(ENDPOINTS.files.permanentDelete(fileId));
            set((state) => ({
                trashedFiles: state.trashedFiles.filter((f) => f.id !== fileId)
            }));
        } catch (error: any) {
            console.error("Failed to permanent delete file:", error);
            throw error;
        }
    }
}));
