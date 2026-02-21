import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { API_BASE_URL } from "./endpoint";

const BASE_URL = API_BASE_URL;
if (!BASE_URL) {
    throw new Error('BASE_URL is not defined. Check your configuration.');
}

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get("token");
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Adjusted per standard Bearer syntax for your backend
        }
        return config;
    },
    (error) => {
        return Promise.reject(new Error(error));
    },
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove('token');
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    },
);

export const getRequest = async (url: string, requestParams: { params?: Record<string, any> } | Record<string, any> = {}) => {
    try {
        const params = 'params' in requestParams ? requestParams.params : requestParams;
        const response = await axiosInstance.get(url, { params });
        return response?.data ?? response;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Error fetching data';
        toast('Error', {
            description: errorMessage
        });
        throw new Error(errorMessage);
    }
}

export const postRequest = async (url: string, data?: any) => {
    try {
        const response = await axiosInstance.post(url, data);
        return response?.data ?? response;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Error executing request';
        toast('Error', {
            description: errorMessage
        });
        throw new Error(errorMessage);
    }
}

export const putRequest = async (url: string, data?: any) => {
    try {
        const response = await axiosInstance.put(url, data);
        return response?.data ?? response;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Error executing request';
        toast('Error', {
            description: errorMessage
        });
        throw new Error(errorMessage);
    }
}

export const patchRequest = async (url: string, data?: any) => {
    try {
        const response = await axiosInstance.patch(url, data);
        return response?.data ?? response;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Error executing request';
        toast('Error', {
            description: errorMessage
        });
        throw new Error(errorMessage);
    }
}

export const deleteRequest = async (url: string, requestParams: { params?: Record<string, any> } | Record<string, any> = {}) => {
    try {
        const params = 'params' in requestParams ? requestParams.params : requestParams;
        const response = await axiosInstance.delete(url, { params });
        return response?.data ?? response;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Error deleting data';
        toast('Error', {
            description: errorMessage
        });
        throw new Error(errorMessage);
    }
}
