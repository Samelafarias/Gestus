import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSubscriptions } from '../context/SubscriptionContext';
import { LinearGradient } from 'expo-linear-gradient'; 
import RelatorioMensal from '../components/RelatorioMensal'; 
import RelatorioAnual from '../components/RelatorioAnual';
import { useTheme } from '../context/ThemeContext'; 

type Timeframe = 'Este Mês' | 'Mês Passado' | 'Este Ano';

const RelatorioPage = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('Este Mês');
  const { isLoading } = useSubscriptions();
  const { theme } = useTheme(); 

  const dynamicStyles = useMemo(() => StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.background, 
        padding: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    loadingText: {
      marginTop: 10,
      color: theme.text, 
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 30,
        marginTop: 15,
        width: '94%',
        alignSelf: 'center',
        // Ajuste: Fundo contrastante para o menu de abas
        backgroundColor: theme.isDark ? '#282828' : '#E8E8E8', 
        borderWidth: 1,
        borderColor: theme.isDark ? '#3a3a3a' : '#D1D1D1', 
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 25,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: theme.isDark ? '#BBBBBB' : '#666666', 
    },
    tabButtonActiveContainer: {
        borderRadius: 25,
        overflow: 'hidden',
    },
    tabButtonGradient: {
        paddingVertical: 10, 
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabTextActive: {
        color: '#FFFFFF', 
        fontWeight: 'bold',
        fontSize: 13,
    },
    reportWrapper: {
        flex: 1,
    },
    reportContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 60,
    },
  }), [theme]);

  if (isLoading) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={dynamicStyles.loadingText}>
            Carregando dados para relatórios...
        </Text>
      </View>
    );
  }

  const renderTabButton = (tab: Timeframe) => {
    const isActive = timeframe === tab;

    return (
        <TouchableOpacity
            key={tab}
            onPress={() => setTimeframe(tab)}
            activeOpacity={0.8}
            style={isActive ? dynamicStyles.tabButtonActiveContainer : dynamicStyles.tabButton} 
        >
            {isActive ? (
                <LinearGradient
                    colors={['#FF9800', '#8B5CF6', '#03A9F4']} 
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={dynamicStyles.tabButtonGradient}
                >
                    <Text style={dynamicStyles.tabTextActive}>{tab}</Text>
                </LinearGradient>
            ) : (
                <Text style={dynamicStyles.tabText}>{tab}</Text>
            )}
        </TouchableOpacity>
    );
  };

  return (
    <View style={dynamicStyles.mainContainer}>
        <View style={dynamicStyles.tabContainer}>
          {renderTabButton('Este Mês')}
          {renderTabButton('Mês Passado')}
          {renderTabButton('Este Ano')}
        </View>

        <ScrollView 
          style={dynamicStyles.reportWrapper} 
          contentContainerStyle={dynamicStyles.reportContent}
          showsVerticalScrollIndicator={false}
        >
            {timeframe === 'Este Ano' ? (
                <RelatorioAnual /> 
            ) : (
                <RelatorioMensal timeframe={timeframe} />
            )}
        </ScrollView>
    </View>
  );
};

export default RelatorioPage;