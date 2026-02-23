import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import AddButton from '../components/AddButton';
import { useSubscriptions } from '../context/SubscriptionContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useTheme } from '../context/ThemeContext'; // Importando o hook de tema

const GOALS_KEY = '@Gestus:spendingGoals';
const CATEGORY_OPTIONS = ['Streaming', 'Música', 'Software', 'Educação', 'Outros'];
const GOAL_WARNING_THRESHOLD = 0.8; 
const MAX_UPCOMING_PAYMENTS = 3;

interface Goal {
    category: string;
    value: number; 
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const getCategoryIconAndColor = (category: string) => {
    switch (category) {
        case 'Streaming': return { name: 'tv-outline', color: '#03A9F4' };
        case 'Música': return { name: 'musical-notes-outline', color: '#FF9800' };
        case 'Software': return { name: 'code-slash-outline', color: '#8B5CF6' };
        case 'Educação': return { name: 'book-outline', color: '#4eefa4ff' };
        default: return { name: 'cube-outline', color: '#ccc' };
    }
};

const getTimeUntilDueDate = (dueDate: Date): { text: string, color: string } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return { text: "Vence hoje", color: '#FF5252' };
    } else if (diffDays === 1) {
        return { text: "Em 1 dia", color: '#FF9800' };
    } else if (diffDays > 0) {
        return { text: `Em ${diffDays} dias`, color: '#FF9800' };
    } else {
        return { text: "Vencida", color: '#999' };
    }
};

const HomePage = () => {
    const { activeSubscriptions, isLoading: isSubscriptionsLoading } = useSubscriptions();
    const { theme } = useTheme(); // Consumindo o tema atual
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isGoalsLoading, setIsGoalsLoading] = useState(true);

    // Definição dos Estilos Dinâmicos
    const styles = StyleSheet.create({
        mainScreenContainer: {
            flex: 1,
            backgroundColor: theme.background,
        },
        scrollContent: {
            flexGrow: 1,
            backgroundColor: theme.background,
        },
        container: {
            padding: 20,
            backgroundColor: theme.background, 
            flex: 1,
        },
        subtitle: {
            fontSize: 16,
            color: theme.text,
            marginTop: 10,
            textAlign: 'center',
        },
        card: {
            backgroundColor: theme.surface,
            padding: 20,
            borderRadius: 10,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: theme.border,
        },
        cardGasto: {
            padding: 10,
            marginBottom: 20,
            alignItems: 'center', 
        },
        cardTitle: {
            fontSize: 16,
            color: theme.text,
            marginTop: 10,
            marginBottom: 10,
            fontWeight: 'bold',
        },
        cardTitleGasto: { 
            fontSize: 16,
            color: theme.text,
            marginBottom: 20,
            fontWeight: '500',
            marginTop: 5,
        },
        mainValue: {
            fontSize: 34,
            fontWeight: 'bold',
            color: theme.text,
        },
        gradientLine: {
            height: 2,
            width: '100%',
            marginVertical: 10, 
        },
        categoryGoalContainer: {
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        categoryHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5,
        },
        categoryIconText: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        categoryName: {
            fontSize: 16,
            fontWeight: 'bold',
        },
        goalStatus: {
            fontSize: 14,
            fontWeight: 'bold',
        },
        goalAmount: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.text,
            marginBottom: 5,
            textAlign: 'right',
        },
        noGoalText: {
            fontSize: 14,
            color: theme.textSecondary,
            textAlign: 'center',
            marginTop: 10,
            paddingVertical: 10,
        },
        progressBarBackground: {
            height: 10,
            backgroundColor: theme.isDark ? '#444' : '#e0e0e0',
            borderRadius: 5,
            overflow: 'hidden',
            marginTop: 5,
        },
        progressBarFill: {
            height: '100%',
            borderRadius: 5,
        },
        progressText: {
            fontSize: 12,
            color: theme.textSecondary,
            marginTop: 5,
            textAlign: 'right',
        },
        upcomingPaymentRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        upcomingItemLeft: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        upcomingIconWrapper: {
            width: 40,
            height: 40,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 15,
        },
        upcomingName: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.text,
        },
        upcomingValue: {
            fontSize: 14,
            color: theme.textSecondary,
        },
        upcomingDateInfo: {
            alignItems: 'flex-end',
        },
        upcomingStatus: {
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 2,
        },
        upcomingDate: {
            fontSize: 14,
            color: '#FF9800', 
        }
    });

    // Componente Interno ProgressBar adaptado
    const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
        const clampedProgress = Math.min(Math.max(progress, 0), 1);
        const widthPercentage = `${clampedProgress * 100}%`;
        
        let barColor = '#22ed17ff'; 
        if (clampedProgress >= GOAL_WARNING_THRESHOLD) barColor = '#ff5900ff'; 
        if (clampedProgress >= 1) barColor = '#FF5252'; 

        return (
            <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: widthPercentage, backgroundColor: barColor }]} />
            </View>
        );
    };

    useEffect(() => {
        const loadGoals = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem(GOALS_KEY);
                const loadedGoals: Goal[] = jsonValue != null ? JSON.parse(jsonValue) : [];
                
                const initialGoals = CATEGORY_OPTIONS.map(category => {
                    const existing = loadedGoals.find(g => g.category === category);
                    return { category, value: existing ? existing.value : 0 } as Goal;
                });
                setGoals(initialGoals);
            } catch (e) {
                console.error("Erro ao carregar metas:", e);
            } finally {
                setIsGoalsLoading(false);
            }
        };
        loadGoals();
    }, []); 

    const { totalMonthlyExpense, categoriesSummary, upcomingPayments } = useMemo(() => {
        const totalExpense = activeSubscriptions.reduce((sum, sub) => sum + sub.value, 0);
        const expenseMap = activeSubscriptions.reduce((acc, sub) => {
            acc[sub.category] = (acc[sub.category] || 0) + sub.value;
            return acc;
        }, {} as Record<string, number>);

        const summary = CATEGORY_OPTIONS.map(category => {
            const goal = goals.find(g => g.category === category) || { category, value: 0 };
            const expense = expenseMap[category] || 0;
            const progress = goal.value > 0 ? expense / goal.value : 0;
            
            if (goal.value === 0 && expense === 0) return null;

            let statusMessage = "Dentro da meta";
            let statusColor = '#22ed17ff';

            if (goal.value === 0 && expense > 0) {
                statusMessage = "Meta não definida";
                statusColor = theme.textSecondary;
            } else if (expense > goal.value) {
                statusMessage = "ULTRAPASSADA!";
                statusColor = '#FF5252';
            } else if (progress >= GOAL_WARNING_THRESHOLD) {
                statusMessage = "Quase no limite";
                statusColor = '#FF9800';
            }

            return { category, goal: goal.value, expense, progress, statusMessage, statusColor };
        }).filter(item => item !== null); 
        
        const today = new Date();
        const payments = activeSubscriptions
            .filter(sub => sub.firstChargeDate.getTime() >= today.getTime() - (1000 * 60 * 60 * 24)) 
            .sort((a, b) => a.firstChargeDate.getTime() - b.firstChargeDate.getTime())
            .slice(0, MAX_UPCOMING_PAYMENTS);

        return { totalMonthlyExpense: totalExpense, categoriesSummary: summary, upcomingPayments: payments };
    }, [activeSubscriptions, goals, theme]);


    if (isSubscriptionsLoading || isGoalsLoading) {
        return (
            <View style={styles.mainScreenContainer}>
                <View style={styles.container}>
                    <ActivityIndicator size="large" color={theme.text} />
                    <Text style={styles.subtitle}>Carregando Visão Geral...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.mainScreenContainer}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>
                    <View style={styles.cardGasto}>
                        <Text style={styles.mainValue}>{formatCurrency(totalMonthlyExpense)}</Text>
                        <Text style={styles.cardTitleGasto}>Gasto Mensal Total</Text>
                        <LinearGradient
                            colors={['#FCA835', '#0AD1FA']}
                            start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
                            style={styles.gradientLine}
                        />
                    </View>

                    <Text style={styles.cardTitle}>Gastos e Metas por Categoria</Text>
                    <View style={styles.card}>
                        {categoriesSummary.length > 0 ? (
                            categoriesSummary.map((item: any) => {
                                const { color, name: iconName } = getCategoryIconAndColor(item.category);
                                return (
                                    <View key={item.category} style={styles.categoryGoalContainer}>
                                        <View style={styles.categoryHeader}>
                                            <View style={styles.categoryIconText}>
                                                <Ionicons name={iconName} size={18} color={color} style={{ marginRight: 8}} />
                                                <Text style={[styles.categoryName, { color: color }]}>{item.category}</Text>
                                            </View>
                                            <Text style={[styles.goalStatus, { color: item.statusColor }]}>
                                                {item.statusMessage}
                                            </Text>
                                        </View>
                                        
                                        <Text style={styles.goalAmount}>
                                            {formatCurrency(item.expense)} / {formatCurrency(item.goal)}
                                        </Text>
                                        {item.goal > 0 && (
                                            <>
                                                <ProgressBar progress={item.progress} />
                                                <Text style={styles.progressText}>
                                                    {Math.round(item.progress * 100)}% da meta utilizada
                                                </Text>
                                            </>
                                        )}
                                    </View>
                                );
                            })
                        ) : (
                            <Text style={styles.noGoalText}>Cadastre uma assinatura e defina suas metas!</Text>
                        )}
                    </View>

                    <Text style={styles.cardTitle}>Próximos Vencimentos</Text>
                    <View style={styles.card}> 
                        {upcomingPayments.length > 0 ? (
                            upcomingPayments.map(sub => {
                                const { color, name: iconName } = getCategoryIconAndColor(sub.category);
                                const dueDateInfo = getTimeUntilDueDate(sub.firstChargeDate);
                                return (
                                    <TouchableOpacity key={sub.id} style={styles.upcomingPaymentRow}>
                                        <View style={styles.upcomingItemLeft}>
                                            <View style={[styles.upcomingIconWrapper, { backgroundColor: color }]}>
                                                <Ionicons name={iconName} size={20} color={theme.isDark ? "#1e1e1e" : "#fff"} />
                                            </View>
                                            <View>
                                                <Text style={styles.upcomingName}>{sub.name}</Text>
                                                <Text style={styles.upcomingValue}>{formatCurrency(sub.value)}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.upcomingDateInfo}>
                                            <Text style={[styles.upcomingStatus, { color: dueDateInfo.color }]}>{dueDateInfo.text}</Text>
                                            <Text style={styles.upcomingDate}>
                                                {sub.firstChargeDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })
                        ) : (
                            <Text style={styles.noGoalText}>Nenhum pagamento agendado.</Text>
                        )}
                    </View>
                </View>
                <View style={{ height: 100 }} /> 
            </ScrollView>
            <AddButton />
        </View>
    );
};

export default HomePage;