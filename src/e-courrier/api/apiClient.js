
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8090/e-courrier';

// Instance axios centralisée
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('e-courrier-access-token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('e-courrier-access-token');
            localStorage.removeItem('e-courrier-refresh-token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;