import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getNotificationHistory, NotificationLog } from '../services/NotificationHistoryStorage';
import { useTheme } from '../context/ThemeContext'; // Importe o hook

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Criamos a função de estilos que recebe o tema
const createStyles = (theme: any) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background, padding: 15 },
    pageTitle: { color: theme.text, fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
    card: { backgroundColor: theme.surface, borderRadius: 12, marginBottom: 10, overflow: 'hidden', padding: 15 },
    cardHeader: { flexDirection: 'row', alignItems: 'center' },
    icon: { marginRight: 15 },
    headerText: { flex: 1 },
    subName: { color: theme.text, fontSize: 16, fontWeight: 'bold' },
    time: { color: theme.textSecondary, fontSize: 12 },
    expandedContent: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: theme.border },
    messageText: { color: theme.textSecondary, fontSize: 14, lineHeight: 20 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: theme.textSecondary, marginTop: 10 }
});

const NotificationItem = ({ item, theme }: { item: NotificationLog, theme: any }) => {
    const [expanded, setExpanded] = useState(false);
    const styles = createStyles(theme); // Gera estilos para o item

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const getIcon = () => {
        // Cores de status geralmente mantemos fixas para semântica (verde/vermelho), 
        // mas podemos usar o tema para o roxo padrão.
        if (item.status === 'success') return { name: 'checkmark-circle', color: '#4eefa4' };
        if (item.status === 'failure') return { name: 'close-circle', color: '#FF5252' };
        return { name: 'notifications', color: theme.primary };
    };

    const iconData = getIcon();

    return (
        <TouchableOpacity style={styles.card} onPress={toggleExpand} activeOpacity={0.8}>
            <View style={styles.cardHeader}>
                <Ionicons name={iconData.name as any} size={24} color={iconData.color} style={styles.icon} />
                <View style={styles.headerText}>
                    <Text style={styles.subName}>{item.subscriptionName}</Text>
                    <Text style={styles.time}>{new Date(item.timestamp).toLocaleDateString('pt-BR')}</Text>
                </View>
                <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={theme.textSecondary} />
            </View>
            
            {expanded && (
                <View style={styles.expandedContent}>
                    <Text style={styles.messageText}>{item.message}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const HistoricoNotificacao = () => {
    const [history, setHistory] = useState<NotificationLog[]>([]);
    const { theme } = useTheme(); // Consome o tema
    const styles = createStyles(theme); // Gera os estilos dinâmicos

    useEffect(() => {
        const load = async () => {
            const data = await getNotificationHistory();
            setHistory(data);
        };
        load();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Notificações dos últimos 5 dias</Text>
            {history.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="notifications-off-outline" size={48} color={theme.border} />
                    <Text style={styles.emptyText}>Nenhuma notificação recente.</Text>
                </View>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <NotificationItem item={item} theme={theme} />}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
};

export default HistoricoNotificacao;