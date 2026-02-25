import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getNotificationHistory, NotificationLog } from '../services/NotificationHistoryStorage';
import { useTheme } from '../context/ThemeContext'; // Importando o contexto de tema

// Habilita animações no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const NotificationItem = ({ item, theme }: { item: NotificationLog, theme: any }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const getIcon = () => {
        if (item.status === 'success') return { name: 'checkmark-circle', color: '#4eefa4' };
        if (item.status === 'failure') return { name: 'close-circle', color: '#FF5252' };
        // Usa a cor primária do tema para notificações padrão
        return { name: 'notifications', color: theme.primary };
    };

    const iconData = getIcon();

    // Estilos internos do Card baseados no tema
    const cardStyles = StyleSheet.create({
        card: { 
            backgroundColor: theme.surface, 
            borderRadius: 12, 
            marginBottom: 10, 
            overflow: 'hidden', 
            padding: 15,
            borderWidth: 1,
            borderColor: theme.border
        },
        subName: { color: theme.text, fontSize: 16, fontWeight: 'bold' },
        time: { color: theme.text === '#ffffff' ? '#888' : '#666', fontSize: 12 },
        expandedContent: { 
            marginTop: 15, 
            paddingTop: 15, 
            borderTopWidth: 1, 
            borderTopColor: theme.border 
        },
        messageText: { color: theme.text, opacity: 0.8, fontSize: 14, lineHeight: 20 },
    });

    return (
        <TouchableOpacity style={cardStyles.card} onPress={toggleExpand} activeOpacity={0.8}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name={iconData.name as any} size={24} color={iconData.color} style={{ marginRight: 15 }} />
                <View style={{ flex: 1 }}>
                    <Text style={cardStyles.subName}>{item.subscriptionName}</Text>
                    <Text style={cardStyles.time}>{new Date(item.timestamp).toLocaleDateString('pt-BR')}</Text>
                </View>
                <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={theme.text} />
            </View>
            
            {expanded && (
                <View style={cardStyles.expandedContent}>
                    <Text style={cardStyles.messageText}>{item.message}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const HistoricoNotificacao = () => {
    const [history, setHistory] = useState<NotificationLog[]>([]);
    const { theme } = useTheme(); // Consome o tema

    useEffect(() => {
        const load = async () => {
            const data = await getNotificationHistory();
            setHistory(data);
        };
        load();
    }, []);

    const styles = useMemo(() => StyleSheet.create({
        container: { 
            flex: 1, 
            backgroundColor: theme.background, 
            padding: 15 
        },
        pageTitle: { 
            color: theme.text, 
            fontSize: 18, 
            fontWeight: 'bold', 
            marginBottom: 20 
        },
        emptyContainer: { 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center' 
        },
        emptyText: { 
            color: theme.text, 
            opacity: 0.5, 
            marginTop: 10 
        }
    }), [theme]);

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Notificações dos últimos 5 dias</Text>
            {history.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="notifications-off-outline" size={48} color={theme.text} style={{ opacity: 0.3 }} />
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