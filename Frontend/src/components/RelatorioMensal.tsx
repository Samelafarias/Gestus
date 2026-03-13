import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts'; 
import { useSubscriptions } from '../context/SubscriptionContext';
import { useTheme } from '../context/ThemeContext'; // Importando o seu hook de tema

const RelatorioMensal = ({ timeframe }: { timeframe: 'Este Mês' | 'Mês Passado' }) => {
    const { activeSubscriptions } = useSubscriptions();
    const { theme } = useTheme(); // Acessando as cores do tema atual

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
            'Educação': { value: 0, count: 0, color: '#FF4081' }, 
            'Música': { value: 0, count: 0, color: '#FF9800' },
            'Software': { value: 0, count: 0, color: '#8B5CF6' },
            'Outros': { value: 0, count: 0, color: '#ccc' },
        };

        activeSubscriptions.forEach(sub => {
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
                focused: true,
            }));

        return { pieData: data, categoryDetails: totals, totalExpense: total };
    }, [activeSubscriptions]);

    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Texto secundário (cinza adaptável) */}
            <Text style={[styles.monthLabel, { color: theme.textSecondary || '#888' }]}>
                Gasto Total Mensal - {monthName}
            </Text>
            
            {/* Texto principal (Título/Valor) */}
            <Text style={[styles.totalValue, { color: theme.text }]}>
                {formatCurrency(totalExpense)}
            </Text>

            <View style={styles.chartContainer}>
                <PieChart
                    data={pieData}
                    donut
                    sectionAutoFocus
                    radius={90}
                    innerRadius={50}
                    // O círculo interno deve ser da mesma cor do fundo para dar o efeito "donut"
                    innerCircleColor={theme.background} 
                    centerLabelComponent={() => (
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: theme.text, fontSize: 16, fontWeight: 'bold'}}>
                                {Math.round((pieData[0]?.value / totalExpense) * 100 || 0)}%
                            </Text>
                        </View>
                    )}
                />
            </View>

            <Text style={[styles.detailTitle, { color: theme.text }]}>Detalhes por Categoria</Text>
            
            {Object.entries(categoryDetails).map(([name, item]) => item.count > 0 && (
                <View 
                    key={name} 
                    style={[
                        styles.detailRow, 
                        { borderBottomColor: theme.divider || '#333' } // Divisor dinâmico
                    ]}
                >
                    <View style={styles.catInfo}>
                        <View style={[styles.dot, { backgroundColor: item.color }]} />
                        <View>
                            <Text style={[styles.catName, { color: theme.text }]}>{name}</Text>
                            <Text style={[styles.catCount, { color: theme.textSecondary || '#888' }]}>
                                {item.count} assinatura(s)
                            </Text>
                        </View>
                    </View>
                    <Text style={[styles.catValue, { color: theme.text }]}>
                        {formatCurrency(item.value)}
                    </Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { width: '100%', alignItems: 'center' },
    monthLabel: { fontSize: 16, marginTop: 10 },
    totalValue: { fontSize: 42, fontWeight: 'bold', marginVertical: 10 },
    chartContainer: { marginVertical: 20 },
    detailTitle: { fontSize: 18, fontWeight: 'bold', alignSelf: 'flex-start', marginVertical: 15 },
    detailRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '100%', 
        paddingVertical: 12, 
        borderBottomWidth: 0.5 
    },
    catInfo: { flexDirection: 'row', alignItems: 'center' },
    dot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
    catName: { fontSize: 16, fontWeight: '600' },
    catCount: { fontSize: 12 },
    catValue: { fontSize: 16, fontWeight: 'bold' },
});

export default RelatorioMensal;