"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import ClientTable from "../global/clientTable";

interface ClientsTableWrapperProps {
  // Add any props you need to pass to the ClientTable
}

export default function ClientsTableWrapper({}: ClientsTableWrapperProps) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        // Replace this with your actual API call
        // const response = await fetch('/api/clients');
        // const data = await response.json();
        // setClients(data.items);
        // setTotalPages(data.totalPages);
        // setTotalItems(data.totalItems);
        
        // Mock data for now - remove this when you connect to your API
        setTimeout(() => {
          setClients([
            { id: 1, name: 'Client 1', email: 'client1@example.com', status: 'active' },
            { id: 2, name: 'Client 2', email: 'client2@example.com', status: 'inactive' },
            // Add more mock data as needed
          ]);
          setTotalItems(2);
          setTotalPages(1);
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

//   if (isLoading) {
//     return (
//       <div className="fixed inset-0 w-full h-screen bg-opacity-50 flex items-center justify-center z-[9999] bg-white">
//         <div className="flex space-x-2 justify-center items-center">
//           <div className="dot-1 w-4 h-4 bg-[#0077c8] rounded-full"></div>
//           <div className="dot-2 w-4 h-4 bg-[#00a78e] rounded-full"></div>
//           <div className="dot-3 w-4 h-4 bg-[#0077c8] rounded-full"></div>
//         </div>
//       </div>
//     );
//   }

  return (
    <ClientTable 
      data={clients}
      totalPages={totalPages}
      totalItems={totalItems}
      // Add any other props your ClientTable component needs
    />
  );
}
