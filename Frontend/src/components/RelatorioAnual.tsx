import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useSubscriptions } from '../context/SubscriptionContext';

const RelatorioAnual = () => {
    const { activeSubscriptions } = useSubscriptions();
    const currentYear = new Date().getFullYear();

    const { lineData, totalYear, monthlyList } = useMemo(() => {
        const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
        
        // Calcula o gasto projetado para cada mês
        const data = months.map((_, index) => {
            let monthSum = 0;
            activeSubscriptions.forEach(sub => {
                if (sub.recurrence === 'Mensal') {
                    monthSum += sub.value;
                } else if (sub.recurrence === 'Anual') {
                    // Soma apenas no mês da cobrança original
                    if (new Date(sub.firstChargeDate).getMonth() === index) {
                        monthSum += sub.value;
                    }
                }
            });
            return { value: monthSum, label: months[index] };
        });

        const total = data.reduce((acc, curr) => acc + curr.value, 0);

        return { 
            lineData: data, 
            totalYear: total,
            monthlyList: [...data].reverse() // Lista do mais recente para o mais antigo
        };
    }, [activeSubscriptions]);

    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <View style={styles.container}>
            <Text style={styles.yearTitle}>Gasto Total em {currentYear}</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalYear)}</Text>

            <LineChart
                data={lineData}
                height={180}
                areaChart
                curved
                animateOnChange // Animado conforme solicitado
                startFillColor="#8B5CF6"
                startOpacity={0.4}
                endOpacity={0.1}
                color="#8B5CF6"
                dataPointsColor="#8B5CF6"
                thickness={3}
                yAxisTextStyle={{color: '#888'}}
                xAxisLabelTextStyle={{color: '#888'}}
                hideRules
                noOfSections={4}
            />

            <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Resumo Mensal</Text>
                {monthlyList.map((item, idx) => (
                    <View key={idx} style={styles.summaryRow}>
                        <Text style={styles.monthName}>{item.label.toUpperCase()}</Text>
                        <Text style={styles.monthValue}>{formatCurrency(item.value)}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { width: '100%' },
    yearTitle: { color: '#ccc', fontSize: 16, textAlign: 'center' },
    totalValue: { color: '#fff', fontSize: 38, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    summaryContainer: { marginTop: 30 },
    summaryTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#333' },
    monthName: { color: '#ccc', fontSize: 16 },
    monthValue: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default RelatorioAnual;