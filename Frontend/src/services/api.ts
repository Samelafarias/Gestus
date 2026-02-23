import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.config({
  // Substitua pelo seu IP se estiver no celular físico
  baseURL: 'http://192.168.2.53:3000', // colocar o ip que esta rodando no seu celular
});

// Interceptor para injetar o Token JWT em todas as requisições automaticamente
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('@Gestus:token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Erro ao recuperar token", error);
  }
  return config;
});

export default api;