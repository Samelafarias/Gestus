import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useSubscriptions } from '../context/SubscriptionContext';
import { Subscription } from '../types/Subscription';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#282828',
        borderRadius: 10,
        paddingHorizontal: 10,
        width: '100%',
        borderWidth: 1,
        borderColor: '#3a3a3a',
    },
    totalValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    noDataText: {
        color: '#ccc',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        padding: 40,
        backgroundColor: '#282828',
        borderRadius: 10,
        width: '100%',
    },
    detailHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 20,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#3a3a3a',
    },
    detailLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 10,
    },
    detailCategory: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    detailCount: {
        fontSize: 12,
        color: '#ccc',
    },
    detailValue: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    }
});


const screenWidth = Dimensions.get('window').width;

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const CATEGORY_COLORS: Record<string, string> = {
    'Streaming': '#03A9F4',
    'Música': '#FF9800',    
    'Software': '#8B5CF6', 
    'Educação': '#4eefa4ff',
    'Outros': '#ccc',       
};

const CATEGORY_OPTIONS: Subscription['category'][] = ['Streaming', 'Música', 'Software', 'Educação', 'Outros'];


interface RelatorioMensalProps {
    timeframe: 'Este Mês' | 'Mês Passado';
}

const RelatorioMensal: React.FC<RelatorioMensalProps> = ({ timeframe }) => {
    const { subscriptions, isLoading } = useSubscriptions();

    const { chartData, totalExpense } = useMemo(() => {
        if (isLoading) return { chartData: [], totalExpense: 0 };
        
        const expenseMap = subscriptions.filter(sub => sub.isActive)
            .reduce((acc, sub) => {
                const categoryKey = CATEGORY_OPTIONS.includes(sub.category) ? sub.category : 'Outros'; 
                acc[categoryKey] = (acc[categoryKey] || 0) + sub.value;
                return acc;
            }, {} as Record<string, number>);
        
        let total = 0;
        
        const data = CATEGORY_OPTIONS.map(category => {
            const expense = expenseMap[category] || 0;
            total += expense;
            
            return {
                name: category,
                population: expense, 
                color: CATEGORY_COLORS[category],
                legendFontColor: '#fff',
                legendFontSize: 12, 
                subscriptionsCount: subscriptions.filter(sub => sub.category === category).length,
            };
        }).filter(item => item.population > 0); 

        if (total > 0 && timeframe === 'Mês Passado') {
             total *= 1.1; 
             data.forEach(item => item.population *= 1.1);
        }

        return { chartData: data, totalExpense: total };
    }, [subscriptions, timeframe, isLoading]);

    const chartConfig = {
        backgroundGradientFrom: '#282828',
        backgroundGradientTo: '#1e1e1e',
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    };

    if (totalExpense === 0) {
        return <Text style={styles.noDataText}>Ainda não há dados o suficiente.</Text>;
    }

    return (
        <View style={styles.container}>
            
            <Text style={styles.totalValue}>{formatCurrency(totalExpense)}</Text>
               <PieChart
                data={chartData}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[10, 5]}
                absolute
                hasLegend={true} 
            />

            <Text style={styles.detailHeader}>Detalhes por Categoria</Text>
            {chartData.map((item, index) => (
                <View key={index} style={styles.detailRow}>
                    <View style={styles.detailLeft}>
                        <View style={[styles.detailColor, { backgroundColor: item.color }]} />
                        <View>
                            <Text style={styles.detailCategory}>{item.name}</Text>
                            <Text style={styles.detailCount}>{item.subscriptionsCount} assinatura(s)</Text> 
                        </View>
                    </View>
                    <Text style={styles.detailValue}>{formatCurrency(item.population)}</Text>
                </View>
            ))}
        </View>
    );
};

export default RelatorioMensal;