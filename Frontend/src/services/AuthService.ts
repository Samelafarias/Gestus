import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function login(email: string, password: string) {
  const response = await api.post('/auth/login', { email, password });
  const { token, user } = response.data;

<<<<<<< Updated upstream
  // Guarda o token para as próximas sessões
  await AsyncStorage.setItem('@Gestus:token', token);
  await AsyncStorage.setItem('@Gestus:user', JSON.stringify(user));

  return response.data;
}

export async function register(name: string, email: string, password: string) {
  const response = await api.post('/auth/signup', { name, email, password });
  return response.data;
}
=======
// ATUALIZADO: Interface agora reflete o que o Firebase nos dá
export interface UserCredentials {
  name: string;
  email: string;
  uid: string; // Adicionado uid para identificar o usuário no Firebase
  passwordHash?: string; // Opcional, já que o Firebase cuida da senha
}

// --- Funções de Leitura e Escrita Local (AsyncStorage) ---

export async function getStoredUser(): Promise<UserCredentials | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Erro ao carregar usuário:", e);
    return null;
  }
}

// ATUALIZADO: Aceita o objeto que você está passando no Login.tsx
export async function saveUser(user: any): Promise<void> {
  try {
    const userData: UserCredentials = {
        name: user.name || 'Usuário',
        email: user.email || '',
        uid: user.uid || '',
    };
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem(USER_KEY, jsonValue);
  } catch (e) {
    console.error("Erro ao salvar usuário:", e);
  }
}

export async function updateUser(updatedData: { name?: string, email?: string, uid?: string }): Promise<void> {
    const existingUser = await getStoredUser();
    if (!existingUser) throw new Error("Nenhum usuário cadastrado.");

    const mergedUser: UserCredentials = {
        name: updatedData.name ?? existingUser.name,
        email: updatedData.email ?? existingUser.email,
        uid: updatedData.uid ?? existingUser.uid,
    };

    await saveUser(mergedUser);
}

export async function setLoggedIn(isLoggedIn: boolean): Promise<void> {
    try {
        await AsyncStorage.setItem(LOGGED_IN_KEY, isLoggedIn ? 'true' : 'false');
    } catch (e) {
        console.error("Erro ao salvar status de login:", e);
    }
}

export async function checkLoggedIn(): Promise<boolean> {
    try {
        const value = await AsyncStorage.getItem(LOGGED_IN_KEY);
        return value === 'true';
    } catch (e) {
        return false;
    }
}

// --- Logout ---
export async function logout(): Promise<void> {
    await AsyncStorage.multiRemove([USER_KEY, LOGGED_IN_KEY]);
}

// Nota: As funções de Recuperação Simulada (sendPasswordRecovery) 
// podem continuar aí se você ainda não configurou o Reset de senha do Firebase.

export default {
    getStoredUser,
    saveUser,
    updateUser,
    setLoggedIn,
    checkLoggedIn,
    logout
};
>>>>>>> Stashed changes
