import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export interface UserCredentials {
  name: string;
  email: string;
  uid: string;
}

// --- Funções de Autenticação Real ---

/**
 * Cadastra um novo usuário no Firebase Auth e salva o nome no Firestore.
 */
export async function signUp(name: string, email: string, password: string): Promise<void> {
  const userCredential = await auth().createUserWithEmailAndPassword(email, password);
  
  // Salva o nome e dados adicionais no Firestore associados ao UID do usuário
  await firestore().collection('users').doc(userCredential.user.uid).set({
    name: name,
    email: email,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
}

/**
 * Realiza o login com e-mail e senha.
 */
export async function signIn(email: string, password: string): Promise<void> {
  await auth().signInWithEmailAndPassword(email, password);
}

/**
 * Realiza o logout do usuário.
 */
export async function logout(): Promise<void> {
  await auth().signOut();
}

/**
 * Verifica se existe um usuário logado no momento.
 */
export function getCurrentUser() {
  return auth().currentUser;
}

// --- Funções de Recuperação de Senha Real ---

/**
 * Envia um e-mail oficial do Firebase para redefinição de senha.
 * O Firebase cuida da geração do link e da segurança.
 */
export async function sendPasswordRecovery(email: string): Promise<void> {
  await auth().sendPasswordResetEmail(email);
}

/**
 * Atualiza o perfil do usuário logado (Nome).
 */
export async function updateUserName(newName: string): Promise<void> {
  const user = auth().currentUser;
  if (!user) throw new Error("Usuário não autenticado.");

  // Atualiza no Auth e no Firestore
  await user.updateProfile({ displayName: newName });
  await firestore().collection('users').doc(user.uid).update({ name: newName });
}