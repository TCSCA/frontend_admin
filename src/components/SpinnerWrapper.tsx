// components/SpinnerWrapper.tsx
"use client";

import { useSpinner } from '@/context/SpinnerContext';
import GlobalSpinner from './ui/globalSpinner';

export default function SpinnerWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading, loadingMessage } = useSpinner();

  return (
    <>
      {isLoading && <GlobalSpinner />}
      {children}
    </>
  );
}