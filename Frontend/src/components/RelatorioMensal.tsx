import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts'; // Nova biblioteca
import { useSubscriptions } from '../context/SubscriptionContext';

const RelatorioMensal = ({ timeframe }: { timeframe: 'Este Mês' | 'Mês Passado' }) => {
    const { activeSubscriptions } = useSubscriptions();

    // Lógica para obter o nome do mês atual ou passado
    const getMonthName = (offset: number) => {
        const date = new Date();
        date.setMonth(date.getMonth() - offset);
        return date.toLocaleString('pt-BR', { month: 'long' });
    };

    const targetMonth = timeframe === 'Este Mês' ? 0 : 1;
    const monthName = getMonthName(targetMonth);

    // Cálculos reais por categoria
    const { pieData, categoryDetails, totalExpense } = useMemo(() => {
        const totals: Record<string, { value: number; count: number; color: string }> = {
            'Streaming': { value: 0, count: 0, color: '#03A9F4' },
            'Educação': { value: 0, count: 0, color: '#FF4081' }, // Rosa do protótipo
            'Música': { value: 0, count: 0, color: '#FF9800' },
            'Software': { value: 0, count: 0, color: '#8B5CF6' },
            'Outros': { value: 0, count: 0, color: '#ccc' },
        };

        activeSubscriptions.forEach(sub => {
            // Simplificação: Assume que assinaturas mensais contam para o mês
            const cat = totals[sub.category] ? sub.category : 'Outros';
            totals[cat].value += sub.value;
            totals[cat].count += 1;
        });

        const total = Object.values(totals).reduce((sum, item) => sum + item.value, 0);

        const data = Object.entries(totals)
            .filter(([_, item]) => item.value > 0)
            .map(([label, item]) => ({
                value: item.value,
                color: item.color,
                label: label,
                focused: true, // Efeito de foco solicitado
            }));

        return { pieData: data, categoryDetails: totals, totalExpense: total };
    }, [activeSubscriptions]);

    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <View style={styles.container}>
            <Text style={styles.monthLabel}>Gasto Total Mensal - {monthName}</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalExpense)}</Text>

            <View style={styles.chartContainer}>
                <PieChart
                    data={pieData}
                    donut
                    sectionAutoFocus
                    radius={90}
                    innerRadius={50}
                    innerCircleColor={'#1e1e1e'}
                    centerLabelComponent={() => (
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                                {Math.round((pieData[0]?.value / totalExpense) * 100 || 0)}%
                            </Text>
                        </View>
                    )}
                />
            </View>

            <Text style={styles.detailTitle}>Detalhes por Categoria</Text>
            {Object.entries(categoryDetails).map(([name, item]) => item.count > 0 && (
                <View key={name} style={styles.detailRow}>
                    <View style={styles.catInfo}>
                        <View style={[styles.dot, { backgroundColor: item.color }]} />
                        <View>
                            <Text style={styles.catName}>{name}</Text>
                            <Text style={styles.catCount}>{item.count} assinatura(s)</Text>
                        </View>
                    </View>
                    <Text style={styles.catValue}>{formatCurrency(item.value)}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { width: '100%', alignItems: 'center' },
    monthLabel: { color: '#ccc', fontSize: 16, marginTop: 10 },
    totalValue: { color: '#fff', fontSize: 42, fontWeight: 'bold', marginVertical: 10 },
    chartContainer: { marginVertical: 20 },
    detailTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', alignSelf: 'flex-start', marginVertical: 15 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#333' },
    catInfo: { flexDirection: 'row', alignItems: 'center' },
    dot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
    catName: { color: '#fff', fontSize: 16, fontWeight: '600' },
    catCount: { color: '#888', fontSize: 12 },
    catValue: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default RelatorioMensal;