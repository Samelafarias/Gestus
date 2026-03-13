import React, { useMemo } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext'; // Importe o contexto de tema

interface Props {
    visible: boolean;
    onClose: () => void;
}

export const ModalSuccess: React.FC<Props> = ({ visible, onClose }) => {
    const { theme } = useTheme(); // Consome o tema atual

    // Memoiza os estilos para reagir à mudança de tema
    const styles = useMemo(() => StyleSheet.create({
        overlay: { 
            flex: 1, 
            backgroundColor: 'rgba(0,0,0,0.6)', // Escurece o fundo levemente
            justifyContent: 'center', 
            alignItems: 'center' 
        },
        container: { 
            width: '85%', 
            backgroundColor: theme.surface, // Dinâmico (branco no claro, cinza no escuro)
            borderRadius: 30, 
            padding: 25, 
            alignItems: 'center', 
            borderWidth: 1, 
            borderColor: theme.border 
        },
        iconCircle: { 
            width: 90, 
            height: 90, 
            borderRadius: 45, 
            backgroundColor: theme.isDark ? '#8a5cf63d' : '#8a5cf61a', // Ajuste de opacidade do roxo
            justifyContent: 'center', 
            alignItems: 'center', 
            marginBottom: 20 
        },
        title: { 
            color: theme.text, // Dinâmico
            fontSize: 22, 
            fontWeight: 'bold', 
            marginBottom: 10 
        },
        description: { 
            color: theme.text, // Dinâmico
            opacity: 0.7,
            textAlign: 'center', 
            fontSize: 16, 
            marginBottom: 25, 
            lineHeight: 22 
        },
        button: { 
            width: '100%', 
            height: 55 
        },
        gradient: { 
            flex: 1, 
            borderRadius: 15, 
            justifyContent: 'center', 
            alignItems: 'center' 
        },
        buttonText: { 
            color: '#fff', // Texto do botão sempre branco para legibilidade no gradiente
            fontWeight: 'bold', 
            fontSize: 16 
        }
    }), [theme]);

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="checkmark-sharp" size={50} color="#8B5CF6" />
                    </View>
                    <Text style={styles.title}>Pagamento Registrado!</Text>
                    <Text style={styles.description}>
                        Sua assinatura foi atualizada com sucesso para o próximo período.
                    </Text>
                    <TouchableOpacity onPress={onClose} style={styles.button}>
                        <LinearGradient 
                            colors={['#FF9800', '#8B5CF6', '#03A9F4']} 
                            start={{x:0, y:0}} 
                            end={{x:1, y:0}} 
                            style={styles.gradient}
                        >
                            <Text style={styles.buttonText}>ENTENDIDO</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};