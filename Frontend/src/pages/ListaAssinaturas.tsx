import React from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AddButton from '../components/AddButton';
import { useSubscriptions } from '../context/SubscriptionContext'; 
import { Subscription } from '../types/Subscription'; 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e',
        paddingHorizontal: 15,
        paddingTop: 15,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
    },
    listContent: {
        paddingBottom: 100,
    },
    loadingText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 50,
    },
    emptyText: {
        color: '#ccc',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 50,
    }
});

const cardStyles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#282828',
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#adabab2e',
        borderLeftWidth: 2, 
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderBottomWidth: 2,
    },
    detailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconWrapper: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e1e1e', 
        marginRight: 15,
        borderWidth: 1,
    },
    textContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    nameText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    nextChargeText: {
        fontSize: 12,
        color: '#aaa',
        marginTop: 2,
    },
    actionsContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    valueText: {
        fontSize: 16,
        color: '#FFF', 
        fontWeight: '600',
        marginBottom: 5,
    },
    actionButtons: {
        flexDirection: 'row',
    },
    actionButton: {
        marginLeft: 10,
        padding: 4,
    }
});


const getCategoryIcon = (category: Subscription['category'] | string) => {
    switch (category) {
        case 'Streaming':
            return { name: 'tv-outline', color: '#03A9F4' };
        case 'Música':
            return { name: 'musical-notes-outline', color: '#FF9800' };
        case 'Software':
            return { name: 'code-slash-outline', color: '#8B5CF6' };
        case 'Educação':
            return { name: 'book-outline', color: '#4eefa4ff' };
        case 'Outros':
        default:
            return { name: 'cube-outline', color: '#ccc' };
    }
};

interface SubscriptionCardProps {
    subscription: Subscription;
}


const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription }) => {
    const navigation = useNavigation();
    const { remove } = useSubscriptions(); 
    const nextChargeDate = subscription.firstChargeDate;
    const formattedDate = nextChargeDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
    const formattedValue = subscription.value.toFixed(2).replace('.', ',');
    const { name: iconName, color: iconColor } = getCategoryIcon(subscription.category);

    const handleRemove = () => {
        Alert.alert(
            "Inativar Assinatura",
            `Tem certeza que deseja inativar a assinatura "${subscription.name}"?`,
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Inativar",
                    onPress: async () => {
                        try {
                            await remove(subscription.id);
                            Alert.alert("Sucesso", `${subscription.name} foi inativada.`);
                        } catch (error) {
                            Alert.alert("Erro", "Não foi possível inativar a assinatura.");
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

   const handleEdit = () => {
        navigation.navigate('EdicaoAssinaturas' as never, { subscriptionId: subscription.id } as never); 
    };

    return (
        <View style={cardStyles.card}>
            <View style={cardStyles.detailsContainer}>
                <View style={[cardStyles.iconWrapper, { borderColor: iconColor }]}>
                    <Ionicons name={iconName} size={30} color={iconColor} />
                </View>

                <View style={cardStyles.textContainer}>
                    <Text style={cardStyles.nameText}>{subscription.name}</Text>
                    <Text style={cardStyles.nextChargeText}>
                       Próximo pagamento em {formattedDate}
                    </Text>
                </View>
            </View>

            <View style={cardStyles.actionsContainer}>
                <Text style={cardStyles.valueText}>R$ {formattedValue}</Text>
                
                <View style={cardStyles.actionButtons}>

                    <TouchableOpacity onPress={handleEdit} style={cardStyles.actionButton}>
                        <Ionicons name="pencil-outline" size={20} color="#8B5CF6" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={handleRemove} style={cardStyles.actionButton}>
                        <Ionicons name="trash-outline" size={20} color="#FF9800" /> 
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};


const ListaAssinaturas = () => {
    const { activeSubscriptions, isLoading } = useSubscriptions(); 

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Carregando assinaturas...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Minhas Assinaturas</Text>
            
            {activeSubscriptions.length === 0 ? (
                <Text style={styles.emptyText}>Você ainda não tem assinaturas ativas. Adicione uma para começar!</Text>
            ) : (
                <FlatList
                    data={activeSubscriptions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <SubscriptionCard subscription={item} />}
                    contentContainerStyle={styles.listContent}
                />
            )}

            <AddButton />
        </View>
    );
};

export default ListaAssinaturas;