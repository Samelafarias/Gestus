import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const styles = StyleSheet.create({
    overlay: { 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.9)', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    container: { 
        width: '80%', 
        backgroundColor: '#282828', 
        borderRadius: 20, 
        padding: 30, 
        alignItems: 'center' 
    },
    title: { 
        color: '#FF5252', 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginTop: 15 
    },
    description: { 
        color: '#ccc', 
        textAlign: 'center', 
        marginTop: 10, 
        marginBottom: 20 
    },
    closeButton: { 
width: '100%',
        paddingVertical: 15,
        borderRadius: 15, 
        borderWidth: 2,   
        borderColor: '#FFFFFF', 
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        textDecorationLine: 'underline' 
    }
});

interface Props {
    visible: boolean;
    onClose: () => void;
}

export const ModalError: React.FC<Props> = ({ visible, onClose }) => (
    <Modal transparent visible={visible} animationType="fade">
        <View style={styles.overlay}>
            <View style={styles.container}>
                <Ionicons name="alert-circle-outline" size={80} color="#FF5252" />
                <Text style={styles.title}>Algo deu errado</Text>
                <Text style={styles.description}>
                    Não foi possível processar o registro. Verifique sua conexão e tente novamente.
                </Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeText}>TENTAR NOVAMENTE</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);

