"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useNavigation } from "@/hooks/use-navigation";
import { ReactNode } from "react";

interface NavigationButtonProps {
  href: string;
  children: ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
}

export function NavigationButton({
  href,
  children,
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
}: NavigationButtonProps) {
  const { navigate, isNavigating } = useNavigation();

  const handleClick = () => {
    if (!disabled && !isNavigating) {
      navigate(href);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={className}
      disabled={disabled || isNavigating}
    >
      {isNavigating ? (
        <>
          <Loader size={16} className="mr-2" />
          Navegando...
        </>
      ) : (
        children
      )}
    </Button>
  );
} 