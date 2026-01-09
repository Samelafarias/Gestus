import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function login(email: string, password: string) {
  const response = await api.post('/auth/login', { email, password });
  const { token, user } = response.data;

  // Guarda o token para as próximas sessões
  await AsyncStorage.setItem('@Gestus:token', token);
  await AsyncStorage.setItem('@Gestus:user', JSON.stringify(user));

  return response.data;
}

export async function register(name: string, email: string, password: string) {
  const response = await api.post('/auth/signup', { name, email, password });
  return response.data;
}