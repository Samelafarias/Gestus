import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useSubscriptions } from '../context/SubscriptionContext';

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        backgroundColor: '#282828',
        borderRadius: 10,
        width: '100%',
        borderWidth: 1,
        borderColor: '#3a3a3a',
    },
    totalHeader: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ccc',
        marginBottom: 5,
        display: 'flex',
        margin:'auto',
    },
    totalValue: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        display: 'flex',
        margin:'auto',
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
        padding: 0, 
        borderRadius: 10,
        width: '90%',
        display: 'flex',
        margin:'auto',
    },
    summaryText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#3a3a3a',
        marginLeft: 15,
    },
    summaryDetail: {
        fontSize: 14,
        color: '#ccc',
    },
    chartWrapper: {
        width: Dimensions.get('window').width - 40, 
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
    },
    monthlyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#1e1e1e', 
    },
    monthlyMonth: {
        color: '#ccc',
        fontSize: 16,
        fontWeight: '600',
    },
    monthlyExpense: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const MOCKED_MONTHLY_DATA = [
    { month: 'Dezembro', expense: 45, isDataAvailable: true },
    { month: 'Novembro', expense: 70, isDataAvailable: true }, 
    { month: 'Outubro', expense: 80, isDataAvailable: true },
    { month: 'Setembro', expense: 20, isDataAvailable: true },
    { month: 'Agosto', expense: 76, isDataAvailable: true },
    { month: 'Julho', expense: 83, isDataAvailable: true },
    { month: 'Junho', expense: 85, isDataAvailable: true },
    { month: 'Maio', expense: 48, isDataAvailable: true },
    { month: 'Abril', expense: 0, isDataAvailable: false }, 
    { month: 'Março', expense: 0, isDataAvailable: false },
    { month: 'Fevereiro', expense: 0, isDataAvailable: false },
    { month: 'Janeiro', expense: 0, isDataAvailable: false },
];


const RelatorioAnual: React.FC = () => {
    const screenWidth = Dimensions.get('window').width; 
    
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
    
    const renderMonthlyItem = ({ item }: { item: typeof MOCKED_MONTHLY_DATA[0] }) => (
        <View style={styles.monthlyRow}>
            <Text style={styles.monthlyMonth}>{item.month}</Text>
            <Text style={styles.monthlyExpense}>
                {item.isDataAvailable ? formatCurrency(item.expense) : 'Sem dados'}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}> 
            <Text style={styles.totalValue}>{formatCurrency(totalAnnualExpense)}</Text>
            <Text style={styles.totalHeader}>Gasto Total Anual</Text>
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
                    }}
                />
            </View>
            
            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={styles.legendColor} />
                    <Text style={styles.legendText}>2025</Text>
                </View>
            </View>

            <Text style={styles.summaryText}>Resumo Mensal</Text>
             <View style={styles.summaryCard}>
                <FlatList
                    data={MOCKED_MONTHLY_DATA}
                    keyExtractor={item => item.month}
                    renderItem={renderMonthlyItem}
                    scrollEnabled={false}
                />
            </View>
        </View>
    );
};


export default RelatorioAnual;