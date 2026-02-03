"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import ClientTable from "../global/clientTable";

interface ClientsTableWrapperProps {
  data: any[];
  // totalPages: number;
  // totalItems: number;
}

export default function ClientsTableWrapper({
  data,
  // totalPages,
  // totalItems
}: ClientsTableWrapperProps) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState(data);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);

        
        // Mock data for now - remove this when you connect to your API
        setTimeout(() => {
          setClients(data);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los clientes. Por favor, intente de nuevo.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const refresh = searchParams.get("refresh");
    const edit = searchParams.get("edit");

    const handleUrlParams = async () => {
      if (refresh === "true") {
        toast({
          title: "Actualización exitosa",
          description: "Los datos se han actualizado correctamente.",
          variant: "success",
        });
      }
      
      const cleanUrlParams = () => {
        const url = new URL(window.location.href);
        if (url.searchParams.has("refresh") || url.searchParams.has("edit")) {
          url.searchParams.delete("refresh");
          url.searchParams.delete("edit");
          window.history.replaceState({}, "", url.toString());
        }
      };

      const timer = setTimeout(cleanUrlParams, 1000);
      return () => clearTimeout(timer);
    };

    handleUrlParams();
  }, [searchParams]);


  return (
    <ClientTable 
      data={clients}
      // totalPages={totalPages}
      // totalItems={totalItems}   
    />  
  );
}
