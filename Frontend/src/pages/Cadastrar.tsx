import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Alert,} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
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
    paddingTop: 50,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 5,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',

  },
  subtitle: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 5,
    marginBottom: 40, 
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
    marginBottom: 30, 
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    color: '#000',
    marginBottom: 5,
    marginLeft: 5, 
  },
  inputWrapper: {
    backgroundColor: '#f7f7f7',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20, 
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
    paddingLeft: 10, 
  },
  icon: {
    marginRight: 10,
    color: '#777',
  },
  
  registerButtonGradient: { 
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20, 
  },
  registerButtonText: { 
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLinkButton: { 
    alignItems: 'center',
    marginBottom: 10,
  },
  loginLinkBorder: { 
    borderRadius: 25,
    padding: 2,
  },
  loginLinkInner: { 
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 13,
    paddingHorizontal: 25,
  },
  loginLinkText: { 
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
  },
});

export default function RegisterPage() { 
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  const [nome, setNome] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
  if (!nome || !email || !password || !confirmPassword) {
    Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos.');
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert('Erro', 'As senhas não coincidem.');
    return;
  }

  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    
    await userCredential.user.updateProfile({
      displayName: nome,
    });

    const user = userCredential.user;

    await AuthService.saveUser({ 
        name: nome, 
        email: email, 
        uid: user.uid 
    });
    await AuthService.setLoggedIn(true);

    Alert.alert('Sucesso', 'Conta criada com sucesso!', [
      { text: 'OK', onPress: () => navigation.navigate('App') } 
    ]);
    
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      Alert.alert('Erro', 'Este e-mail já está em uso.');
    } else if (error.code === 'auth/invalid-email') {
      Alert.alert('Erro', 'O e-mail digitado é inválido.');
    } else {
      Alert.alert('Erro', 'Ocorreu um erro ao tentar cadastrar.');
    }
    console.error(error);
  }
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/LogoComp.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          
          <Text style={styles.subtitle}>Seu Gerenciador de assinaturas</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.loginTitle}>Cadastrar</Text> 
          
          
          <Text style={styles.label}>Nome:</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={22} style={styles.icon} />
            <TextInput
              placeholder="Seu nome"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words" 
            />
          </View>

          <Text style={styles.label}>Email:</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={22} style={styles.icon} />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Senha:</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={22} style={styles.icon} />
            <TextInput
              placeholder="Senha"
              placeholderTextColor="#aaa"
              secureTextEntry={!passwordVisible}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons
                name={passwordVisible ? 'eye-off' : 'eye'}
                size={22}
                color="#777"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirmar Senha:</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={22} style={styles.icon} />
            <TextInput
              placeholder="Confirme sua senha"
              placeholderTextColor="#aaa"
              secureTextEntry={!passwordVisible} 
              style={styles.input}
              value={confirmPassword} 
              onChangeText={setConfirmPassword} 
            />
            
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons
                name={passwordVisible ? 'eye-off' : 'eye'}
                size={22}
                color="#777"
              />
            </TouchableOpacity>
          </View>

          
          <TouchableOpacity onPress={handleRegister}> 
            <LinearGradient
              colors={['#FF9800', '#8B5CF6', '#03A9F4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.registerButtonGradient} 
            >
              <Text style={styles.registerButtonText}>Cadastre-se</Text>
            </LinearGradient>
          </TouchableOpacity>

         
          <TouchableOpacity
            style={styles.loginLinkButton} 
            onPress={() => navigation.navigate('Login')} 
          >
            <LinearGradient
              colors={['#FF9800', '#8B5CF6', '#03A9F4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loginLinkBorder} 
            >
              <View style={styles.loginLinkInner}>
                <Text style={styles.loginLinkText}>
                  Já tem uma conta? Faça o Login
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}