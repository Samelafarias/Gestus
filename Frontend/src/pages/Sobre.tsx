import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext'; // Importando o hook de tema

const SobrePage = () => {
  const { theme } = useTheme(); // Consumindo o tema atual

  // Definição de estilos dinâmicos
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background, // Fundo dinâmico
    },
    scrollContent: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: theme.text, // Texto principal dinâmico
    },
    subtitle: {
      fontSize: 15,
      color: theme.textSecondary, // Texto secundário dinâmico
      lineHeight: 22,
    },
    card: {
      width: "92%",
      backgroundColor: theme.surface, // Cor do card dinâmica
      padding: 18,
      marginBottom: 15,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: theme.border, // Borda dinâmica
    },
    itemCard: {
      width: "100%",
      backgroundColor: theme.isDark ? "#121E36" : "#e8efff", // Tom de azul que varia com o tema
      padding: 14,
      marginTop: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center', 
    },
    textWrapper: {
      flex: 1, 
      marginLeft: 12,
    },
    titleitem: {
      fontWeight: 'bold',
      fontSize: 16,
      color: theme.text,
    },
    subtitleitem: {
      fontSize: 14,
      color: theme.primary, // Destaque para links/contato
    },
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.title}>Sobre o app</Text>
        <Text style={styles.subtitle}>
          Gestus foi criado para ajudá-lo a gerenciar suas assinaturas, acompanhar seus gastos e ter controle total de seus serviços ativos. Nossa missão é fornecer uma ferramenta simples e segura para sua vida financeira. 
        </Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.title}>Política de Dados Locais</Text>
        <Text style={styles.subtitle}>
          Sua privacidade é nossa prioridade. Todos os dados que você insere no Gestus, como assinaturas e informações de pagamento, são armazenados exclusivamente no seu dispositivo. Nenhuma informação pessoal é coletada ou enviada para servidores externos.
        </Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.title}>Contato</Text>

        <View style={styles.itemCard}>
          <View style={styles.row}>
            <Ionicons name="mail-outline" size={28} color={theme.primary} /> 
            <View style={styles.textWrapper}>
              <Text style={styles.titleitem}>Enviar email</Text>
              <Text style={styles.subtitleitem}>suporte@gestus.app</Text>
            </View>
          </View>
        </View>

        <View style={styles.itemCard}>
          <View style={styles.row}>
            <Ionicons name="globe-outline" size={28} color={theme.primary} /> 
            <View style={styles.textWrapper}>
              <Text style={styles.titleitem}>Acesse nosso site</Text>
              <Text style={styles.subtitleitem}>gestus.app</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SobrePage;