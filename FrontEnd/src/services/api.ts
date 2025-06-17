import axios from 'axios';
import { LoginCredentials, FilterState } from '../types';

const API_URL = 'http://127.0.0.1:5000';

export const api = {
    login: async (credentials: LoginCredentials) => {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data;
    },

    createUser: async (credentials: LoginCredentials) => {
        const response = await axios.post(`${API_URL}/user`, credentials);
        return response.data;
    },

    importCSV: async (username: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axios.post(`${API_URL}/${username}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getLeads: async (username: string, filters?: FilterState) => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                    params.append(key, value);
                }
            });
        }
        
        const response = await axios.get(`${API_URL}/${username}`, {
            params
        });
        return response.data;
    }
}; 