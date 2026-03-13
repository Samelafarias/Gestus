import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext'; 

const SobrePage = () => {
  const { theme } = useTheme();

  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
      backgroundColor: theme.background, 
    },
    card: {
      width: "90%",
      padding: 16,
      marginBottom: 15,
      borderRadius: 15,
      borderWidth: 1,      
      borderColor: theme.border, 
      backgroundColor: theme.surface, 
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.isDark ? 0 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    itemCard: {
      width: "100%",
      padding: 14,
      marginTop: 10,
      borderRadius: 12,
      borderWidth: 1,      
      // Ajuste crucial: Fundo escuro no dark e cinza claro no light
      backgroundColor: theme.isDark ? "#2A2A2A" : "#E8E8E8", 
      borderColor: theme.border,
      borderStyle: 'solid',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: theme.text, 
    },
    subtitle: {
      fontSize: 16,
      lineHeight: 22,
      color: theme.text,
      opacity: 0.9,
    },
    titleitem: {
      fontWeight: 'bold',
      fontSize: 16,
      marginLeft: 12, 
      color: theme.text,
    },
    subtitleitem: {
      fontSize: 14,
      marginLeft: 12, 
      color: theme.text,
      opacity: 0.7,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center', 
    },
    textWrapper: {
      flex: 1, 
    }
  }), [theme]); 

  return (
    <ScrollView contentContainerStyle={dynamicStyles.container} showsVerticalScrollIndicator={false}>
      <View style={dynamicStyles.card}>
        <Text style={dynamicStyles.title}>Sobre o app</Text>
        <Text style={dynamicStyles.subtitle}>
          Gestus foi criado para ajudá-lo a gerenciar suas assinaturas, acompanhar seus gastos e ter controle total de seus serviços ativos. Nossa missão é fornecer uma ferramenta simples e segura para sua vida financeira. 
        </Text>
      </View>
      
      <View style={dynamicStyles.card}>
        <Text style={dynamicStyles.title}>Política de Dados e Locais</Text>
        <Text style={dynamicStyles.subtitle}>
          Sua privacidade é nossa prioridade. Todos os dados que você insere no Gestus, como assinaturas e informações de pagamento, são armazenados com segurança no seu dispositivo.
        </Text>
      </View>
      
      <View style={dynamicStyles.card}>
        <Text style={dynamicStyles.title}>Contato</Text>

        <View style={dynamicStyles.itemCard}>
          <View style={dynamicStyles.row}>
            <Ionicons name="mail-outline" size={26} color={theme.primary} /> 
            <View style={dynamicStyles.textWrapper}>
              <Text style={dynamicStyles.titleitem}>Enviar email</Text>
              <Text style={dynamicStyles.subtitleitem}>suporte@gestus.app</Text>
            </View>
          </View>
        </View>

        <View style={dynamicStyles.itemCard}>
          <View style={dynamicStyles.row}>
            <Ionicons name="globe-outline" size={26} color={theme.primary} /> 
            <View style={dynamicStyles.textWrapper}>
              <Text style={dynamicStyles.titleitem}>Acesse nosso site</Text>
              <Text style={dynamicStyles.subtitleitem}>gestus.app</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SobrePage;