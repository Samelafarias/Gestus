import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import AddButton from '../components/AddButton';
import { useSubscriptions } from '../context/SubscriptionContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; 

const homeStyles = StyleSheet.create({
  mainScreenContainer: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  scrollContent: {
      flexGrow: 1,
      backgroundColor: '#1e1e1e',
  },
  container: {
    padding: 20,
    backgroundColor: '#1e1e1e', 
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#282828',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  cardGasto: {
    padding: 10,
    marginBottom: 20,
    alignItems: 'center', 
  },
  cardTitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  cardTitleGasto: { 
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    fontWeight: '500',
    marginTop: 5,
  },
  mainValue: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
  },
  gradientLine: {
      height: 2,
      width: '100%',
      marginVertical: 10, 
  },
    categoryGoalContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
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
    color: '#fff',
    marginBottom: 5,
    textAlign: 'right',
  },
  noGoalText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 10,
    paddingVertical: 10,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#444',
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
    color: '#ccc',
    marginTop: 5,
    textAlign: 'right',
  },
  upcomingPaymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
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
      color: '#fff',
  },
  upcomingValue: {
      fontSize: 14,
      color: '#ccc',
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

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
    const clampedProgress = Math.min(Math.max(progress, 0), 1);
    const widthPercentage = `${clampedProgress * 100}%`;
    
    let barColor = '#22ed17ff'; 

    if (clampedProgress >= GOAL_WARNING_THRESHOLD) {
        barColor = '#ff5900ff'; 
    } 
    if (clampedProgress >= 1) {
        barColor = '#FF5252'; 
    }

    return (
        <View style={homeStyles.progressBarBackground}>
            <View style={[homeStyles.progressBarFill, { width: widthPercentage, backgroundColor: barColor }]} />
        </View>
    );
};

const HomePage = () => {
    const { activeSubscriptions, isLoading: isSubscriptionsLoading } = useSubscriptions();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isGoalsLoading, setIsGoalsLoading] = useState(true);

    useEffect(() => {
        const loadGoals = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem(GOALS_KEY);
                const loadedGoals: Goal[] = jsonValue != null ? JSON.parse(jsonValue) : [];
                
                const initialGoals = CATEGORY_OPTIONS.map(category => {
                    const existing = loadedGoals.find(g => g.category === category);
                    return {
                        category,
                        value: existing ? existing.value : 0,
                    } as Goal;
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

        const allCategories = Array.from(new Set([...CATEGORY_OPTIONS, ...Object.keys(expenseMap)]));

        const summary = allCategories.map(category => {
            const goal = goals.find(g => g.category === category) || { category, value: 0 };
            const expense = expenseMap[category] || 0;
            const progress = goal.value > 0 ? expense / goal.value : 0;
            
            let statusMessage = "";
            let statusColor = "";

            if (goal.value === 0 && expense > 0) {
                statusMessage = "Meta não definida";
                statusColor = '#ccc';
            } else if (goal.value === 0 && expense === 0) {
                return null; 
            } else if (expense > goal.value) {
                statusMessage = "ULTAPASSADA!";
                statusColor = '#FF5252';
            } else if (progress >= GOAL_WARNING_THRESHOLD) {
                statusMessage = "Quase no limite";
                statusColor = '#FF9800';
            } else {
                statusMessage = "Dentro da meta";
                statusColor = '#22ed17ff';
            }

            return {
                category,
                goal: goal.value,
                expense,
                progress,
                statusMessage,
                statusColor,
            };
        }).filter(item => item !== null); 
        
        const today = new Date();
        const payments = activeSubscriptions
            .filter(sub => sub.firstChargeDate.getTime() >= today.getTime() - (1000 * 60 * 60 * 24)) 
            .sort((a, b) => a.firstChargeDate.getTime() - b.firstChargeDate.getTime())
            .slice(0, MAX_UPCOMING_PAYMENTS);


        return {
            totalMonthlyExpense: totalExpense,
            categoriesSummary: summary as { category: string, goal: number, expense: number, progress: number, statusMessage: string, statusColor: string }[],
            upcomingPayments: payments,
        };
    }, [activeSubscriptions, goals]);


    if (isSubscriptionsLoading || isGoalsLoading) {
        return (
            <View style={homeStyles.mainScreenContainer}>
                <View style={homeStyles.container}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={homeStyles.subtitle}>Carregando Visão Geral...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={homeStyles.mainScreenContainer}>
            <ScrollView contentContainerStyle={homeStyles.scrollContent}>
                <View style={homeStyles.container}>
                    <View style={homeStyles.cardGasto}>
                        <Text style={homeStyles.mainValue}>{formatCurrency(totalMonthlyExpense)}</Text>
                        <Text style={homeStyles.cardTitleGasto}>Gasto Mensal Total</Text>
                          <LinearGradient
                            colors={['#FCA835', '#0AD1FA']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={homeStyles.gradientLine}
                        />
                    </View>
                    <Text style={homeStyles.cardTitle}>Gastos e Metas por Categoria</Text>
                    <View style={homeStyles.card}>
                        {categoriesSummary.length > 0 ? (
                            categoriesSummary.map((item) => {
                                const { color, name: iconName } = getCategoryIconAndColor(item.category);
                                const progressPercentage = Math.round(item.progress * 100);

                                return (
                                    <View key={item.category} style={homeStyles.categoryGoalContainer}>
                                        <View style={homeStyles.categoryHeader}>
                                            <View style={homeStyles.categoryIconText}>
                                                <Ionicons name={iconName} size={18} color={color} style={{ marginRight: 8}} />
                                                <Text style={[homeStyles.categoryName, { color: color }]}>{item.category}</Text>
                                            </View>
                                            <Text style={[homeStyles.goalStatus, { color: item.statusColor }]}>
                                                {item.statusMessage}
                                            </Text>
                                        </View>
                                        
                                        <Text style={homeStyles.goalAmount}>
                                            {formatCurrency(item.expense)} / {formatCurrency(item.goal)}
                                        </Text>
                                        {item.goal > 0 && (
                                            <>
                                                <ProgressBar progress={item.progress} />
                                                <Text style={homeStyles.progressText}>
                                                    {progressPercentage}% da meta utilizada
                                                </Text>
                                            </>
                                        )}
                                        {item.goal === 0 && item.expense > 0 && (
                                            <Text style={[homeStyles.progressText, { color: '#ccc' }]}>
                                                Gasto de {formatCurrency(item.expense)} (Meta não definida)
                                            </Text>
                                        )}
                                    </View>
                                );
                            })
                        ) : (
                            <Text style={homeStyles.noGoalText}>Cadastre uma assinatura e defina suas metas para começar!</Text>
                        )}
                    </View>
                    <Text style={homeStyles.cardTitle}>Próximos Vencimentos</Text>
                    <View style={homeStyles.card}> 
                        {upcomingPayments.length > 0 ? (
                            upcomingPayments.map(sub => {
                                const { color, name: iconName } = getCategoryIconAndColor(sub.category);
                                const dueDateInfo = getTimeUntilDueDate(sub.firstChargeDate);
                                
                                return (
                                    <TouchableOpacity 
                                        key={sub.id} 
                                        style={homeStyles.upcomingPaymentRow}
                                    >
                                        <View style={homeStyles.upcomingItemLeft}>
                                            <View style={[homeStyles.upcomingIconWrapper, { backgroundColor: color }]}>
                                                <Ionicons name={iconName} size={20} color="#1e1e1e" />
                                            </View>
                                            <View>
                                                <Text style={homeStyles.upcomingName}>{sub.name}</Text>
                                                <Text style={homeStyles.upcomingValue}>{formatCurrency(sub.value)}</Text>
                                            </View>
                                        </View>
                                        
                                        <View style={homeStyles.upcomingDateInfo}>
                                            <Text style={[homeStyles.upcomingStatus, { color: dueDateInfo.color }]}>
                                                {dueDateInfo.text}
                                            </Text>
                                            <Text style={homeStyles.upcomingDate}>
                                                {sub.firstChargeDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })
                        ) : (
                            <Text style={homeStyles.noGoalText}>Nenhum pagamento futuro agendado.</Text>
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


