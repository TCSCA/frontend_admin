// context/SpinnerContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface SpinnerContextType {
  isLoading: boolean;
  loadingMessage: string;
  showSpinner: (message?: string) => void;
  hideSpinner: () => void;
  setLoadingMessage: (message: string) => void;
}

const SpinnerContext = createContext<SpinnerContextType | undefined>(undefined);

export function SpinnerProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Cargando...');

  const showSpinner = useCallback((message?: string) => {
    setLoadingMessage(message || 'Cargando...');
    setIsLoading(true);
  }, []);

  const hideSpinner = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage('Cargando...');
  }, []);

  return (
    <SpinnerContext.Provider value={{
      isLoading,
      loadingMessage,
      showSpinner,
      hideSpinner,
      setLoadingMessage
    }}>
      {children}
    </SpinnerContext.Provider>
  );
}

export function useSpinner() {
  const context = useContext(SpinnerContext);
  if (!context) {
    throw new Error('useSpinner debe usarse dentro de SpinnerProvider');
  }
  return context;
}