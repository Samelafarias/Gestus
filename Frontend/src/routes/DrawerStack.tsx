import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer'; 
import CustomDrawerContent from '../components/CustomDrawerContent'; 
import { Ionicons } from '@expo/vector-icons'; 
import HomePage from '../pages/Home';
import ListaAssinaturas from '../pages/ListaAssinaturas'
import AssinaturasInativas from '../pages/AssinaturasInativas';
import RelatorioPage from '../pages/Relatorios';
import Notificacao from '../pages/HistoricoNotificacao';
import ConfiguracoesPage from '../pages/Consfiguracoes';
import SobrePage from '../pages/Sobre';
import EdicaoAssinatura from '../pages/EdicaoAssinaturas';


const Drawer = createDrawerNavigator();

export default function DrawerStack() {
    return (
        <Drawer.Navigator 
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            
            screenOptions={{
                drawerActiveTintColor: '#8B5CF6', 
                drawerInactiveTintColor: '#1e1e1e',
                drawerStyle: {
                    width: '80%', 
                    backgroundColor: '#fff', 
                    borderTopRightRadius: 30,
                    borderBottomRightRadius: 30,
                    overflow: 'hidden', 
                },

                drawerLabelStyle: {
                    marginLeft: 10, 
                    fontWeight: '600',
                    fontSize: 15,
                },

                headerShown: true,
                headerStyle: { backgroundColor: '#1e1e1e' },
                headerTintColor: '#fff',
            }}
        >
            <Drawer.Screen 
                name="HomePage" 
                component={HomePage}
                options={{
                    drawerLabel: 'Home', 
                    title: 'Visão Geral', 
                    drawerIcon: ({ color, size }) => (
                         <Ionicons name="home-outline" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen 
                name="ListaAssinaturas" 
                 component={ListaAssinaturas}
                options={{
                    drawerLabel: 'Lista de Assinaturas', 
                    title: 'Minhas Assinaturas',
                    drawerIcon: ({ color, size }) => (
                         <Ionicons name="list-outline" color={color} size={size} />
                    ),
                }}
            />

       
            <Drawer.Screen 
                name="AssinaturasInativas" 
                 component={AssinaturasInativas}
                options={{
                    drawerLabel: 'Assinaturas Inativas', 
                    title: 'Assinaturas Inativas',
                    drawerIcon: ({ color, size }) => (
                         <Ionicons name="close-circle-outline" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen 
                name="Relatorios" 
                 component={RelatorioPage}
                options={{
                    drawerLabel: 'Relatórios', 
                    title: 'Relatórios',
                    drawerIcon: ({ color, size }) => (
                         <Ionicons name="bar-chart-outline" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen 
                name="HistoricoNotificacao" 
                 component={Notificacao}
                options={{
                    drawerLabel: 'Histórico Notificações', 
                    title: 'Histórico de Notificações',
                    drawerIcon: ({ color, size }) => (
                         <Ionicons name="notifications-outline" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen 
                name="Configuracoes" 
                 component={ConfiguracoesPage}
                options={{
                    drawerLabel: 'Configurações', 
                    title: 'Configurações',
                    drawerIcon: ({ color, size }) => (
                         <Ionicons name="settings-outline" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen 
                name="Sobre" 
                 component={SobrePage}
                options={{
                    drawerLabel: 'Sobre / Ajuda', 
                    title: 'Sobre / Ajuda',
                    drawerIcon: ({ color, size }) => (
                         <Ionicons name="help-circle-outline" color={color} size={size} />
                    ),
                }}
            />
           
        </Drawer.Navigator>
    );
}