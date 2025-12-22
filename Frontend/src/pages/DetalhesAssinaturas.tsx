import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSubscriptions } from '../context/SubscriptionContext';
import { Subscription } from '../types/Subscription';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e',
        padding: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
    },
    gradientBorder: {
        padding: 2.5,
        borderRadius: 13,
        marginBottom: 15,
    },
    headerCard: {
        backgroundColor: '#282828',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    headerName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 10,
        marginBottom: 5,
    },
    headerValue: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
    },
    headerDetail: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
        marginBottom: 15,
        marginTop: 20,
    },
    statusItem: {
        backgroundColor: '#232325',
        padding: 20,
        borderRadius: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#333',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusTextContainer: {
        flex: 1,
    },
    textStatusLabel: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 5,
    },
    textStatusPreco: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    textStatusVencimento: {
        color: '#ccc',
        fontSize: 14,
    },
    payButtonGradient: {
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    payButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    detailCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#282828',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ffffff10',
    },
    detailCardMultiline: {
        backgroundColor: '#282828',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    detailTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailTitle: {
        fontSize: 14,
        color: '#ccc',
        marginLeft: 10,
        fontWeight: 'bold',
    },
    detailValue: {
        fontSize: 16,
        color: '#fff',
        marginTop: 5,
    },
    editButtonWrapper: {
        marginTop: 30,
        marginBottom: 15,
        borderRadius: 25,
        padding: 2, 
    },
    editButtonInner: {
        backgroundColor: '#fff', 
        borderRadius: 23,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 13,
    },
    buttonText: {
        color: '#1e1e1e', 
        fontSize: 16,
        fontWeight: 'bold',
    },
    removeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        marginBottom: 30,
        borderRadius: 25,
    },
    removeButtonText: {
        color: '#FF5252',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

type IconName = keyof typeof Ionicons.glyphMap;

const getCategoryIcon = (category: string): { name: IconName; color: string } => {
    switch (category) {
        case 'Streaming': return { name: 'tv-outline', color: '#03A9F4' };
        case 'Música': return { name: 'musical-notes-outline', color: '#FF9800' };
        case 'Software': return { name: 'code-slash-outline', color: '#8B5CF6' };
        case 'Educação': return { name: 'book-outline', color: '#4eefa4ff' };
        default: return { name: 'cube-outline', color: '#ccc' };
    }
};

type RootStackParamList = {
    DetalhesAssinaturas: { subscriptionId: string };
};
type DetalhesAssinaturasRouteProp = RouteProp<RootStackParamList, 'DetalhesAssinaturas'>;

const DetalhesAssinaturas: React.FC = () => {
    const route = useRoute<DetalhesAssinaturasRouteProp>();
    const navigation = useNavigation();
    const { subscriptionId } = route.params;

    const { subscriptions, isLoading, remove, pay } = useSubscriptions();
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    useEffect(() => {
        if (!isLoading) {
            const foundSub = subscriptions.find(sub => sub.id === subscriptionId);
            setSubscription(foundSub || null);

            if (!foundSub) {
                Alert.alert("Erro", "Assinatura não encontrada.");
                navigation.goBack();
            }
        }
    }, [subscriptions, subscriptionId, isLoading, navigation]);

    const handleEdit = () => {
        navigation.navigate('EdicaoAssinaturas' as never, { subscriptionId } as never);
    };

    const handlePay = async () => {
        if (!subscription) return;
        try {
            await pay(subscription.id);
            Alert.alert("Sucesso", "Pagamento registrado!");
        } catch (error) {
            Alert.alert("Erro", "Não foi possível registrar o pagamento.");
        }
    };

    const handleRemove = () => {
        if (!subscription) return;
        Alert.alert(
            "Inativar Assinatura",
            `Tem certeza que deseja inativar "${subscription.name}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Inativar",
                    onPress: async () => {
                        try {
                            await remove(subscription.id);
                            navigation.goBack();
                        } catch {
                            Alert.alert("Erro", "Não foi possível remover.");
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    if (isLoading || !subscription) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8B5CF6" />
            </View>
        );
    }

    const categoryInfo = getCategoryIcon(subscription.category);
    const formattedDate = new Date(subscription.firstChargeDate).toLocaleDateString('pt-BR');
    const formattedValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subscription.value);

    return (
        <ScrollView style={styles.container}>
            <LinearGradient
                colors={['#FF9800', '#8B5CF6', '#03A9F4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBorder}
            >
                <View style={styles.headerCard}>
                    <Ionicons name={categoryInfo.name} size={40} color={categoryInfo.color} />
                    <Text style={styles.headerName}>{subscription.name}</Text>
                    <Text style={styles.headerValue}>{formattedValue} / {subscription.recurrence}</Text>
                </View>
            </LinearGradient>

            <Text style={styles.headerDetail}>Detalhes</Text>
            <DetailItem title="Próxima Cobrança" value={formattedDate} icon="calendar-outline" />
            <DetailItem title="Forma de Pagamento" value={subscription.paymentMethod || 'Cartão'} icon="card-outline" />

            <View style={styles.statusItem}>
                <View style={styles.statusTextContainer}>
                    <Text style={styles.textStatusLabel}>Fatura Atual</Text>
                    <Text style={styles.textStatusPreco}>{formattedValue}</Text>
                </View>
                <TouchableOpacity onPress={handlePay}>
                    <LinearGradient
                        colors={['#FF9800', '#A16AE8', '#03A9F4']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.payButtonGradient}
                    >
                        <Text style={styles.payButtonText}>Fatura Paga</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleEdit}>
                <LinearGradient
                    colors={['#FF9800', '#8B5CF6', '#03A9F4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.editButtonWrapper}
                >
                    <View style={styles.editButtonInner}>
                        <Ionicons name="pencil-outline" size={20} color="#8B5CF6" style={{ marginRight: 10 }} />
                        <Text style={styles.buttonText}>EDITAR ASSINATURA</Text>
                    </View>
                </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
                <Ionicons name="trash-outline" size={20} color="#FF5252" style={{ marginRight: 10 }} />
                <Text style={styles.removeButtonText}>REMOVER ASSINATURA</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

// Componente Auxiliar DetailItem
const DetailItem: React.FC<DetailItemProps> = ({ title, value, icon, iconColor, isMultiline }) => (
    <View style={isMultiline ? styles.detailCardMultiline : styles.detailCard}>
        <View style={styles.detailTitleRow}>
            <Ionicons name={icon} size={20} color={iconColor || "#8B5CF6"} />
            <Text style={styles.detailTitle}>{title}</Text>
        </View>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

interface DetailItemProps {
    title: string;
    value: string;
    icon: IconName;
    iconColor?: string;
    isMultiline?: boolean;
}

export default DetalhesAssinaturas;