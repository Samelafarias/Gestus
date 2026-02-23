import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as AuthStorage from '../services/AuthService'; 
import { useTheme } from '../context/ThemeContext'; // 1. Importar o hook de tema

interface FormData {
    name: string;
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

const EditarCadastroPage = () => {
    const navigation = useNavigation();
    const { theme } = useTheme(); // 2. Consumir o tema atual
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    
    const [passwordVisible, setPasswordVisible] = useState(false);

    // 3. Criar os estilos dinâmicos baseados no tema
    const styles = StyleSheet.create({
        container: {
            flexGrow: 1,
            padding: 20,
            backgroundColor: theme.background, 
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.background,
        },
        label: {
            fontSize: 14,
            color: theme.textSecondary,
            marginBottom: 5,
            marginTop: 15,
            fontWeight: '600',
        },
        inputWrapper: {
            flexDirection: 'row',
            backgroundColor: theme.surface,
            borderRadius: 10,
            paddingHorizontal: 15,
            alignItems: 'center',
            height: 50,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: theme.border,
        },
        icon: {
            marginRight: 10,
            color: theme.primary,
        },
        input: {
            flex: 1,
            fontSize: 16,
            color: theme.text,
        },
        saveButton: {
            borderRadius: 25,
            paddingVertical: 15,
            alignItems: 'center',
            marginTop: 30,
            overflow: 'hidden',
        },
        saveButtonText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
        },
    });

    useEffect(() => {
        const loadUserData = async () => {
            const user = await AuthStorage.getStoredUser();
            if (user) {
                setFormData(prev => ({
                    ...prev,
                    name: user.name,
                    email: user.email,
                }));
            }
            setIsLoading(false);
        };
        loadUserData();
    }, []);

    const handleSave = async () => {
        if (isSaving || isLoading) return;

        const storedUser = await AuthStorage.getStoredUser();
        if (!storedUser) {
            Alert.alert('Erro', 'Nenhum usuário encontrado.');
            return;
        }

        // Simulação de verificação de senha (conforme sua lógica original)
        if (formData.currentPassword !== storedUser.passwordHash) {
            Alert.alert('Erro', 'A Senha Atual está incorreta.');
            return;
        }

        let newPasswordHash = storedUser.passwordHash;
        if (formData.newPassword) {
            if (formData.newPassword !== formData.confirmNewPassword) {
                Alert.alert('Erro', 'A Nova Senha e a Confirmação não coincidem.');
                return;
            }
            if (formData.newPassword.length < 6) {
                Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres.');
                return;
            }
            newPasswordHash = formData.newPassword;
        }

        if (!formData.name || !formData.email) {
            Alert.alert('Erro', 'Nome e Email são obrigatórios.');
            return;
        }

        setIsSaving(true);
        try {
            await AuthStorage.updateUser({
                name: formData.name,
                email: formData.email,
                passwordHash: newPasswordHash,
            });

            Alert.alert('Sucesso', 'Dados de cadastro atualizados!');
            navigation.goBack();
            
        } catch (error) {
            Alert.alert('Erro', 'Falha ao salvar as alterações.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }
    
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Nome:</Text>
            <View style={styles.inputWrapper}>
                 <Ionicons name="person-outline" size={22} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                    placeholder="Seu nome"
                    placeholderTextColor={theme.textSecondary}
                />
            </View>

            <Text style={styles.label}>Email:</Text>
            <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={22} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                    placeholder="Email"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <Text style={styles.label}>Senha Atual (Para confirmar alterações):</Text>
            <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={22} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    value={formData.currentPassword}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, currentPassword: text }))}
                    placeholder="Senha Atual"
                    placeholderTextColor={theme.textSecondary}
                    secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                    <Ionicons
                        name={passwordVisible ? 'eye-off' : 'eye'}
                        size={22}
                        color={theme.textSecondary}
                    />
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Nova Senha:</Text>
            <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={22} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    value={formData.newPassword}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, newPassword: text }))}
                    placeholder="Nova Senha"
                    placeholderTextColor={theme.textSecondary}
                    secureTextEntry={!passwordVisible}
                />
            </View>

            <Text style={styles.label}>Confirmar Nova Senha:</Text>
            <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={22} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    value={formData.confirmNewPassword}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, confirmNewPassword: text }))}
                    placeholder="Confirmar Senha"
                    placeholderTextColor={theme.textSecondary}
                    secureTextEntry={!passwordVisible}
                />
            </View>

            <TouchableOpacity onPress={handleSave} disabled={isSaving}>
                <LinearGradient
                    colors={['#FF9800', '#8B5CF6', '#03A9F4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.saveButton}
                >
                    {isSaving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>SALVAR ALTERAÇÕES</Text>
                    )}
                </LinearGradient>
            </TouchableOpacity>

            <View style={{ height: 50 }} />
        </ScrollView>
    );
};

export default EditarCadastroPage;