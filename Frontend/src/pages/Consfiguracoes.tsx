import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext'; 

const ConfiguracoesPage = () => {
  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme(); // Consome o tema atual e a função de troca

  const handleNavigateToEditData = () => {
    navigation.navigate('EditarCadastro' as never);
  };
  
  const handleNavigateToSetGoals = () => {
    navigation.navigate('DefinirMetas' as never);
  };

  // Estilos dinâmicos baseados no tema
  const dynamicStyles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 15,
      backgroundColor: theme.background, 
    },
    actionCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.surface,
      padding: 20,
      borderRadius: 10,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },
    actionText: {
      fontSize: 16,
      color: theme.text,
      marginLeft: 15,
      fontWeight: '600',
    }
  });

  return (
    <ScrollView contentContainerStyle={dynamicStyles.container}>
      {/* Card de Alternar Tema */}
      <View style={dynamicStyles.actionCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Ionicons 
            name={theme.isDark ? "moon-outline" : "sunny-outline"} 
            size={24} 
            color={theme.primary} 
          />
          <Text style={dynamicStyles.actionText}>Modo Escuro</Text>
        </View>
        <Switch 
          value={theme.isDark} 
          onValueChange={toggleTheme}
          trackColor={{ false: "#767577", true: theme.primary }}
          thumbColor={theme.isDark ? "#f4f3f4" : "#f4f3f4"}
        />
      </View>

      <TouchableOpacity style={dynamicStyles.actionCard} onPress={handleNavigateToEditData}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Ionicons name="people-outline" size={24} color={theme.primary} />
            <Text style={dynamicStyles.actionText}>Editar Dados de Cadastro</Text>
        </View>
        <Ionicons name="pencil-outline" size={24} color={theme.textSecondary} />
      </TouchableOpacity>
      
      <TouchableOpacity style={dynamicStyles.actionCard} onPress={handleNavigateToSetGoals}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Ionicons name="cash-outline" size={24} color={theme.secondary} />
            <Text style={dynamicStyles.actionText}>Definir Metas de Gastos</Text>
        </View>
      </TouchableOpacity>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

export default ConfiguracoesPage;