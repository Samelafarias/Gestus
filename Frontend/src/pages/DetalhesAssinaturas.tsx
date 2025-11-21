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
    headerCard: {
        backgroundColor: '#282828',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    headerName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    headerValue: {
        fontSize: 18,
        color: '#fff', 
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
        flexShrink: 1, 
    },
    editButtonContainer: {
        borderRadius: 25,
        overflow: 'hidden',
        marginTop: 30,
        marginBottom: 15,
    },
    editButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
    },
    buttonText: {
        color: '#fff',
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

type RootStackParamList = {
    DetalhesAssinaturas: { subscriptionId: string };
};
type DetalhesAssinaturasRouteProp = RouteProp<RootStackParamList, 'DetalhesAssinaturas'>;

const DetalhesAssinaturas: React.FC = () => {
    const route = useRoute<DetalhesAssinaturasRouteProp>();
    const navigation = useNavigation();
    const { subscriptionId } = route.params;

    const { subscriptions, isLoading, remove } = useSubscriptions();
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    useEffect(() => {
        if (!isLoading) {
            const foundSub = subscriptions.find(sub => sub.id === subscriptionId);
            setSubscription(foundSub || null);
            
            if (!foundSub) {
                Alert.alert("Erro", "Assinatura não encontrada ou removida.");
                navigation.goBack();
            }
        }
    }, [subscriptions, subscriptionId, isLoading, navigation]);

    const handleEdit = () => {
        navigation.navigate('EdicaoAssinaturas' as never, { subscriptionId: subscriptionId } as never);
    };

    const handleRemove = () => {
        if (!subscription) return;
        
        Alert.alert(
            "Inativar Assinatura",
            `Tem certeza que deseja inativar a assinatura "${subscription.name}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Inativar",
                    onPress: async () => {
                        try {
                            await remove(subscription.id);
                            Alert.alert("Sucesso", `${subscription.name} foi inativada.`);
                            navigation.goBack(); 
                        } catch (error) {
                            Alert.alert("Erro", "Não foi possível inativar a assinatura.");
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
                <Text style={styles.loadingText}>Carregando detalhes...</Text>
            </View>
        );
    }
    
    const formattedDate = subscription.firstChargeDate.toLocaleDateString('pt-BR');
    const formattedValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subscription.value);

    return (
        <ScrollView style={styles.container}>
            
            <View style={styles.headerCard}>
                <Text style={styles.headerName}>{subscription.name}</Text>
                <Text style={styles.headerValue}>
                    {formattedValue} / {subscription.recurrence}
                </Text>
            </View>

            <DetailItem title="Próxima Cobrança" value={formattedDate} icon="calendar-outline" />
            <DetailItem title="Categoria" value={subscription.category} icon="bookmark-outline" />
            <DetailItem 
                title="Forma de Pagamento" 
                value={subscription.paymentMethod || 'Não informada'} 
                icon="card-outline" 
            />
            <DetailItem 
                title="Início da Cobrança" 
                value={formattedDate} 
                icon="time-outline" 
            />

            <TouchableOpacity onPress={handleEdit} style={styles.editButtonContainer}>
                <LinearGradient
                    colors={['#FF9800', '#8B5CF6', '#03A9F4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.editButtonGradient}
                >
                    <Ionicons name="pencil-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
                    <Text style={styles.buttonText}>EDITAR ASSINATURA</Text>
                </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
                <Ionicons name="trash-outline" size={20} color="#FF5252" style={{ marginRight: 10 }} />
                <Text style={styles.removeButtonText}>REMOVER ASSINATURA</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

interface DetailItemProps {
    title: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
    isMultiline?: boolean;
}

const DetailItem: React.FC<DetailItemProps> = ({ title, value, icon, isMultiline }) => (
    <View style={isMultiline ? styles.detailCardMultiline : styles.detailCard}>
        <View style={styles.detailTitleRow}>
            <Ionicons name={icon} size={20} color="#8B5CF6" />
            <Text style={styles.detailTitle}>{title}</Text>
        </View>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);



export default DetalhesAssinaturas;