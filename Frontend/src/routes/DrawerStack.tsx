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
import { Image, View, TouchableOpacity } from 'react-native';

const Drawer = createDrawerNavigator();

export default function DrawerStack() {
    return (
        <Drawer.Navigator 
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={({ navigation }) => ({ // navigation aqui para abrir o drawer
                drawerActiveTintColor: '#8B5CF6', 
                drawerInactiveTintColor: '#1e1e1e',
                drawerPosition: 'right',
                headerShown: true,
                headerStyle: { backgroundColor: '#1e1e1e' },
                headerTintColor: '#fff',
                headerTitleAlign: 'center',

                drawerStyle: {
                width: '85%', 
                backgroundColor: 'transparent', 
                borderTopLeftRadius: 30,         // Alinhado com o componente
                borderBottomLeftRadius: 30,      // Alinhado com o componente
                borderTopRightRadius: 0,        // Remova arredondamentos do lado oposto
                borderBottomRightRadius: 0,     // Remova arredondamentos do lado oposto
                overflow: 'hidden', 
    },

                // Colocar a Logo do sistema do lado esquerdo
                headerLeft: () => (
                    <Image 
                        source={require('../../assets/Logo.png')} // Caminho para sua logo
                        style={{ width: 30, height: 30, marginLeft: 15, resizeMode: 'contain' }} 
                    />
                ),

                // Coloca o menu hambúrguer do lado direito
                headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons 
                            name="menu-outline" 
                            size={30} 
                            color="#fff" 
                            style={{ marginRight: 15 }} 
                        />
                    </TouchableOpacity>
                ),
            })}
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