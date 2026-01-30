export interface LoginResponse {
    message: string;
    data: any
    status: boolean
    error?: string;
    statusCode?: number;
    hasActiveSession?: boolean;
    id_user?: number;
}