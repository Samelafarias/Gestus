import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image,  KeyboardAvoidingView, Platform, ScrollView, Alert,} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

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

  const handleSendCode = () => {
    if (!email) {
      Alert.alert('Campo Obrigatório', 'Por favor, insira seu e-mail para continuar.');
      return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
        Alert.alert('E-mail Inválido', 'Por favor, insira um e-mail válido.');
        return;
    }
    

    Alert.alert(
        'E-mail Enviado', 
        `Se o e-mail '${email}' estiver cadastrado, você receberá um link/código de recuperação.`,
        [
            { 
                text: "OK", 
                onPress: () => navigation.navigate('RedefinirSenha') 
            }
        ]
    );
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
            Receba um código para redefinir sua conta por e-mail.
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
            />
          </View>

          <TouchableOpacity onPress={handleSendCode}>
            <LinearGradient
              colors={['#FF9800', '#8B5CF6', '#03A9F4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sendCodeButton}
            >
              <Text style={styles.sendCodeText}>Enviar Código</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}