import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth'; // Importação direta do Firebase Auth

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
    marginBottom: 5,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30, 
    paddingHorizontal: 10,
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
    marginBottom: 35,
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
    color: '#777',
  },
  sendCodeButton: { 
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 15, 
    minHeight: 55,
    justifyContent: 'center'
  },
  sendCodeText: { 
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default function ResetPassword() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendResetEmail = async () => { 
    if (!email) {
      Alert.alert('Campo Obrigatório', 'Por favor, insira seu e-mail para continuar.');
      return;
    }
    
    // Validação simples de formato de e-mail
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        Alert.alert('E-mail Inválido', 'Por favor, insira um formato de e-mail válido.');
        return;
    }

    setLoading(true);

    try {
        // Chamada oficial ao Firebase para redefinição de senha
        await auth().sendPasswordResetEmail(email.trim());
        
        Alert.alert(
            'E-mail Enviado', 
            `Um link para redefinir sua senha foi enviado para ${email}. Verifique sua caixa de entrada e spam.`,
            [
                { 
                    text: "OK", 
                    onPress: () => navigation.navigate('Login') 
                }
            ]
        );
    } catch (error: any) {
        console.error(error);
        
        // Tratamento de erros específicos do Firebase
        if (error.code === 'auth/user-not-found') {
            Alert.alert('Erro', 'Não existe nenhum usuário cadastrado com este e-mail.');
        } else if (error.code === 'auth/invalid-email') {
            Alert.alert('Erro', 'O endereço de e-mail é inválido.');
        } else {
            Alert.alert('Erro', 'Ocorreu um erro ao tentar enviar o e-mail de recuperação. Tente novamente mais tarde.');
        }
    } finally {
        setLoading(false);
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
          <Text style={styles.loginTitle}>Recuperar Senha</Text>
          <Text style={styles.formSubtitle}>
            Enviaremos um link seguro para o seu e-mail para que você possa redefinir sua senha.
          </Text>

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
              editable={!loading}
            />
          </View>

          <TouchableOpacity onPress={handleSendResetEmail} disabled={loading}>
            <LinearGradient
              colors={['#FF9800', '#8B5CF6', '#03A9F4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sendCodeButton}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.sendCodeText}>Enviar Link de Recuperação</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}