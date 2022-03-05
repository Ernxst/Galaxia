import { StringAnyMap } from "@/@types/app/maps";
import { BASE_URL, RESPONSE_TIMEOUT } from "@/services/api.constants";
import { getTokenFromStorage } from "@/services/jwt.service";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from "axios";


export interface GenericApiErrorResponse {
  error: string;
}

export interface UnprocessableEntityErrorResponse {
  errors: { [key: string]: string[] };
  status: string;
}

export type ApiErrorResponse = GenericApiErrorResponse | UnprocessableEntityErrorResponse;

interface fnParams {
  endpoint: string;
  method: Method;
  params?: StringAnyMap;
  body?: any;
  auth?: boolean;
}

export abstract class AbstractApiService {
  protected readonly api: AxiosInstance;

  protected constructor(path: String = "") {
    this.api = axios.create({
      baseURL: BASE_URL + "/" + path,
      timeout: RESPONSE_TIMEOUT,
    });
    this.api.defaults.headers.common["Accept"] = "application/json";
    this.api.defaults.headers.common["Content-Type"] = "application/json;charset=UTF-8";
  }

  protected makeRequest<Success, Failure>({
    endpoint, method, params = {},
    body = {}, auth = true,
  }: fnParams): Promise<Success | Failure | GenericApiErrorResponse> {
    const config: AxiosRequestConfig = {
      headers: {},
      method: method,
      url: endpoint,
      params: params,
      data: body,
    };
    if (auth) config.headers['Authorization'] = `Bearer ${getTokenFromStorage()}`;
    return this.api.request(config)
      .then((response: AxiosResponse<Success>) => (this.handleResponse(response)))
      .catch((error: AxiosError<Failure>) => (this.handleError(error)));
  }

  protected handleResponse<T>(response: AxiosResponse<T>): T {
    return response.data;
  }

  protected handleError<T>(error: AxiosError<T>): T | GenericApiErrorResponse {
    if (error.response) return error.response.data;
    console.error(error);
    return { error: "A network error occurred. Please try again." };
  }
}
