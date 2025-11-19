import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AddAssinatura = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.title}>Adicionar Nova Assinatura</Text>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close-circle" size={30} color="#8B5CF6" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                 <Text style={styles.subtitle}>
                    Formulário de Adição de Assinatura
                 </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e', 
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50, 
        paddingBottom: 15,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
    }
});

export default AddAssinatura;