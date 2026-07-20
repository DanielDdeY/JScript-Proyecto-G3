import { createAlova } from 'alova';
import GlobalFetch from 'alova/fetch';
import ReactHook from 'alova/react';
import { environment } from '../config/environment';

export const apiAlova = createAlova({
  baseURL: environment.apiBaseUrl,
  statesHook: ReactHook,
  requestAdapter: GlobalFetch(),
  responded: {
    onSuccess: async (response) => {
      if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.status}`);
      }

      if (response.status === 204) {
        return null;
      }

      return response.json();
    },
  },
});

export const httpClient = {
  get<TResponse>(url: string) {
    return apiAlova.Get<TResponse>(url, { cacheFor: 0 }).send();
  },
  post<TResponse, TBody extends object>(url: string, body: TBody) {
    return apiAlova.Post<TResponse>(url, body).send();
  },
  patch<TResponse, TBody extends object>(url: string, body: TBody) {
    return apiAlova.Patch<TResponse>(url, body).send();
  },
  put<TResponse, TBody extends object>(url: string, body: TBody) {
    return apiAlova.Put<TResponse>(url, body).send();
  },
  delete<TResponse>(url: string) {
    return apiAlova.Delete<TResponse>(url).send();
  },
};
