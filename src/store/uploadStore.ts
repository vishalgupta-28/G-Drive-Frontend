import { create } from 'zustand';

export type UploadStatus = 'uploading' | 'completed' | 'error';

export interface UploadItem {
    id: string; // usually fileId or a temp generated ID
    name: string;
    progress: number; // 0 to 100
    status: UploadStatus;
    type?: string;
}

interface UploadState {
    uploads: UploadItem[];
    isOpen: boolean;
    isMinimized: boolean;

    // Actions
    addUpload: (upload: UploadItem) => void;
    updateProgress: (id: string, progress: number) => void;
    updateStatus: (id: string, status: UploadStatus) => void;
    removeUpload: (id: string) => void;
    clearCompleted: () => void;

    // UI Actions
    setIsOpen: (isOpen: boolean) => void;
    setIsMinimized: (isMinimized: boolean) => void;
    toggleMinimized: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
    uploads: [],
    isOpen: false,
    isMinimized: false,

    addUpload: (upload) => set((state) => ({
        uploads: [...state.uploads, upload],
        isOpen: true, // Auto-open the dialog when a new upload starts
        isMinimized: false
    })),

    updateProgress: (id, progress) => set((state) => ({
        uploads: state.uploads.map((item) =>
            item.id === id ? { ...item, progress } : item
        )
    })),

    updateStatus: (id, status) => set((state) => ({
        uploads: state.uploads.map((item) =>
            item.id === id ? { ...item, status, progress: status === 'completed' ? 100 : item.progress } : item
        )
    })),

    removeUpload: (id) => set((state) => {
        const remaining = state.uploads.filter((item) => item.id !== id);
        return {
            uploads: remaining,
            isOpen: remaining.length > 0 ? state.isOpen : false // Auto-close if empty
        };
    }),

    clearCompleted: () => set((state) => {
        const remaining = state.uploads.filter((item) => item.status !== 'completed');
        return {
            uploads: remaining,
            isOpen: remaining.length > 0 ? state.isOpen : false
        };
    }),

    setIsOpen: (isOpen) => set({ isOpen }),
    setIsMinimized: (isMinimized) => set({ isMinimized }),
    toggleMinimized: () => set((state) => ({ isMinimized: !state.isMinimized }))
}));
