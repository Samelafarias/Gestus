import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import AddButton from '../components/AddButton';
import { useSubscriptions } from '../context/SubscriptionContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useTheme } from '../context/ThemeContext'; // Importação do Tema

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

    if (diffDays === 0) return { text: "Vence hoje", color: '#FF5252' };
    if (diffDays === 1) return { text: "Em 1 dia", color: '#FF9800' };
    return diffDays > 0 ? { text: `Em ${diffDays} dias`, color: '#FF9800' } : { text: "Vencida", color: '#999' };
};

// Componente de Barra de Progresso Interno
const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
    const clampedProgress = Math.min(Math.max(progress, 0), 1);
    const widthPercentage = `${clampedProgress * 100}%`;
    let barColor = '#22ed17'; 
    if (clampedProgress >= GOAL_WARNING_THRESHOLD) barColor = '#ff5900'; 
    if (clampedProgress >= 1) barColor = '#FF5252'; 

    return (
        <View style={{ height: 10, backgroundColor: '#444', borderRadius: 5, overflow: 'hidden', marginTop: 5 }}>
            <View style={{ height: '100%', borderRadius: 5, width: widthPercentage as any, backgroundColor: barColor }} />
        </View>
    );
};

const HomePage = () => {
    const { theme } = useTheme(); // Consumindo o tema
    const { activeSubscriptions, isLoading: isSubscriptionsLoading } = useSubscriptions();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isGoalsLoading, setIsGoalsLoading] = useState(true);

    // Estilos dinâmicos baseados no tema usando useMemo para performance
    const styles = useMemo(() => StyleSheet.create({
        mainScreenContainer: { 
            flex: 1, 
            backgroundColor: theme.background 
        },
        scrollContent: { 
            flexGrow: 1, 
            backgroundColor: theme.background 
        },
        container: { 
            padding: 20, 
            lex: 1 
        },
        subtitle: { 
            fontSize: 16, 
            color: theme.text, 
            marginTop: 10, 
            textAlign: 'center' 
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
            alignItems: 'center' 
        },
        cardTitle: { 
            fontSize: 16, 
            color: theme.text, 
            marginTop: 10, 
            marginBottom: 10, 
            fontWeight: 'bold' 
        },
        cardTitleGasto: { 
            fontSize: 16, 
            color: theme.text, 
            marginBottom: 20, 
            fontWeight: '500', 
            marginTop: 5 
        },
        mainValue: { 
            fontSize: 34, 
            fontWeight: 'bold', 
            color: theme.text 
        },
        gradientLine: { 
            height: 2, 
            width: '100%', 
            marginVertical: 10 
        },
        categoryGoalContainer: { 
            paddingVertical: 15, 
            borderBottomWidth: 1, 
            borderBottomColor: theme.border 
        },
        categoryHeader: { 
            flexDirection: 'row', 
            justifyContent: 'space-between',
             alignItems: 'center', 
             marginBottom: 5 
            },
        categoryIconText: { 
            flexDirection: 'row',
             alignItems: 'center' 
            },
        categoryName: { 
            fontSize: 16,
             fontWeight: 'bold'
             },
        goalStatus: { 
            fontSize: 14, 
            fontWeight: 'bold' 
        },
        goalAmount: { 
            fontSize: 16, 
            fontWeight: '600', 
            color: theme.text,
             marginBottom: 5, 
             textAlign: 'right' 
            },
        noGoalText: { 
            fontSize: 14, 
            color: theme.text, 
            opacity: 0.6, 
            textAlign: 'center', 
            marginTop: 10, 
            paddingVertical: 10 
        },
        progressText: { 
            fontSize: 12, 
            color: theme.text, 
            opacity: 0.7, 
            marginTop: 5, 
            textAlign: 'right' 
        },
        upcomingPaymentRow: { 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            paddingVertical: 10, 
            borderBottomWidth: 1, 
            borderBottomColor: theme.border 
        },
        upcomingItemLeft: { 
            flexDirection: 'row', 
            alignItems: 'center' 
        },
        upcomingIconWrapper: {
             width: 40, 
             height: 40, 
             borderRadius: 8, 
             justifyContent: 'center', 
             alignItems: 'center', 
             marginRight: 15 
            },
        upcomingName: { 
            fontSize: 16, 
            fontWeight: 'bold', 
            color: theme.text 
        },
        upcomingValue: { 
            fontSize: 14, 
            color: theme.text,
             opacity: 0.8 
            },
        upcomingDateInfo: { 
            alignItems: 'flex-end' 
        },
        upcomingStatus: { 
            fontSize: 14, 
            fontWeight: 'bold',
             marginBottom: 2 
            },
        upcomingDate: { 
            fontSize: 14, 
            color: '#FF9800' 

        }
    }), [theme]);

    useEffect(() => {
        const loadGoals = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem(GOALS_KEY);
                const loadedGoals: Goal[] = jsonValue != null ? JSON.parse(jsonValue) : [];
                const initialGoals = CATEGORY_OPTIONS.map(category => ({
                    category,
                    value: loadedGoals.find(g => g.category === category)?.value || 0,
                }));
                setGoals(initialGoals);
            } catch (e) {
                console.error("Erro ao carregar metas:", e);
            } finally {
                setIsGoalsLoading(false);
            }
        };
        loadGoals();
    }, []); 

    const summaryData = useMemo(() => {
        const totalExpense = activeSubscriptions.reduce((sum, sub) => sum + sub.value, 0);
        const expenseMap = activeSubscriptions.reduce((acc, sub) => {
            acc[sub.category] = (acc[sub.category] || 0) + sub.value;
            return acc;
        }, {} as Record<string, number>);

        const summary = CATEGORY_OPTIONS.map(category => {
            const goal = goals.find(g => g.category === category) || { category, value: 0 };
            const expense = expenseMap[category] || 0;
            const progress = goal.value > 0 ? expense / goal.value : 0;
            
            let statusMessage = "Dentro da meta";
            let statusColor = '#22ed17';

            if (goal.value === 0) {
                if (expense === 0) return null;
                statusMessage = "Meta não definida";
                statusColor = theme.text;
            } else if (expense > goal.value) {
                statusMessage = "ULTAPASSADA!";
                statusColor = '#FF5252';
            } else if (progress >= GOAL_WARNING_THRESHOLD) {
                statusMessage = "Quase no limite";
                statusColor = '#FF9800';
            }

            return { category, goal: goal.value, expense, progress, statusMessage, statusColor };
        }).filter(item => item !== null);

        const payments = [...activeSubscriptions]
            .sort((a, b) => a.firstChargeDate.getTime() - b.firstChargeDate.getTime())
            .slice(0, MAX_UPCOMING_PAYMENTS);

        return { totalMonthlyExpense: totalExpense, categoriesSummary: summary, upcomingPayments: payments };
    }, [activeSubscriptions, goals, theme]);

    if (isSubscriptionsLoading || isGoalsLoading) {
        return (
            <View style={[styles.mainScreenContainer, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={styles.subtitle}>Carregando Visão Geral...</Text>
            </View>
        );
    }

    return (
        <View style={styles.mainScreenContainer}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>
                    <View style={styles.cardGasto}>
                        <Text style={styles.mainValue}>{formatCurrency(summaryData.totalMonthlyExpense)}</Text>
                        <Text style={styles.cardTitleGasto}>Gasto Mensal Total</Text>
                        <LinearGradient colors={['#FCA835', '#0AD1FA']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.gradientLine} />
                    </View>

                    <Text style={styles.cardTitle}>Gastos e Metas por Categoria</Text>
                    <View style={styles.card}>
                        {summaryData.categoriesSummary.length > 0 ? (
                            summaryData.categoriesSummary.map((item: any) => {
                                const { color, name: iconName } = getCategoryIconAndColor(item.category);
                                return (
                                    <View key={item.category} style={styles.categoryGoalContainer}>
                                        <View style={styles.categoryHeader}>
                                            <View style={styles.categoryIconText}>
                                                <Ionicons name={iconName as any} size={18} color={color} style={{ marginRight: 8}} />
                                                <Text style={[styles.categoryName, { color: color }]}>{item.category}</Text>
                                            </View>
                                            <Text style={[styles.goalStatus, { color: item.statusColor }]}>{item.statusMessage}</Text>
                                        </View>
                                        <Text style={styles.goalAmount}>{formatCurrency(item.expense)} / {formatCurrency(item.goal)}</Text>
                                        {item.goal > 0 && <ProgressBar progress={item.progress} />}
                                    </View>
                                );
                            })
                        ) : (
                            <Text style={styles.noGoalText}>Nenhum gasto registrado este mês.</Text>
                        )}
                    </View>

                    <Text style={styles.cardTitle}>Próximos Vencimentos</Text>
                    <View style={styles.card}> 
                        {summaryData.upcomingPayments.length > 0 ? (
                            summaryData.upcomingPayments.map(sub => {
                                const { color, name: iconName } = getCategoryIconAndColor(sub.category);
                                const dueDateInfo = getTimeUntilDueDate(sub.firstChargeDate);
                                return (
                                    <TouchableOpacity key={sub.id} style={styles.upcomingPaymentRow}>
                                        <View style={styles.upcomingItemLeft}>
                                            <View style={[styles.upcomingIconWrapper, { backgroundColor: color }]}>
                                                <Ionicons name={iconName as any} size={20} color={theme.background} />
                                            </View>
                                            <View>
                                                <Text style={styles.upcomingName}>{sub.name}</Text>
                                                <Text style={styles.upcomingValue}>{formatCurrency(sub.value)}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.upcomingDateInfo}>
                                            <Text style={[styles.upcomingStatus, { color: dueDateInfo.color }]}>{dueDateInfo.text}</Text>
                                            <Text style={[styles.upcomingDate, { color: theme.text, opacity: 0.6 }]}>
                                                {sub.firstChargeDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })
                        ) : (
                            <Text style={styles.noGoalText}>Sem pagamentos futuros.</Text>
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