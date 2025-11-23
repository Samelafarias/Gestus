import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
    backgroundColor: '#1e1e1e', 
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', 
    marginBottom: 20,
    textAlign: 'center',
  },
  actionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#282828',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
  },
  actionText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 15,
    fontWeight: '600',
  }
});

const ConfiguracoesPage = () => {
  const navigation = useNavigation();

  const handleNavigateToEditData = () => {
    navigation.navigate('EditarCadastro' as never);
  };
  
  const handleNavigateToSetGoals = () => {
    navigation.navigate('DefinirMetas' as never);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity 
        style={styles.actionCard} 
        onPress={handleNavigateToEditData}
      >
        <View style={styles.actionRow}>
            <Ionicons name="people-outline" size={24} color="#8B5CF6" />
            <Text style={styles.actionText}>Editar Dados de Cadastro</Text>
        </View>
        <Ionicons name="pencil-outline" size={24} color="#ccc" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.actionCard} 
        onPress={handleNavigateToSetGoals}
      >
        <View style={styles.actionRow}>
            <Ionicons name="cash-outline" size={24} color="#3adc90ff" />
            <Text style={styles.actionText}>Definir Metas de Gastos</Text>
        </View>
      </TouchableOpacity>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
};



export default ConfiguracoesPage;