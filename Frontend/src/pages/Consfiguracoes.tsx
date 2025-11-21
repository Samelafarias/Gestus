import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker"; 

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
    backgroundColor: '#1e1e1e', 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', 
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: '#282828',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 15,
  },
  
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#444',
  },
  optionButtonActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  optionText: {
    color: '#fff',
    fontWeight: '600',
  },
  optionTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },

  timeInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  timeDisplay: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },

  editDataButton: {
    marginTop: 10,
    backgroundColor: '#282828',
    padding: 15,
    borderRadius: 8,
    alignItems: 'left',

  },
  editDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  }
});

const CURRENCY_KEY = '@Gestus:currency';
const NOTIFICATION_TIME_KEY = '@Gestus:notificationTime';
const DEFAULT_CURRENCY = 'BRL';
const DEFAULT_TIME = '09:00';
const CURRENCY_OPTIONS = ['BRL', 'USD', 'EUR'];

const ConfiguracoesPage = () => {
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [notificationTime, setNotificationTime] = useState(DEFAULT_TIME);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const loadSettings = async () => {
    try {
      const storedCurrency = await AsyncStorage.getItem(CURRENCY_KEY);
      const storedTime = await AsyncStorage.getItem(NOTIFICATION_TIME_KEY);
      
      if (storedCurrency) setCurrency(storedCurrency);
      if (storedTime) setNotificationTime(storedTime);
    } catch (e) {
      console.error("Erro ao carregar configurações:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCurrency = async (newCurrency: string) => {
    setCurrency(newCurrency);
    try {
      await AsyncStorage.setItem(CURRENCY_KEY, newCurrency);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar a moeda.');
    }
  };

  const saveNotificationTime = async (newTime: string) => {
    setNotificationTime(newTime);
    try {
      await AsyncStorage.setItem(NOTIFICATION_TIME_KEY, newTime);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o horário.');
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const showTimePicker = () => setTimePickerVisibility(true);
  const hideTimePicker = () => setTimePickerVisibility(false);

  const handleConfirmTime = (date: Date) => {
    const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
    saveNotificationTime(formattedTime);
    hideTimePicker();
  };

  const handleEditData = () => {
    Alert.alert(
      "Aviso", 
      "Página em manutenção. Tente novamente mais tarde." 
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const initialTime = new Date();
  const [hours, minutes] = notificationTime.split(':').map(Number);
  initialTime.setHours(hours, minutes, 0, 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>      
      <View style={styles.sectionCard}>
        <Text style={styles.settingTitle}>Moeda Padrão</Text>
        <Text style={styles.settingSubtitle}>Selecione a moeda para exibir os valores.</Text>
        
        <View style={styles.optionContainer}>
          {CURRENCY_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.optionButton, currency === opt && styles.optionButtonActive]}
              onPress={() => saveCurrency(opt)}
            >
              <Text style={currency === opt ? styles.optionTextActive : styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.settingTitle}>Horários das notificações</Text>
        <Text style={styles.settingSubtitle}>Defina que horas você quer receber seus lembretes.</Text>
        
        <TouchableOpacity style={styles.timeInputWrapper} onPress={showTimePicker}>
          <Ionicons name="time-outline" size={24} color="#8B5CF6" />
          <Text style={styles.timeDisplay}>{notificationTime}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.editDataButton} 
        onPress={handleEditData}
      >
        <Text style={styles.editDataText}>
        <Ionicons name="people-outline" size={24} color="#8B5CF6" />
              Editar Dados de Cadastro</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time" 
        date={initialTime}
        onConfirm={handleConfirmTime}
        onCancel={hideTimePicker}
        headerTextIOS="Selecione o Horário"
        cancelTextIOS="Cancelar"
        confirmTextIOS="Confirmar"
        textColor="white"
        pickerContainerStyleIOS={{ backgroundColor: '#282828' }}
      />
      <View style={{ height: 50 }} />
    </ScrollView>
  );
};



export default ConfiguracoesPage;