import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSubscriptions } from '../context/SubscriptionContext';
import { Subscription } from '../types/Subscription';
import { useTheme } from '../context/ThemeContext';

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
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
    color: theme.textSecondary,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: theme.surface,
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textDetails: {
    flex: 1, 
    marginRight: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
  },
  itemRecurrence: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 2,
  },
  itemValue: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textSecondary,
    marginTop: 4,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradientContainer: {
    borderRadius: 25,
    overflow: 'hidden',
    marginRight: 8,
  },
  reactivateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10, 
    paddingHorizontal: 18, 
    justifyContent: 'center',
  },
  reactivateButtonText: {
    marginLeft: 4,
    color: '#fff',
    fontWeight: '600',
    fontSize: 16, 
  },
  deleteButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF5252',
  },
});

const InactiveSubscriptionItem: React.FC<{
  item: Subscription;
  onReactivate: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  theme: any; // Recebe o tema por prop ou via hook interno
}> = ({ item, onReactivate, onDelete, theme }) => {
  
  const styles = createStyles(theme); // Gera os estilos para este item

  const handleReactivate = () => {
    Alert.alert("Reativar", `Deseja reativar "${item.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Sim", onPress: () => onReactivate(item.id) }
    ]);
  };

  const handleDelete = () => {
    Alert.alert("⚠️ Excluir Permanentemente", `Apagar "${item.name}"? Esta ação é irreversível.`, [
      { text: "Cancelar", style: "cancel" },
      { text: "EXCLUIR", onPress: () => onDelete(item.id), style: 'destructive' }
    ]);
  };

  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(item.value);

  return (
    <View style={styles.itemContainer}>
      <View style={styles.textDetails}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemRecurrence}>{item.recurrence}</Text>
        <Text style={styles.itemValue}>{formattedValue}</Text>
      </View>
      
      <View style={styles.rightActions}>
        <LinearGradient
          colors={['#FF9800', '#8B5CF6', '#03A9F4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientContainer}
        >
          <TouchableOpacity style={styles.reactivateButton} onPress={handleReactivate}>
            <MaterialIcons name="u-turn-right" color="#fff" size={18} style={{ transform: [{ rotate: '-90deg' }] }} />
            <Text style={styles.reactivateButtonText}>Reativar</Text>
          </TouchableOpacity>
        </LinearGradient>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={18} color="#FF5252" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AssinaturasInativas: React.FC = () => {
  const { inactiveSubscriptions, isLoading, reactivate, removeDefinitive } = useSubscriptions();
  const { theme } = useTheme();
  const styles = createStyles(theme); 

  const handleReactivateSubscription = async (id: string) => {
    try {
      await reactivate(id);
      Alert.alert("Sucesso", "Assinatura reativada!");
    } catch {
      Alert.alert("Erro", "Falha ao reativar.");
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    try {
      await removeDefinitive(id);
      Alert.alert("Excluído", "Removido permanentemente.");
    } catch {
      Alert.alert("Erro", "Falha ao excluir.");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: theme.text }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {inactiveSubscriptions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-circle-outline" size={60} color={theme.textSecondary} />
          <Text style={styles.emptyText}>Nenhuma assinatura inativa.</Text>
        </View>
      ) : (
        <FlatList
          data={inactiveSubscriptions}
          renderItem={({ item }) => (
            <InactiveSubscriptionItem 
              item={item} 
              onReactivate={handleReactivateSubscription}
              onDelete={handleDeleteSubscription}
              theme={theme}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

export default AssinaturasInativas;