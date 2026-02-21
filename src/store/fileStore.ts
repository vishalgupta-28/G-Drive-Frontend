import { create } from 'zustand';
import { getRequest, postRequest, deleteRequest } from '../server/methods';
import { ENDPOINTS } from '../server/endpoint';

export interface FileItem {
    id: string;
    name: string;
    blob_id: string;
    user_id: string;
    folder_id: string | null;
    size: number;
    type: string;
    created_at: string;
    is_starred: boolean;
    thumbnail_url: string | null;
}

interface FileState {
    files: FileItem[];
    isLoading: boolean;
    error: string | null;
    fetchFiles: (folderId?: string | null) => Promise<void>;
    fetchTrash: () => Promise<void>;
    moveToTrash: (fileId: string) => Promise<void>;
    downloadFile: (file: FileItem) => Promise<void>;

    // Preview State
    activePreviewFile: FileItem | null;
    previewUrl: string | null;
    openPreview: (file: FileItem) => Promise<void>;
    closePreview: () => void;

    // Sharing State
    checkShareLink: (fileId: string) => Promise<string | null>;
    generateShareLink: (fileId: string) => Promise<string | null>;
    revokeShareLink: (fileId: string) => Promise<void>;

    // Renaming State
    renameFile: (fileId: string, newName: string) => Promise<void>;

    // Search State
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchFiles: (query: string) => Promise<void>;
}

export const useFileStore = create<FileState>((set) => ({
    files: [],
    isLoading: false,
    error: null,
    searchQuery: '',

    setSearchQuery: (query: string) => set({ searchQuery: query }),

    fetchFiles: async (folderId = null) => {
        set({ isLoading: true, error: null });
        try {
            const query = folderId ? `?folder_id=${folderId}` : '';
            const response = await getRequest(`${ENDPOINTS.files.list}${query}`);
            set({ files: response as unknown as FileItem[], isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false, files: [] });
        }
    },

    fetchTrash: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await getRequest(ENDPOINTS.files.trash);
            set({ files: response as unknown as FileItem[], isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false, files: [] });
        }
    },


    moveToTrash: async (fileId: string) => {
        try {
            const { deleteRequest } = await import('../server/methods');
            await deleteRequest(ENDPOINTS.files.delete(fileId));
            set((state) => ({
                files: state.files.filter((f) => f.id !== fileId)
            }));
        } catch (error: any) {
            console.error("Failed to move to trash:", error);
        }
    },

    activePreviewFile: null,
    previewUrl: null,

    openPreview: async (file: FileItem) => {
        set({ activePreviewFile: file, previewUrl: null }); // Show modal immediately with loading state
        try {
            const response: any = await getRequest(ENDPOINTS.files.get(file.id));
            set({ previewUrl: response.preview_url });
        } catch (error) {
            console.error("Failed to load file preview", error);
        }
    },

    closePreview: () => {
        set({ activePreviewFile: null, previewUrl: null });
    },

    downloadFile: async (file: FileItem) => {
        try {
            // Re-use the existing endpoint to get a fresh presigned URL
            const response: any = await getRequest(ENDPOINTS.files.get(file.id));
            const url = response.download_url;

            // Trigger native browser download
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            a.target = '_blank'; // Fail-safe for cross-origin URLs
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Failed to download file", error);
        }
    },

    generateShareLink: async (fileId: string) => {
        try {
            const data = await postRequest(ENDPOINTS.files.share(fileId));
            return `${window.location.origin}/share/${data.token}`;
        } catch (error) {
            console.error("Failed to share file:", error);
            return null;
        }
    },

    checkShareLink: async (fileId: string) => {
        try {
            const data: any = await getRequest(ENDPOINTS.files.checkShare(fileId));
            return data.isShared ? data.shareUrl : null;
        } catch (error) {
            console.error("Failed to check share status:", error);
            return null;
        }
    },

    revokeShareLink: async (fileId: string) => {
        try {
            await deleteRequest(ENDPOINTS.files.share(fileId));
        } catch (error) {
            console.error("Failed to revoke share:", error);
        }
    },

    renameFile: async (fileId: string, newName: string) => {
        try {
            const { patchRequest } = await import('../server/methods');
            await patchRequest(`${ENDPOINTS.files.rename(fileId)}?newname=${encodeURIComponent(newName)}`);
            set((state) => ({
                files: state.files.map(f => f.id === fileId ? { ...f, name: newName } : f)
            }));
        } catch (error: any) {
            console.error("Failed to rename file:", error);
            throw error; // Let caller handle UI errors
        }
    },

    searchFiles: async (query: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await getRequest(`${ENDPOINTS.files.search}?querystring=${encodeURIComponent(query)}`);
            set({ files: response as unknown as FileItem[], isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false, files: [] });
        }
    }
}));
