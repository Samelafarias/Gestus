import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useSubscriptions } from '../context/SubscriptionContext';
import { useTheme } from '../context/ThemeContext'; // Importação do tema

const RelatorioAnual = () => {
    const { activeSubscriptions } = useSubscriptions();
    const { theme, isDark } = useTheme(); // Consumindo o tema atual
    const currentYear = new Date().getFullYear();

    const { lineData, totalYear, monthlyList } = useMemo(() => {
        const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
        
        const data = months.map((_, index) => {
            let monthSum = 0;
            activeSubscriptions.forEach(sub => {
                if (sub.recurrence === 'Mensal') {
                    monthSum += sub.value;
                } else if (sub.recurrence === 'Anual') {
                    if (new Date(sub.firstChargeDate).getMonth() === index) {
                        monthSum += sub.value;
                    }
                }
            });
            // Adicionando a cor do label para o gráfico aqui também
            return { 
                value: monthSum, 
                label: months[index],
                labelTextStyle: { color: theme.textSecondary || '#888' } 
            };
        });

        const total = data.reduce((acc, curr) => acc + curr.value, 0);

        return { 
            lineData: data, 
            totalYear: total,
            monthlyList: [...data].reverse() 
        };
    }, [activeSubscriptions, theme]); // Recalcula se o tema mudar

    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.yearTitle, { color: theme.textSecondary || '#ccc' }]}>
                Gasto Total em {currentYear}
            </Text>
            <Text style={[styles.totalValue, { color: theme.text }]}>
                {formatCurrency(totalYear)}
            </Text>

            <LineChart
                data={lineData}
                height={180}
                areaChart
                curved
                animateOnChange
                startFillColor={theme.primary || "#8B5CF6"}
                startOpacity={0.4}
                endOpacity={0.1}
                color={theme.primary || "#8B5CF6"}
                dataPointsColor={theme.primary || "#8B5CF6"}
                thickness={3}
                // Cores do gráfico adaptadas
                yAxisTextStyle={{ color: theme.textSecondary || '#888' }}
                xAxisLabelTextStyle={{ color: theme.textSecondary || '#888' }}
                hideRules
                noOfSections={4}
                // Garante que o fundo do gráfico não "quebre" o layout
                backgroundColor={theme.background}
            />

            <View style={styles.summaryContainer}>
                <Text style={[styles.summaryTitle, { color: theme.text }]}>Resumo Mensal</Text>
                {monthlyList.map((item, idx) => (
                    <View 
                        key={idx} 
                        style={[
                            styles.summaryRow, 
                            { borderBottomColor: isDark ? '#333' : '#eee' } // Borda dinâmica
                        ]}
                    >
                        <Text style={[styles.monthName, { color: theme.textSecondary || '#ccc' }]}>
                            {item.label.toUpperCase()}
                        </Text>
                        <Text style={[styles.monthValue, { color: theme.text }]}>
                            {formatCurrency(item.value)}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        width: '100%',
        paddingBottom: 20 
    },
    yearTitle: { 
        fontSize: 16, 
        textAlign: 'center' 
    },
    totalValue: { 
        fontSize: 38, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginBottom: 20 
    },
    summaryContainer: { 
        marginTop: 30 
    },
    summaryTitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        marginBottom: 15 
    },
    summaryRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingVertical: 12, 
        borderBottomWidth: 0.5 
    },
    monthName: { 
        fontSize: 16 
    },
    monthValue: { 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
});

export default RelatorioAnual;