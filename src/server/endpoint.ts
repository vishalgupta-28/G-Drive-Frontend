const getBaseUrl = () => {
    // If the URL from env doesn't include /api, append it because the backend mounts routes on /api
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return url.endsWith('/api') ? url : `${url}/api`;
};

export const API_BASE_URL = getBaseUrl();

export const ENDPOINTS = {
    auth: {
        google: `${API_BASE_URL}/auth/google`,
        googleCallback: `${API_BASE_URL}/auth/google/callback`,
        logout: `${API_BASE_URL}/auth/logout`,
        me: `${API_BASE_URL}/auth/me`,
    },
    uploads: {
        presign: `${API_BASE_URL}/uploads/presign`,
        complete: `${API_BASE_URL}/uploads/complete`,
    },
    files: {
        list: `${API_BASE_URL}/files`,
        trash: `${API_BASE_URL}/files/trash`,
        search: `${API_BASE_URL}/files/search`,
        get: (fileId: string) => `${API_BASE_URL}/files/${fileId}`,
        delete: (fileId: string) => `${API_BASE_URL}/files/${fileId}`,
        restore: (fileId: string) => `${API_BASE_URL}/files/${fileId}/restore`,
        permanentDelete: (fileId: string) => `${API_BASE_URL}/files/${fileId}/permanent`,
        rename: (fileId: string) => `${API_BASE_URL}/files/${fileId}/rename`,
        share: (fileId: string) => `${API_BASE_URL}/files/${fileId}/share`,
        getShared: (token: string) => `${API_BASE_URL}/files/shared/${token}`,
    },
    folders: {
        list: `${API_BASE_URL}/folders`,
        create: `${API_BASE_URL}/folders`,
        delete: (folderId: string) => `${API_BASE_URL}/folders/${folderId}`,
        rename: (folderId: string) => `${API_BASE_URL}/folders/${folderId}`,
    },
    health: `${API_BASE_URL}/health`,
} as const;
