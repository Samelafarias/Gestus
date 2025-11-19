import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

const ListaAssinaturas = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
       Suas assinaturas 📝
      </Text>
      <Text style={styles.subtitle}>
        Página Assinaturas Carregada com Sucesso.
      </Text>
    </View>
  );
};

export default ListaAssinaturas;