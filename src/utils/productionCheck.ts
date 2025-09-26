// Utilitários para verificar e corrigir problemas em produção

export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

// Verificar se estamos no browser
export const isBrowser = () => {
  return typeof window !== 'undefined';
};

// Verificar se localStorage está disponível
export const isLocalStorageAvailable = () => {
  if (!isBrowser()) return false;
  
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    console.warn('localStorage não está disponível:', error);
    return false;
  }
};

// Fallback para quando localStorage não está disponível
export const createMemoryStorage = () => {
  const storage: Record<string, string> = {};
  
  return {
    getItem: (key: string) => storage[key] || null,
    setItem: (key: string, value: string) => {
      storage[key] = value;
    },
    removeItem: (key: string) => {
      delete storage[key];
    },
    clear: () => {
      Object.keys(storage).forEach(key => delete storage[key]);
    }
  };
};

// Verificar se ReactQuill está disponível
export const isReactQuillAvailable = () => {
  try {
    return typeof window !== 'undefined' && 
           typeof document !== 'undefined' &&
           typeof document.createElement === 'function';
  } catch (error) {
    return false;
  }
};

// Log de debug para produção
export const debugLog = (message: string, data?: any) => {
  if (isDevelopment()) {
    console.log(`[DEBUG] ${message}`, data);
  }
};

// Verificar se há erros de JavaScript
export const checkForErrors = () => {
  if (isBrowser()) {
    window.addEventListener('error', (event) => {
      console.error('Erro JavaScript capturado:', event.error);
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Promise rejeitada:', event.reason);
    });
  }
};
