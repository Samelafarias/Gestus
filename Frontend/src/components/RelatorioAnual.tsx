import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useSubscriptions } from '../context/SubscriptionContext';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#282828',
        borderRadius: 10,
        width: '100%',
        borderWidth: 1,
        borderColor: '#3a3a3a',
    },
    totalHeader: {
        fontSize: 18,
        fontWeight: '500',
        color: '#ccc',
        marginBottom: 5,
    },
    totalValue: {
        fontSize: 34,
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
    summaryCard: {
        marginTop: 20,
        backgroundColor: '#282828',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        borderWidth: 1,
        borderColor: '#3a3a3a',
    },
    summaryText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    summaryDetail: {
        fontSize: 14,
        color: '#ccc',
    },
    chartWrapper: {
        width: screenWidth - 40,
        overflow: 'hidden',
    },
    legendContainer: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendColor: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(139, 92, 246, 1)',
        marginRight: 5,
    },
    legendText: {
        color: '#fff',
        fontSize: 14,
    }
});

const screenWidth = Dimensions.get('window').width;

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const RelatorioAnual: React.FC = () => {
    const { subscriptions, isLoading } = useSubscriptions();

    const { monthlyExpenses, totalAnnualExpense } = useMemo(() => {
        if (isLoading || subscriptions.length === 0) {
            return { monthlyExpenses: Array(12).fill(0), totalAnnualExpense: 0 };
        }
        
        const expenseData = [95, 60, 25, 75, 48, 85, 83, 76, 20, 80, 70, 45]; 
        
        const total = expenseData.reduce((sum, val) => sum + val, 0);

        return { monthlyExpenses: expenseData, totalAnnualExpense: total };
    }, [subscriptions, isLoading]);

    const chartData = {
        labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        datasets: [
            {
                data: monthlyExpenses,
                color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`, 
                strokeWidth: 2 
            }
        ]
    };

    const chartConfig = {
        backgroundColor: '#282828',
        backgroundGradientFrom: '#282828',
        backgroundGradientTo: '#282828',
        decimalPlaces: 0, 
        color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#8B5CF6"
        },
        paddingRight: 20,
    };
    
    if (totalAnnualExpense === 0) {
         return <Text style={styles.noDataText}>Ainda não há dados o suficiente.</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.totalHeader}>Gasto Total Anual</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalAnnualExpense)}</Text>
            
            <View style={styles.chartWrapper}>
                <LineChart
                    data={chartData}
                    width={screenWidth - 40}
                    height={250}
                    chartConfig={chartConfig}
                    bezier
                    withHorizontalLabels={true} 
                    withVerticalLabels={true} 
                    withDots={true}
                    withOuterLines={false}
                    withInnerLines={true} 
                    fromZero={true}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                />
            </View>
               <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={styles.legendColor} />
                    <Text style={styles.legendText}>2025</Text>
                </View>
            </View>


             <View style={styles.summaryCard}>
                <Text style={styles.summaryText}>Resumo Mensal (2025)</Text>
                <Text style={styles.summaryDetail}>
                    * Dados simulados para visualização do gráfico.
                </Text>
            </View>
        </View>
    );
};



export default RelatorioAnual;