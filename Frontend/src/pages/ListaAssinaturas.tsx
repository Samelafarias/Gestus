import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AddButton from '../components/AddButton';
import { useSubscriptions } from '../context/SubscriptionContext'; 
import { Subscription } from '../types/Subscription'; 
import { useTheme } from '../context/ThemeContext'; 

const getCategoryIcon = (category: Subscription['category'] | string) => {
    switch (category) {
        case 'Streaming': return { name: 'tv-outline', color: '#03A9F4' };
        case 'Música': return { name: 'musical-notes-outline', color: '#FF9800' };
        case 'Software': return { name: 'code-slash-outline', color: '#8B5CF6' };
        case 'Educação': return { name: 'book-outline', color: '#4eefa4ff' };
        default: return { name: 'cube-outline', color: '#ccc' };
    }
};

const SubscriptionCard: React.FC<{ subscription: Subscription }> = ({ subscription }) => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const { remove } = useSubscriptions(); 
    
    const formattedDate = subscription.firstChargeDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
    const formattedValue = subscription.value.toFixed(2).replace('.', ',');
    const { name: iconName, color: iconColor } = getCategoryIcon(subscription.category);

    // Estilos dinâmicos do Card usando useMemo para estabilidade
    const styles = useMemo(() => StyleSheet.create({
        card: {
            flexDirection: 'row',
            backgroundColor: theme.surface, // Usa a cor de superfície do tema
            borderRadius: 15,
            padding: 15,
            marginBottom: 12,
            justifyContent: 'space-between',
            alignItems: 'center',
            borderColor: theme.border, // Usa a cor de borda do tema
            borderWidth: 1,
            // Sombra leve para o modo claro
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: theme.isDark ? 0 : 0.1,
            shadowRadius: 2,
            elevation: theme.isDark ? 0 : 2,
        },
        iconWrapper: {
            width: 48,
            height: 48,
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', 
            marginRight: 15,
            borderWidth: 1,
            borderColor: iconColor,
        },
        nameText: {
            fontSize: 16,
            color: theme.text,
            fontWeight: 'bold',
        },
        nextChargeText: {
            fontSize: 12,
            color: theme.text,
            opacity: 0.6,
            marginTop: 2,
        },
        valueText: {
            fontSize: 16,
            color: theme.text, 
            fontWeight: 'bold',
            marginBottom: 5,
        }
    }), [theme, iconColor]);

    return (
        <View style={styles.card}>
            <TouchableOpacity 
                style={staticCardStyles.detailsContainer}
                onPress={() => navigation.navigate('DetalhesAssinaturas' as never, { subscriptionId: subscription.id } as never)}
            >
                <View style={styles.iconWrapper}>
                    <Ionicons name={iconName as any} size={28} color={iconColor} />
                </View>

                <View style={staticCardStyles.textContainer}>
                    <Text style={styles.nameText}>{subscription.name}</Text>
                    <Text style={styles.nextChargeText}>Vence em {formattedDate}</Text>
                </View>
            </TouchableOpacity>

            <View style={staticCardStyles.actionsContainer}>
                <Text style={styles.valueText}>R$ {formattedValue}</Text>
                <View style={staticCardStyles.actionButtons}>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('EdicaoAssinaturas' as never, { subscriptionId: subscription.id } as never)} 
                        style={staticCardStyles.actionButton}
                    >
                        <Ionicons name="pencil-outline" size={20} color="#8B5CF6" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => {
                            Alert.alert("Inativar", `Inativar ${subscription.name}?`, [
                                { text: "Não", style: "cancel" },
                                { text: "Sim", onPress: () => remove(subscription.id) }
                            ]);
                        }} 
                        style={staticCardStyles.actionButton}
                    >
                        <Ionicons name="trash-outline" size={20} color="#FF9800" /> 
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const ListaAssinaturas = () => {
    const { theme } = useTheme();
    const { activeSubscriptions, isLoading } = useSubscriptions(); 

    const dynamicStyles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background, 
            paddingHorizontal: 15,
            paddingTop: 10,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 40,
        },
        emptyText: {
            color: theme.text,
            opacity: 0.6,
            textAlign: 'center',
            fontSize: 16,
            marginTop: 10,
        }
    }), [theme]);

    if (isLoading) {
        return (
            <View style={[dynamicStyles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <View style={dynamicStyles.container}>            
            {activeSubscriptions.length === 0 ? (
                <View style={dynamicStyles.emptyContainer}>
                    <Ionicons name="archive-outline" size={60} color={theme.text} style={{ opacity: 0.2 }} />
                    <Text style={dynamicStyles.emptyText}>Nenhuma assinatura ativa encontrada.</Text>
                </View>
            ) : (
                <FlatList
                    data={activeSubscriptions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <SubscriptionCard subscription={item} />}
                    contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
            <AddButton />
        </View>
    );
};

const staticCardStyles = StyleSheet.create({
    detailsContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    textContainer: { flexDirection: 'column', justifyContent: 'center' },
    actionsContainer: { flexDirection: 'column', alignItems: 'flex-end' },
    actionButtons: { flexDirection: 'row' },
    actionButton: { marginLeft: 12, padding: 4 }
});

export default ListaAssinaturas;