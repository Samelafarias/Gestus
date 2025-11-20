import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient';
import { useSubscriptions } from '../context/SubscriptionContext';
import { Subscription } from '../types/Subscription';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1e1e1e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20, 
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#adabab2e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  textDetails: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemRecurrence: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 2,
  },
  itemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ccc',
    marginTop: 4,
  },
    gradientContainer: {
    borderRadius: 20, 
    overflow: 'hidden', 
  },
  reactivateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
  },
  reactivateButtonText: {
    marginLeft: 5,
    color: '#fff', 
    fontWeight: '600',
  }
});

interface Props {

}

interface InactiveSubscriptionItemProps {
  item: Subscription;
  onReactivate: (id: string) => Promise<void>;
}

const InactiveSubscriptionItem: React.FC<InactiveSubscriptionItemProps> = ({ item, onReactivate }) => {
  
  const handleReactivate = () => {
    Alert.alert(
      "Reativar Assinatura",
      `Tem certeza que deseja reativar a assinatura "${item.name}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Reativar", 
          onPress: () => onReactivate(item.id),
          style: 'destructive' 
        }
      ]
    );
  };
  
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(item.value);


  const itemColor = '#1e1e1e'; 

  return (
    <View style={[styles.itemContainer, { backgroundColor: itemColor }]}>
      <View style={styles.textDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemRecurrence}>{item.recurrence}</Text>
        <Text style={styles.itemValue}>{formattedValue}</Text>
      </View>
      
      <LinearGradient
        colors={['#FF9800', '#8B5CF6', '#03A9F4']} 
        start={{ x: 0, y: 0.5 }} 
        end={{ x: 1, y: 0.5 }}   
        style={styles.gradientContainer} >
        <TouchableOpacity 
          style={styles.reactivateButton} 
          onPress={handleReactivate}>
          <Ionicons name="reload-circle-outline" size={24} color="#fff" />
          <Text style={styles.reactivateButtonText}>Reativar</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};


const AssinaturasInativas: React.FC<Props> = () => {
  const { inactiveSubscriptions, isLoading, reactivate } = useSubscriptions();
  const handleReactivateSubscription = async (id: string) => {
    try {
      await reactivate(id);
      Alert.alert("Sucesso", "Assinatura reativada com sucesso!");
    } catch (error) {
      console.error("Erro ao reativar:", error);
      Alert.alert("Erro", "Não foi possível reativar a assinatura. Tente novamente.");
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando assinaturas inativas...</Text>
      </View>
    );
  }
  
  const renderItem = ({ item }: { item: Subscription }) => (
    <InactiveSubscriptionItem item={item} onReactivate={handleReactivateSubscription} />
  );

  return (
    <View style={styles.container}>      
      {inactiveSubscriptions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-circle-outline" size={60} color="#666" />
          <Text style={styles.emptyText}>Parabéns! Você não possui assinaturas inativas no momento.</Text>
        </View>
      ) : (
        <FlatList
          data={inactiveSubscriptions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};


export default AssinaturasInativas;