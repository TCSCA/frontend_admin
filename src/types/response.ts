export interface ResponseApi {
  message: string;
  data: any
  status: boolean
  error?: string;
  statusCode?: number;
}