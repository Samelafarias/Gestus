import React from 'react';
import { View,Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e', 
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
  },
  titleitem:{
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
    marginLeft: 10, 
  },
  subtitleitem: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10, 
  },
  card:{
    width: "90%",
    backgroundColor: "#212529",
    padding: 14,
    marginBottom:10,
    borderRadius: 15,
    borderBottomWidth: 2,   
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,      
    borderColor: '#adabab2e',  
    borderStyle: 'solid',
  },
  itemCard: {
    width: "100%",
    backgroundColor: "#121E36",
    padding: 14,
    marginBottom:10,
    borderRadius: 15,
    borderBottomWidth: 2,   
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,      
    borderColor: '#adabab2e',  
    borderStyle: 'solid',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center', 
  },
  textWrapper: {
    flex: 1, 
  }
});

const SobrePage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Sobre o app</Text>
        <Text style={styles.subtitle}>
          Gestus foi criado para ajudá-lo a gerenciar suas assinaturas, acompanhar seus gastos e ter controle total de seus serviços ativos. Nossa missão é fornecer uma ferramenta simples e segura para sua vida financeira. 
        </Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.title}>Política de Dados e Locias</Text>
        <Text style={styles.subtitle}>
          Sua privacidade é nossa prioridade. Todos os dados que você insere no Gestus, como assinaturas e informações de pagamento, são armazenados exclusivamente no seu dispositivo. Nenhuma informação pessoal é coletada ou enviada para servidores externos.
        </Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.title}>Contato</Text>

        <View style={styles.itemCard}>
          <View style={styles.row}>
            <Ionicons name="mail-outline" size={30} color="#2B4A89" /> 
            <View style={styles.textWrapper}>
              <Text style={styles.titleitem}>Enviar email</Text>
              <Text style={styles.subtitleitem}>suporte@gestus.app</Text>
            </View>
          </View>
        </View>
        <View style={styles.itemCard}>
          <View style={styles.row}>
            <Ionicons name="globe-outline" size={30} color="#2B4A89" /> 
               <View style={styles.textWrapper}>
              <Text style={styles.titleitem}>Acesse nosso site</Text>
              <Text style={styles.subtitleitem}>gestus.app</Text>
            </View>
          </View>
        </View>
        
      </View>
    </View>
  );
};

export default SobrePage;