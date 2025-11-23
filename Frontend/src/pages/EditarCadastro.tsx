import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as AuthStorage from '../services/AuthService'; 

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#1e1e1e', 
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
    },
    sectionTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        color: '#ccc',
        marginBottom: 5,
        marginTop: 15,
        fontWeight: '600',
    },
    inputWrapper: {
        flexDirection: 'row',
        backgroundColor: '#282828',
        borderRadius: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        height: 50,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#3a3a3a',
    },
    icon: {
        marginRight: 10,
        color: '#8B5CF6',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
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

interface FormData {
    name: string;
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

const EditarCadastroPage = () => {
    const navigation = useNavigation();
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
                <ActivityIndicator size="large" color="#8B5CF6" />
            </View>
        );
    }
    
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.sectionTitle}>Editar Dados de Cadastro</Text>
            
            <Text style={styles.label}>Nome:</Text>
            <View style={styles.inputWrapper}>
                 <Ionicons name="person-outline" size={22} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                    placeholder="Seu nome"
                    placeholderTextColor="#aaa"
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
                    placeholderTextColor="#aaa"
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
                    placeholderTextColor="#aaa"
                    secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                    <Ionicons
                        name={passwordVisible ? 'eye-off' : 'eye'}
                        size={22}
                        color="#777"
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
                    placeholderTextColor="#aaa"
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
                    placeholderTextColor="#aaa"
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