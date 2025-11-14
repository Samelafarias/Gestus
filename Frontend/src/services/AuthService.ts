import AsyncStorage from '@react-native-async-storage/async-storage';

// Chaves de armazenamento local
const USER_KEY = '@Gestus:userCredentials';
const LOGGED_IN_KEY = '@Gestus:isLoggedIn';
const RECOVERY_TOKEN_KEY = '@Gestus:recoveryToken'; // Para armazenar o token/código

export interface UserCredentials {
  name: string;
  email: string;
  passwordHash: string;
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

export async function saveUser(user: UserCredentials): Promise<void> {
  try {
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem(USER_KEY, jsonValue);
  } catch (e) {
    console.error("Erro ao salvar usuário:", e);
  }
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

// --- Funções de Recuperação de Senha (API Simulada) ---

/**
 * SIMULAÇÃO DE API: Envia um código de redefinição por e-mail (Token).
 * Em um app real, isso faria um POST para o backend.
 * @param email - E-mail do usuário.
 * @returns O token gerado (simulado).
 */
export async function sendPasswordRecovery(email: string): Promise<{ token: string | null, error: string | null }> {
    const user = await getStoredUser();

    if (!user || user.email !== email) {
        return { token: null, error: "Usuário não encontrado." };
    }

    // SIMULAÇÃO: Gera um token simples de 6 dígitos
    const token = Math.floor(100000 + Math.random() * 900000).toString();

    // Salva o token localmente para verificação posterior
    await AsyncStorage.setItem(RECOVERY_TOKEN_KEY, token);

    // SIMULAÇÃO DE E-MAIL: Exibe o token no console para fins de teste
    console.log(`[API SIMULADA] Token de Recuperação para ${email}: ${token}`);

    return { token, error: null };
}

/**
 * SIMULAÇÃO DE API: Redefine a senha usando o token e a nova senha.
 * @param token - Token de recuperação enviado por e-mail (simulado).
 * @param newPassword - Nova senha.
 */
export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
    const storedToken = await AsyncStorage.getItem(RECOVERY_TOKEN_KEY);
    const user = await getStoredUser();

    if (!user) return false;

    // 1. Verifica se o token está correto
    if (storedToken !== token) {
        throw new Error("Token de recuperação inválido ou expirado.");
    }
    
    // 2. Atualiza a senha
    user.passwordHash = newPassword;
    await saveUser(user);

    // 3. Limpa o token para que não possa ser usado novamente
    await AsyncStorage.removeItem(RECOVERY_TOKEN_KEY);

    return true;
}