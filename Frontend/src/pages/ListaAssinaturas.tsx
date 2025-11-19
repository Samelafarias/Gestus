import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AddButton from '../components/AddButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
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
      <AddButton />
    </View>
  );
};

export default ListaAssinaturas;