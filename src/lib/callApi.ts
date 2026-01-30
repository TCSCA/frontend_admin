import axios from 'axios';
import { Messages } from "@/lib/messages";
import Cookies from 'js-cookie';

const callApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        // OJO: Esto solo se ejecuta al crear la instancia
        // El token podría no estar disponible aún
        'Authorization': `Bearer ${Cookies.get("token") || ""}`,
    },
});

// Request Interceptor
callApi.interceptors.request.use(
    (config) => {
        const token = Cookies.get("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        const fullUrl = `${config.baseURL}/${config.url}`;
        console.log('Request interceptor - URL:', fullUrl);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
callApi.interceptors.response.use(
    (response) => {
        console.log('Response interceptor:', response.data);
        // response.data = formatApiMessage(response);
        return response.data;
    },
    (error) => {
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