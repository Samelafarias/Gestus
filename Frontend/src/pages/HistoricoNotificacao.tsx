import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSubscriptions } from '../context/SubscriptionContext'; 
import { Subscription } from '../types/Subscription';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e', 
        paddingHorizontal: 15,
        paddingTop: 15,
    },
    groupSection: {
        marginBottom: 20,
    },
    groupHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
});

const cardStyles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#282828',
        padding: 15,
        borderRadius: 10,
        marginBottom: 8,
    },
    icon: {
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    subscriptionName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    message: {
        fontSize: 14,
        color: '#ccc',
        marginTop: 2,
    },
    time: {
        fontSize: 12,
        color: '#999',
    },
});

interface LogItem {
    id: string;
    subscriptionName: string;
    message: string;
    time: string;
    status: 'success' | 'failure' | 'reminder';
    dateGroup: 'Hoje' | 'Ontem' | 'Anterior';
}

const getStatusIcon = (status: LogItem['status']) => {
    switch (status) {
        case 'reminder':
            return { icon: 'notifications-outline', color: '#8B5CF6' }; 
        case 'success':
            return { icon: 'checkmark-circle-outline', color: '#4eefa4ff' }; 
        case 'failure':
            return { icon: 'close-circle-outline', color: '#FF5252' }; 
    }
};

const NotificationCard: React.FC<{ item: LogItem }> = ({ item }) => {
    const { icon, color } = getStatusIcon(item.status);

    return (
        <View style={cardStyles.card}>
            <Ionicons name={icon} size={24} color={color} style={cardStyles.icon} />
            <View style={cardStyles.textContainer}>
                <Text style={cardStyles.subscriptionName}>{item.subscriptionName}</Text>
                <Text style={cardStyles.message} numberOfLines={2}>{item.message}</Text>
            </View>
            <Text style={cardStyles.time}>{item.time}</Text>
        </View>
    );
};

const HistoricoNotificacao = () => {
    const { activeSubscriptions } = useSubscriptions();

    const simulatedLog = useMemo(() => {
        const log: LogItem[] = [];

        activeSubscriptions.forEach((sub, index) => {
            const date = sub.firstChargeDate;
            
            log.push({
                id: `reminder-${sub.id}`,
                subscriptionName: sub.name,
                message: `Lembrete: Cobrança de R$ ${sub.value.toFixed(2).replace('.', ',')} vence em ${date.toLocaleDateString('pt-BR')}`,
                time: '09:00 am', 
                status: 'reminder',
                dateGroup: 'Hoje', 
            });
        });

        if (activeSubscriptions.length > 0) {
            log.push({
                id: 'static-success',
                subscriptionName: activeSubscriptions[0].name,
                message: 'Pagamento Confirmado', 
                time: '12:00 am',
                status: 'success',
                dateGroup: 'Hoje',
            });
            log.push({
                id: 'static-failure',
                subscriptionName: activeSubscriptions[activeSubscriptions.length - 1].name,
                message: 'Falha no pagamento', 
                time: '12:00 am',
                status: 'failure',
                dateGroup: 'Ontem',
            });
        }

        return log.sort((a, b) => b.id.localeCompare(a.id)); 
    }, [activeSubscriptions]);

    const groupedNotifications = simulatedLog.reduce((acc, item) => {
        const group = item.dateGroup;
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(item);
        return acc;
    }, {} as Record<LogItem['dateGroup'], LogItem[]>);


    return (
        <ScrollView style={styles.container}>
            {Object.entries(groupedNotifications).map(([group, items]) => (
                <View key={group} style={styles.groupSection}>
                    <Text style={styles.groupHeader}>{group}</Text>
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <NotificationCard item={item} />}
                        scrollEnabled={false} 
                    />
                </View>
            ))}
            <View style={{ height: 50 }} />
        </ScrollView>
    );
};

export default HistoricoNotificacao;

