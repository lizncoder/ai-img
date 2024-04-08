import axios, { type AxiosRequestConfig } from 'axios';

export const get = (url: string, config?: AxiosRequestConfig) =>
  axios.get(url, config);

export const post = (url: string, data?: any, config?: AxiosRequestConfig) =>
  axios.post(url, data, config);
