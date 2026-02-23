import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../config/firebaseConfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import AuthService from '../services/AuthService';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
    marginBottom: 60,
  },
  formContainer: {
    flex: 2,
    backgroundColor: '#fff',
    borderTopLeftRadius: 100,
    padding: 30,
  },
  loginTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    color: '#000',
    marginBottom: 5,
  },
  inputWrapper: {
    backgroundColor: '#f7f7f7',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotText: {
    color: '#555',
    fontSize: 13,
  },
  loginButton: {
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerButton: {
    alignItems: 'center',
  },
  registerBorder: {
    borderRadius: 25,
    padding: 2,
  },
  registerInner: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 13,
    paddingHorizontal: 25,
  },
  registerText: {
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
  },
});

export default function LoginPage() {
  const navigation = useNavigation<any>();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert('Campos obrigatórios', 'Preencha o email e a senha.');
    return;
  }

  setLoading(true);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    await AuthService.saveUser({
      email: user.email,
      uid: user.uid,
      name: user.displayName || 'Usuário'
    });
    await AuthService.setLoggedIn(true);

    navigation.navigate('App');

  } catch (error: any) {
    let errorMessage = 'Email ou senha incorretos.';
    
    // Tratamento de erros vindo do Firebase
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'Usuário não encontrado.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Senha incorreta.';
    } else if (error.code === 'auth/app-not-authorized') {
      errorMessage = 'Erro de assinatura SHA-1. Verifique o Console Firebase.';
    }

    Alert.alert('Erro', errorMessage);
    console.error("Firebase Auth Error:", error.code, error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image
            source={require('../../assets/LogoComp.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>Seu Gerenciador de assinaturas</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.loginTitle}>Login</Text>

          <Text style={styles.label}>Email:</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <Text style={styles.label}>Senha:</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Senha"
              placeholderTextColor="#aaa"
              secureTextEntry={!passwordVisible}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons
                name={passwordVisible ? 'eye-off' : 'eye'}
                size={22}
                color="#777"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.forgotButton} 
            disabled={loading}
            onPress={() => navigation.navigate('ResetPassword')}
          >
            <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogin} disabled={loading}>
            <LinearGradient
              colors={loading ? ['#ccc', '#aaa', '#888'] : ['#FF9800', '#8B5CF6', '#03A9F4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loginButton}
            >
              <Text style={styles.loginText}>
                {loading ? 'Carregando...' : 'Login'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}
            disabled={loading}
          >
            <LinearGradient
              colors={['#FF9800', '#8B5CF6', '#03A9F4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.registerBorder}
            >
              <View style={styles.registerInner}>
                <Text style={styles.registerText}>
                   Ainda não tem conta? Crie uma agora
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}