import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const styles = StyleSheet.create({
    overlay: { 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.85)', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    container: { 
        width: '85%', 
        backgroundColor: '#282828', 
        borderRadius: 30, 
        padding: 25, 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#4eefa430' 
    },
    iconCircle: { 
        width: 90, 
        height: 90, 
        borderRadius: 45, 
        backgroundColor: '#8a5cf63d', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 20 
    },
    title: { 
        color: '#fff', 
        fontSize: 22, 
        fontWeight: 'bold', 
        marginBottom: 10 
    },
    description: { 
        color: '#aaa',
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
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 16 
    }
});

interface Props {
    visible: boolean;
    onClose: () => void;
}

export const ModalSuccess: React.FC<Props> = ({ visible, onClose }) => (
    <Modal transparent visible={visible} animationType="slide">
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
                    <LinearGradient colors={['#FF9800', '#8B5CF6', '#03A9F4']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.gradient}>
                        <Text style={styles.buttonText}>ENTENDIDO</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);

