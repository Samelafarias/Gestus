import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext'; 

const ConfiguracoesPage = () => {
  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme();

  // useMemo garante que os estilos só sejam recalculados quando o tema mudar
  const styles = useMemo(() => StyleSheet.create({
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
  }), [theme]); // Só recalcula se 'theme' mudar

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.actionCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Ionicons 
            name={theme.isDark ? "moon-outline" : "sunny-outline"} 
            size={24} 
            color={theme.primary} 
          />
          <Text style={styles.actionText}>Modo Escuro</Text>
        </View>
        <Switch 
          value={theme.isDark} 
          onValueChange={toggleTheme}
          trackColor={{ false: "#767577", true: theme.primary }}
          thumbColor="#f4f3f4"
        />
      </View>

      <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('EditarCadastro')}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Ionicons name="people-outline" size={24} color={theme.primary} />
            <Text style={styles.actionText}>Editar Dados de Cadastro</Text>
        </View>
        <Ionicons name="pencil-outline" size={24} color={theme.text} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('DefinirMetas')}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Ionicons name="cash-outline" size={24} color={theme.primary} />
            <Text style={styles.actionText}>Definir Metas de Gastos</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ConfiguracoesPage;