import AsyncStorage from '@react-native-async-storage/async-storage';

// Chave onde os dados do usuário serão armazenados
const USER_KEY = '@Gestus:userCredentials';
const LOGGED_IN_KEY = '@Gestus:isLoggedIn';

export interface UserCredentials {
  name: string;
  email: string;
  passwordHash: string; 
}

/**
 * Carrega a credencial do usuário cadastrado (Simulação de um único usuário).
 */
export async function getStoredUser(): Promise<UserCredentials | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Erro ao carregar usuário:", e);
    return null;
  }
}

/**
 * Salva as credenciais de um novo usuário (usado no Cadastro).
 */
export async function saveUser(user: UserCredentials): Promise<void> {
  try {
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem(USER_KEY, jsonValue);
  } catch (e) {
    console.error("Erro ao salvar usuário:", e);
  }
}

/**
 * Atualiza a senha do usuário.
 */
export async function updatePassword(newPassword: string): Promise<boolean> {
    try {
        const user = await getStoredUser();
        if (user) {
            user.passwordHash = newPassword; // Atualiza a "hash" (senha pura para simulação)
            await saveUser(user);
            return true;
        }
        return false;
    } catch (e) {
        console.error("Erro ao atualizar senha:", e);
        return false;
    }
}

/**
 * Registra o estado de login.
 */
export async function setLoggedIn(isLoggedIn: boolean): Promise<void> {
    try {
        await AsyncStorage.setItem(LOGGED_IN_KEY, isLoggedIn ? 'true' : 'false');
    } catch (e) {
        console.error("Erro ao salvar status de login:", e);
    }
}

/**
 * Verifica se o usuário está logado.
 */
export async function checkLoggedIn(): Promise<boolean> {
    try {
        const value = await AsyncStorage.getItem(LOGGED_IN_KEY);
        return value === 'true';
    } catch (e) {
        return false;
    }
}

/**
 * Remove os dados do usuário (Simulação de Logout ou remoção total dos dados).
 */
export async function clearUserAndLogout(): Promise<void> {
    try {
        await AsyncStorage.multiRemove([USER_KEY, LOGGED_IN_KEY]);
    } catch (e) {
        console.error("Erro ao fazer logout:", e);
    }
}