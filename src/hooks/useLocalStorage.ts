import { useState, useEffect } from 'react';
import { isBrowser, isLocalStorageAvailable, createMemoryStorage } from '../utils/productionCheck';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // Verificar se localStorage está disponível, senão usar storage em memória
  const storage = isLocalStorageAvailable() ? localStorage : createMemoryStorage();

  // Função para obter valor do storage
  const getStoredValue = (): T => {
    if (!isBrowser()) {
      return initialValue;
    }

    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao ler storage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // Função para definir valor
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permite que value seja uma função para manter a mesma API do useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (isBrowser()) {
        storage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Erro ao salvar no storage key "${key}":`, error);
    }
  };

  // Sincronizar com mudanças do storage (de outras abas)
  useEffect(() => {
    if (!isBrowser()) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Erro ao sincronizar localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, isBrowser]);

  return [storedValue, setValue] as const;
};
