import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Alert,} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as AuthStorage from '../services/AuthStorage'; // Importação do novo serviço

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
    redefinirButton: { 
       borderRadius: 25,
       paddingVertical: 15,
       alignItems: 'center',
       marginTop: 45, 
    },
    redefinirText: { 
       color: '#fff',
       fontWeight: 'bold',
       fontSize: 16,
    },
});

// Define o tipo para os parâmetros de rota, se necessário
interface RedefinirSenhaRouteParams {
    userEmail?: string;
}

export default function RedefinirSenha() {
    const navigation = useNavigation();
    const route = useRoute();
    const { userEmail } = route.params as RedefinirSenhaRouteParams; // Pega o e-mail passado

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const handleRedefinirSenha = async () => { // Função agora é assíncrona
       if (!password || !confirmPassword) {
          Alert.alert('Campos Obrigatórios', 'Por favor, preencha a nova senha e a confirmação.');
          return;
       }
       
       if (password.length < 6) { 
        Alert.alert('Senha Fraca', 'A senha deve ter pelo menos 6 caracteres.');
        return;
    }

       if (password !== confirmPassword) {
          Alert.alert('Erro', 'As senhas não coincidem. Por favor, verifique.');
          return;
       }

       // 1. Atualiza a senha no AsyncStorage
       const success = await AuthStorage.updatePassword(password);
       
       if (success) {
            Alert.alert(
                'Sucesso!', 
                'Sua senha foi redefinida com sucesso. Faça login para continuar.',
                [
                   { 
                      text: "Fazer Login", 
                      onPress: () => navigation.navigate('Login') 

                   }
                ]
             );
       } else {
            Alert.alert('Erro', 'Falha ao redefinir a senha. Tente novamente.');
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
            <Text style={styles.loginTitle}>Redefinir Senha</Text>
            <Text style={styles.formSubtitle}>
             Redefina sua nova senha. (Conta: {userEmail || 'Desconhecida'})
            </Text>

            <Text style={styles.label}>Nova Senha:</Text>
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
            
            <TouchableOpacity onPress={handleRedefinirSenha}>
             <LinearGradient
              colors={['#FF9800', '#8B5CF6', '#03A9F4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.redefinirButton}
             >
              <Text style={styles.redefinirText}>Redefinir</Text>
             </LinearGradient>
            </TouchableOpacity>
          </View>
          </ScrollView>
       </KeyboardAvoidingView>
    );
}