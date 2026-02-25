import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme } from '../styles/themes';

const ThemeContext = createContext<any>(null);
const THEME_KEY = '@gestus_user_theme';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(true); // Evita o "piscar" de branco ao carregar

  const theme = isDark ? darkTheme : lightTheme;

  // Carrega o tema salvo ao iniciar o app
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        }
      } catch (e) {
        console.error("Erro ao carregar tema:", e);
      } finally {
        setLoading(false);
      }
    };
    loadTheme();
  }, []);

  // Função para trocar e salvar o tema
  const toggleTheme = async () => {
    try {
      const newMode = !isDark;
      setIsDark(newMode);
      await AsyncStorage.setItem(THEME_KEY, newMode ? 'dark' : 'light');
    } catch (e) {
      console.error("Erro ao salvar tema:", e);
    }
  };

  // Enquanto carrega o tema do disco, podemos retornar nulo ou um loading
  if (loading) return null; 

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);