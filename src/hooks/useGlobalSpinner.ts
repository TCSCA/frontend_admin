// hooks/useGlobalSpinner.ts
"use client";

import { useState, useCallback } from 'react';

export function useGlobalSpinner() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('Cargando...');

  const showSpinner = useCallback((message?: string) => {
    setLoadingMessage(message || 'Cargando...');
    setIsLoading(true);
  }, []);

  const hideSpinner = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage('Cargando...');
  }, []);

  return {
    isLoading,
    loadingMessage,
    showSpinner,
    hideSpinner,
    setLoadingMessage
  };
}