import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSubscriptions } from '../context/SubscriptionContext'; 

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
    sectionCard: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    
    // Metas de Gastos
    goalCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#282828',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#3a3a3a',
    },
    goalCategory: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    currencyPrefix: {
        color: '#8B5CF6',
        fontWeight: 'bold',
        marginRight: 5,
        fontSize: 16,
    },
    input: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'right',
        width: 80,
        padding: 0,
    },
    
    // Botões
    saveButton: {
        borderRadius: 25,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 30,
        overflow: 'hidden',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    resetButton: {
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 50,
    },
    resetButtonText: {
        color: '#FF5252',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

const GOALS_KEY = '@Gestus:spendingGoals';
const CATEGORY_OPTIONS = ['Streaming', 'Música', 'Software', 'Educação', 'Outros'];

interface Goal {
    category: string;
    value: number;
    valueInput: string;
}

const DefinirMetasPage: React.FC = () => {
    const { subscriptions } = useSubscriptions();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadGoals = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(GOALS_KEY);
            const loadedGoals = jsonValue != null ? JSON.parse(jsonValue) : [];
            
            const initialGoals = CATEGORY_OPTIONS.map(category => {
                const existing = loadedGoals.find((g: { category: string; }) => g.category === category);
                const value = existing ? existing.value : 0;
                return {
                    category,
                    value,
                    valueInput: value.toFixed(2).replace('.', ','),
                };
            });
            setGoals(initialGoals);
        } catch (e) {
            console.error("Erro ao carregar metas:", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadGoals();
    }, []);

    const handleGoalChange = (category: string, value: string) => {
        const cleanValue = value.replace(/[^0-9,]/g, '');
        const numericValue = Number(cleanValue.replace(',', '.'));

        setGoals(prev => prev.map(goal => 
            goal.category === category 
            ? { ...goal, value: numericValue, valueInput: cleanValue }
            : goal
        ));
    };

    const handleSaveGoals = async () => {
        const validGoals = goals.map(g => ({ category: g.category, value: g.value }));
        try {
            const jsonValue = JSON.stringify(validGoals);
            await AsyncStorage.setItem(GOALS_KEY, jsonValue);
            Alert.alert('Sucesso', 'Metas de gastos salvas com sucesso!');
        } catch (e) {
            Alert.alert('Erro', 'Não foi possível salvar as metas.');
        }
    };
    
    const handleResetGoals = () => {
         Alert.alert(
            "Confirmar Redefinição",
            "Tem certeza que deseja redefinir todas as metas para R$ 0,00?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Redefinir", 
                    onPress: () => {
                        const resetGoals = CATEGORY_OPTIONS.map(category => ({
                            category,
                            value: 0,
                            valueInput: '0,00',
                        }));
                        setGoals(resetGoals);
                        handleSaveGoals();
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }
    
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Defina o gasto máximo mensal para cada tipo de assinatura</Text>
            </View>

            {goals.map((goal) => (
                <View key={goal.category} style={styles.goalCard}>
                    <Text style={styles.goalCategory}>{goal.category}</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.currencyPrefix}>R$</Text>
                        <TextInput
                            style={styles.input}
                            value={goal.valueInput}
                            onChangeText={(text) => handleGoalChange(goal.category, text)}
                            keyboardType="numeric"
                            placeholder="0,00"
                            placeholderTextColor="#ccc"
                        />
                    </View>
                </View>
            ))}

            <TouchableOpacity onPress={handleSaveGoals}>
                <LinearGradient
                    colors={['#FF9800', '#8B5CF6', '#03A9F4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.saveButton}
                >
                    <Text style={styles.buttonText}>DEFINIR META</Text>
                </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleResetGoals} style={styles.resetButton}>
                <Text style={styles.resetButtonText}>REDEFINIR META</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};



export default DefinirMetasPage;