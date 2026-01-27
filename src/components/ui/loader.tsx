"use client";

import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: number;
  className?: string;
  text?: string;
}

export function Loader({ size = 24, className = "", text }: LoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className="animate-spin" size={size} />
      {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 w-full h-screen bg-gray-100/20 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="flex space-x-2 justify-center items-center">
        <div className="dot-1 w-4 h-4 bg-[#0077c8] rounded-full"></div>
        <div className="dot-2 w-4 h-4 bg-[#00a78e] rounded-full"></div>
        <div className="dot-3 w-4 h-4 bg-[#0077c8] rounded-full"></div>
      </div>
    </div>
  );
}
