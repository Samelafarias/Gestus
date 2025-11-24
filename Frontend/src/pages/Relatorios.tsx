import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSubscriptions } from '../context/SubscriptionContext';
import { LinearGradient } from 'expo-linear-gradient'; 
import RelatorioMensal from '../components/RelatorioMensal'; 
import RelatorioAnual from '../components/RelatorioAnual';

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#1e1e1e',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1e1e1e',
    },
    loadingText: {
      color: '#fff',
      marginTop: 10,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 5,
        backgroundColor: '#282828',
        borderBottomWidth: 1,
        borderBottomColor: '#3a3a3a',
    },
    tabButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    tabText: {
        color: '#ccc',
        fontWeight: '600',
    },
    tabButtonActiveContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        marginVertical: 4, 
    },
    tabButtonGradient: {
        paddingVertical: 4, 
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    tabTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    reportWrapper: {
        flex: 1,
    },
    reportContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 50,
        alignItems: 'center',
    },
    reportTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
        textAlign: 'center',
    },
});

type Timeframe = 'Este Mês' | 'Mês Passado' | 'Este Ano';

const RelatorioPage = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('Este Mês');
  const { isLoading } = useSubscriptions();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Carregando dados para relatórios...</Text>
      </View>
    );
  }

  const renderReportComponent = () => {
    if (timeframe === 'Este Mês' || timeframe === 'Mês Passado') {
      return <RelatorioMensal timeframe={timeframe} />;
    } 
    else {
      return <RelatorioAnual />;
    }
  };

  const renderTabButton = (tab: Timeframe) => {
    const isActive = timeframe === tab;

    if (isActive) {
        return (
            <TouchableOpacity
                key={tab}
                onPress={() => setTimeframe(tab)}
                style={styles.tabButtonActiveContainer} 
            >
                <LinearGradient
                    colors={['#FF9800', '#8B5CF6', '#03A9F4']} 
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.tabButtonGradient}
                >
                    <Text style={styles.tabTextActive}>
                        {tab}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            key={tab}
            onPress={() => setTimeframe(tab)}
            style={styles.tabButton}
        >
            <Text style={styles.tabText}>
                {tab}
            </Text>
        </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainContainer}>
          <View style={styles.tabContainer}>
          {renderTabButton('Este Mês')}
          {renderTabButton('Mês Passado')}
          {renderTabButton('Este Ano')}
        </View>

        <ScrollView style={styles.reportWrapper} contentContainerStyle={styles.reportContent}>
            {renderReportComponent()}
        </ScrollView>
    </View>
  );
};



export default RelatorioPage;