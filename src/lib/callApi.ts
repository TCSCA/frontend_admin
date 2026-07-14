import axios from 'axios';
import { Messages } from "@/lib/messages";
import Cookies from 'js-cookie';

const callApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

callApi.interceptors.request.use(
    (config) => {
        if (shouldUseApiKey(config)) {
            config.headers['x-api-key'] = process.env.NEXT_PUBLIC_API_KEY;
            delete config.headers.Authorization;
            console.log('Usando API Key para:', config.url);
        } else {
            const token = Cookies.get("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        const fullUrl = `${config.baseURL}/${config.url}`;
        console.log('Request interceptor - URL:', fullUrl);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const shouldUseApiKey = (config: any) => {
    const apiKeyEndpoints = [
        '/api/admin/force-logout',
        '/api/admin/login'
    ];

    return apiKeyEndpoints.some(endpoint => config.url?.includes(endpoint));
};

callApi.interceptors.response.use(
    (response) => {
        console.log('Response interceptor:', response.data);
        return response.data;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.log('Error de autenticación: Token inválido o expirado');
            Cookies.remove('token');
            Cookies.remove('idUser');
            Cookies.remove('idProfile');
            if (typeof window !== 'undefined') {
                const loginUrl = process.env.NEXT_PUBLIC_API_BASE_URL_ASSETS 
                    ? `/${process.env.NEXT_PUBLIC_API_BASE_URL_ASSETS}` 
                    : '/';
                if (!window.location.pathname.endsWith(loginUrl) && window.location.pathname !== '/') {
                    window.location.href = loginUrl;
                }
            }
        }

        return Promise.resolve({
            error: error.message,
            status: false,
            message: "Error de conexión con el servidor"
        });
    }
);

const formatApiMessage = (response: any) => {
    return {
        statusCode: response.data.statusCode,
        message: response.data.message,
        error: response.data.error ? response.data.error : "No error",
        data: response.data.data,
        status: response.data.status
    }
}

export default callApi;