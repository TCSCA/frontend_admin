"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

export function useNavigation() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const navigate = useCallback((href: string) => {
    setIsNavigating(true);
    router.push(href);
    
    // Simular el fin de navegación después de un delay
    setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  }, [router]);

  return {
    navigate,
    isNavigating,
  };
} 