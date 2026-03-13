import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext'; // Importação do contexto de tema

interface Props {
    visible: boolean;
    onClose: () => void;
}

export const ModalError: React.FC<Props> = ({ visible, onClose }) => {
    const { theme } = useTheme(); // Consumo do tema atual

    // Estilos dinâmicos baseados no tema
    const dynamicStyles = StyleSheet.create({
        overlay: { 
            flex: 1, 
            backgroundColor: 'rgba(0,0,0,0.7)', // Opacidade levemente reduzida para o modo claro
            justifyContent: 'center', 
            alignItems: 'center' 
        },
        container: { 
            width: '80%', 
            backgroundColor: theme.surface, // Fundo dinâmico (branco ou cinza escuro)
            borderRadius: 20, 
            padding: 30, 
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.border // Borda sutil para definir o card
        },
        title: { 
            color: '#FF5252', // Mantemos o vermelho para erro
            fontSize: 20, 
            fontWeight: 'bold', 
            marginTop: 15 
        },
        description: { 
            color: theme.text, // Texto dinâmico
            textAlign: 'center', 
            marginTop: 10, 
            marginBottom: 20,
            opacity: 0.8
        },
        closeButton: { 
            width: '100%',
            paddingVertical: 15,
            borderRadius: 15, 
            backgroundColor: '#FF5252', // Botão de erro preenchido para melhor visibilidade
            alignItems: 'center',
            justifyContent: 'center',
        },
        closeText: { 
            color: '#fff', 
            fontWeight: 'bold',
        }
    });

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={dynamicStyles.overlay}>
                <View style={dynamicStyles.container}>
                    <Ionicons name="alert-circle-outline" size={80} color="#FF5252" />
                    <Text style={dynamicStyles.title}>Algo deu errado</Text>
                    <Text style={dynamicStyles.description}>
                        Não foi possível processar o registro. Verifique sua conexão e tente novamente.
                    </Text>
                    <TouchableOpacity onPress={onClose} style={dynamicStyles.closeButton}>
                        <Text style={dynamicStyles.closeText}>TENTAR NOVAMENTE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};