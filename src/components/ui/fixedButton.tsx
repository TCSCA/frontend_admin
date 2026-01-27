"use client";

import React, { useState } from "react";
import { Plus, NotebookPen, Upload, X } from "lucide-react";
import { Button } from "./button";
import UploadDocumentsModal from "@/components/modals/UploadDocumentsModal";
import AddUploadDocumentaModal from "../modals/addUploadDocumentaModal";
import AddEventModal from "@/components//modals/addEventModal";

const FixedButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalDocumentsOpen, setModalDocumentOpen] = useState(false);
  const [modalEvents, setModalEvents] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleAction1 = () => {
    console.log("Acción 1 ejecutada: Abrir Configuración.");
    setModalEvents(true);
  };

  const handleSuccess = () => {};

  const handleAction2 = () => {
    console.log("Acción 2 ejecutada: Iniciar Edición Rápida.");
    setModalDocumentOpen(true);
  };

  return (
    // Contenedor principal: fijo, en la parte inferior derecha, con alto z-index
    <div className="fixed bottom-7 right-1 z-50 flex flex-col items-center space-y-3">
      {/* Sub-botones: se muestran solo si isOpen es true */}
      {isOpen && (
        <div className="flex flex-col items-center space-y-3 transition-all duration-300 ease-out">
          {/* Sub Botón 1: Configuración */}
          <Button
            onClick={handleAction1}
            className="w-10 h-10 rounded-full bg-lightblue text-white shadow-lg flex items-center justify-center hover:bg-maingreen transition duration-300 transform hover:scale-105"
            aria-label="Crear Noticia / Evento"
            title="Crear Noticia / Evento"
          >
            <NotebookPen className="w-5 h-5" />
          </Button>

          {/* Sub Botón 2: Editar */}
          <Button
            onClick={handleAction2}
            className="w-10 h-10 rounded-full bg-strongblue text-white shadow-lg flex items-center justify-center hover:bg-maingreen transition duration-300 transform hover:scale-105"
            aria-label="Cargar Documentos Administrativos"
            title="Cargar Documentos Administrativos"
          >
            <Upload className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Botón Principal (FAB) */}
      <button
        onClick={toggleOpen}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center 
          transition-all duration-500 ease-in-out 
          ${isOpen ? "bg-maingreen rotate-45" : "bg-lightblue rotate-0"}
          text-white hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300`}
        aria-label={
          isOpen ? "Cerrar menú de acciones" : "Abrir menú de acciones"
        }
        title={isOpen ? "Cerrar" : "Abrir"}
      >
        {isOpen ? <X className="w-7 h-7" /> : <Plus className="w-7 h-7" />}
      </button>

      {modalDocumentsOpen && (
        <AddUploadDocumentaModal
          open={modalDocumentsOpen}
          onClose={() => setModalDocumentOpen(false)}
        >
          <p>Subir documento Comunes</p>
        </AddUploadDocumentaModal>
      )}

      {modalEvents && (
        <AddEventModal
          open={modalEvents}
          onClose={() => setModalEvents(false)}
          title="Crear Noticia / Evento"
        >
          {/* Aquí puedes poner tu formulario de cliente */}
          <p>Formulario para añadir evento</p>
        </AddEventModal>
      )}
    </div>
  );
};

export default FixedButton;
