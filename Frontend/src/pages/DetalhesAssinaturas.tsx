import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSubscriptions } from '../context/SubscriptionContext';
import { useTheme } from '../context/ThemeContext'; 
import { Subscription } from '../types/Subscription';
import { ModalSuccess } from '../components/ModalSuccess';
import { ModalError } from '../components/ModalError';

const DetalhesAssinaturas: React.FC = () => {
    const route = useRoute<DetalhesAssinaturasRouteProp>();
    const navigation = useNavigation();
    const { subscriptionId } = route.params;

    const { subscriptions, isLoading, remove, pay } = useSubscriptions();
    const { theme } = useTheme(); 
    
    // Verificação de tema baseada na propriedade isDark do seu ThemeContext
    const isDark = theme.isDark; 

    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

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

    const handlePay = async () => {
        if (!subscription) return;
        try {
            await pay(subscription.id);
            setShowSuccess(true);
        } catch (error) {
            setShowError(true);
        }
    };

    const handleEdit = () => {
        navigation.navigate('EdicaoAssinaturas' as never, { subscriptionId } as never);
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
            <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color="#8B5CF6" />
            </View>
        );
    }

    const categoryInfo = getCategoryIcon(subscription.category);
    const formattedDate = new Date(subscription.firstChargeDate).toLocaleDateString('pt-BR');
    const formattedValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subscription.value);

    // Definição de cores dinâmicas para os cards
    const cardColor = theme.surface;
    const borderColor = theme.border;
    const secondaryTextColor = isDark ? '#bbb' : '#666';

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}> 
            <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
                <LinearGradient
                    colors={['#FF9800', '#8B5CF6', '#03A9F4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientBorder}
                >
                    <View style={[styles.headerCard, { backgroundColor: cardColor }]}>
                        <Ionicons name={categoryInfo.name} size={40} color={categoryInfo.color} />
                        <Text style={[styles.headerName, { color: theme.text }]}>{subscription.name}</Text>
                        <Text style={[styles.headerValue, { color: theme.text }]}>{formattedValue} / {subscription.recurrence}</Text>
                    </View>
                </LinearGradient>

                <Text style={[styles.headerDetail, { color: theme.text }]}>Detalhes</Text>
                
                <DetailItem 
                    title="Categoria" 
                    value={subscription.category} 
                    icon={categoryInfo.name} 
                    iconColor="#8B5CF6"
                    theme={theme}
                    isDark={isDark}
                />
                <DetailItem 
                    title="Próxima Cobrança" 
                    value={formattedDate} 
                    icon="calendar-outline" 
                    theme={theme}
                    isDark={isDark}
                />
                
                <DetailItem 
                    title="Notas" 
                    value={subscription.notes || "Nenhuma observação."} 
                    icon="document-text-outline" 
                    isMultiline={true} 
                    theme={theme}
                    isDark={isDark}
                />

                <Text style={[styles.headerDetail, { color: theme.text }]}>Status do Pagamento</Text>
                <View style={[styles.statusItem, { backgroundColor: cardColor, borderColor: borderColor }]}>
                    <View style={styles.statusTextContainer}>
                        <Text style={[styles.textStatusLabel, { color: theme.text }]}>Fatura Atual</Text>
                        <Text style={[styles.textStatusPreco, { color: theme.text }]}>{formattedValue}</Text>
                        <Text style={[styles.textStatusVencimento, { color: secondaryTextColor }]}>Vence em {formattedDate}</Text>
                    </View>
                    <TouchableOpacity onPress={handlePay}>
                        <LinearGradient
                            colors={['#FF9800', '#A16AE8', '#03A9F4']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.payButtonGradient}
                        >
                            <Text style={styles.payButtonText}>Marcar como Paga</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* BOTÃO EDITAR CORRIGIDO: Usa theme.surface para o fundo e theme.text para o conteúdo no modo claro */}
                <TouchableOpacity onPress={handleEdit}>
                    <LinearGradient
                        colors={['#FF9800', '#8B5CF6', '#03A9F4']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.editButtonWrapper}
                    >
                        <View style={[styles.editButtonInner, { backgroundColor: theme.surface }]}>
                            <Ionicons name="pencil-outline" size={20} color={theme.text} style={{ marginRight: 10 }} />
                            <Text style={[styles.buttonText, { color: theme.text }]}>EDITAR ASSINATURA</Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
                    <Ionicons name="trash-outline" size={20} color="#FF5252" style={{ marginRight: 10 }} />
                    <Text style={styles.removeButtonText}>REMOVER ASSINATURA</Text>
                </TouchableOpacity>
            </ScrollView>

            <ModalSuccess visible={showSuccess} onClose={() => setShowSuccess(false)} />
            <ModalError visible={showError} onClose={() => setShowError(false)} />
        </View>
    );
};

// Componente DetailItem atualizado para usar o theme.surface e theme.border consistentes
const DetailItem: React.FC<DetailItemProps & { theme: any, isDark: boolean }> = ({ title, value, icon, iconColor, isMultiline, theme, isDark }) => {
    return (
        <View style={[
            isMultiline ? styles.detailCardMultiline : styles.detailCard,
            { 
                backgroundColor: theme.surface,
                borderColor: theme.border
            }
        ]}>
            <View style={styles.detailTitleRow}>
                <Ionicons name={icon} size={20} color={iconColor || "#8B5CF6"} />
                <Text style={[styles.detailTitle, { color: isDark ? '#bbb' : '#666' }]}>{title}</Text>
            </View>
            <Text style={[styles.detailValue, { color: theme.text }]}>{value}</Text>
        </View>
    );
};

// Estilos e Tipagens auxiliares permanecem iguais...
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 15 
    },
    loadingContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    gradientBorder: { 
        padding: 2.5, 
        borderRadius: 13, 
        marginBottom: 15 
    },
    headerCard: { 
        padding: 20, 
        borderRadius: 10, 
        alignItems: 'center' 
    },
    headerName: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginTop: 10, 
        marginBottom: 5 
    },
    headerValue: { 
        fontSize: 18, 
        fontWeight: '600' 
    },
    headerDetail: { 
        fontSize: 18, 
        fontWeight: '600', 
        marginBottom: 15, 
        marginTop: 20 
    },
    statusItem: { 
        padding: 20, 
        borderRadius: 20,
         marginBottom: 15, 
         borderWidth: 1, 
         flexDirection: 'row', 
         justifyContent: 'space-between', 
         alignItems: 'center' 
        },
    statusTextContainer: { 
        flex: 1 
    },
    textStatusLabel: { 
        fontSize: 16, 
        marginBottom: 5 
    },
    textStatusPreco: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        marginBottom: 5 },
    textStatusVencimento: { 
        fontSize: 14 
    },
    payButtonGradient: { 
        borderRadius: 30, 
        paddingVertical: 12, 
        paddingHorizontal: 20, 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    payButtonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: '600' 
    },
    detailCard: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 10, 
        borderWidth: 1 
    },
    detailCardMultiline: { 
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 10, 
        borderWidth: 1 
    },
    detailTitleRow: { 
        flexDirection: 'row',
        alignItems: 'center' 
    },
    detailTitle: { 
        fontSize: 14, 
        marginLeft: 10, 
        fontWeight: 'bold' 
    },
    detailValue: { 
        fontSize: 16, 
        marginTop: 5 
    },
    editButtonWrapper: { 
        marginTop: 30, 
        marginBottom: 15, 
        borderRadius: 25, 
        padding: 2 
    },
    editButtonInner: { 
        borderRadius: 23, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: 13 
    },
    buttonText: { 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    removeButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: 15, 
        marginBottom: 30, 
        borderRadius: 25 
    },
    removeButtonText: { 
        color: '#FF5252', 
        fontSize: 16,
        fontWeight: 'bold' 
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

interface DetailItemProps {
    title: string;
    value: string;
    icon: IconName;
    iconColor?: string;
    isMultiline?: boolean;
}

export default DetalhesAssinaturas;