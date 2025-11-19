import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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

const AssinaturasInativas = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Hello World! 🌎
      </Text>
      <Text style={styles.subtitle}>
        Página Home Carregada com Sucesso.
      </Text>
    </View>
  );
};

export default AssinaturasInativas;