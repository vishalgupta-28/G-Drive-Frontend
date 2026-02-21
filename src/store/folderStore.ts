import { create } from 'zustand';
import { getRequest, postRequest, deleteRequest, patchRequest } from '../server/methods';
import { ENDPOINTS } from '../server/endpoint';

export interface Folder {
    id: string;
    name: string;
    parent_id: string | null;
    user_id: string;
    created_at: string;
    updated_at: string;
}

interface FolderState {
    folders: Folder[];
    currentFolderId: string | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setCurrentFolderId: (id: string | null) => void;
    fetchFolders: (parentId?: string | null) => Promise<void>;
    createFolder: (name: string, parentId?: string | null) => Promise<void>;
    deleteFolder: (id: string) => Promise<void>;
    renameFolder: (id: string, newName: string) => Promise<void>;
}

export const useFolderStore = create<FolderState>((set, get) => ({
    folders: [],
    currentFolderId: null,
    isLoading: false,
    error: null,

    setCurrentFolderId: (id) => set({ currentFolderId: id }),

    fetchFolders: async (parentId = null) => {
        set({ isLoading: true, error: null });
        try {
            const parentQuery = parentId ? `?parent_id=${parentId}` : '';
            const response = await getRequest(`${ENDPOINTS.folders.list}${parentQuery}`);
            // Assuming response is the array of folders based on typical backend structure
            set({ folders: response as unknown as Folder[], isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false, folders: [] });
        }
    },

    createFolder: async (name: string, parentId = null) => {
        try {
            const payload = {
                name,
                ...(parentId && { parent_id: parentId })
            };

            const newFolder = await postRequest(ENDPOINTS.folders.create, payload);

            // Optimitically update the state
            set((state) => ({
                folders: [...state.folders, newFolder as unknown as Folder]
            }));
        } catch (error: any) {
            throw error;
        }
    },

    deleteFolder: async (id: string) => {
        try {
            await deleteRequest(ENDPOINTS.folders.delete(id));

            set((state) => ({
                folders: state.folders.filter(f => f.id !== id)
            }));
        } catch (error: any) {
            throw error;
        }
    },

    renameFolder: async (id: string, newName: string) => {
        try {
            const updatedFolder = await patchRequest(ENDPOINTS.folders.rename(id), { name: newName });

            set((state) => ({
                folders: state.folders.map(f =>
                    f.id === id ? { ...f, name: newName } : f
                )
            }));
        } catch (error: any) {
            throw error;
        }
    }
}));
