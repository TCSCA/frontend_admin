"use client";

// IMPORTACIONES DE MÓDULOS
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/auth.store";
import {
    Home,
    Pill,
    LogOut,
    Truck,
    FileUp,
    UserIcon
} from "lucide-react";
import { ResponseApi } from "@/types/response";
import callApi from "@/lib/callApi";
import Cookies from "js-cookie";
import { useSpinner } from "@/context/SpinnerContext";

// COMPONENTE PRINCIPAL: DashboardLayout
export default function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    // HOOKS DE NAVEGACIÓN Y ESTADO
    const router = useRouter();
    const pathname = usePathname();
    const { logout } = useAuthStore();
    const { showSpinner, hideSpinner } = useSpinner();
    const handleLogout = async () => {
        try {
            showSpinner();
            const response: ResponseApi = await callApi.post("/api/admin/logout", {
                id_usuario: Cookies.get("idUser"),
            });

        } catch (error) {

        } finally {
            hideSpinner();
            logout();
        }

    };

    // ITEMS DEL MENÚ DE NAVEGACIÓN
    const menuItems = [
        // {
        //     label: "Indicadores",
        //     path: "/dashboard",
        //     icon: FileUp,
        //     color: "text-green-500"
        // },
        {
            label: "Módulo de Clientes",
            path: "/dashboard/clients",
            icon: UserIcon,
            color: "text-blue-600",
            className: "text-blue-600"
        },
        // ITEMS COMENTADOS - POTENCIALES FUNCIONALIDADES
        // {
        //   label: "Cargar pacientes",
        //   path: "/dashboard/upload-patients",
        //   icon: FileUp,
        //   color: "text-blue-500"
        // },
        // {
        //     label: "Nota de entrega",
        //     path: "/dashboard/delivery-note",
        //     icon: Truck,
        //     color: "text-yellow-500"
        // },
        // {
        //   label: "Facturación",
        //   path: "/dashboard/billing",
        //   icon: FileText,
        //   color: "text-purple-500"
        // },
        // {
        //   label: "Generar Notas de Entrega",
        //   path: "/dashboard/notas-entrega",
        //   icon: FileText,
        //   color: "text-indigo-500"
        // },
        // {
        //   label: "Conciliar con Cliente",
        //   path: "/dashboard/conciliacion",
        //   icon: Handshake,
        //   color: "text-red-500"
        // }
    ];

    // FUNCIÓN PARA DETECTAR RUTA ACTIVA
    const isActive = (path: string) => {
        return pathname === path;
    };

    // RENDERIZADO DEL COMPONENTE
    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">

            {/* SIDEBAR IZQUIERDO */}
            <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">

                {/* ENCABEZADO DEL SIDEBAR */}
                <div className="p-6 border-b border-gray-200">
                    <div className="mt-2 mb-6 flex justify-center">
                        <Image
                            src={`/${process.env.NEXT_PUBLIC_API_BASE_URL_ASSETS}/assets/icon2.png`}
                            alt="Icono"
                            width={200}
                            height={200}
                            className="rounded-full"
                        />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800 text-center ">
                        Interfaz Administrativa Recipe
                    </h1>

                </div>

                {/* MENÚ DE NAVEGACIÓN */}
                <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
                    {menuItems.map((item) => {
                        const IconComponent = item.icon;
                        const active = isActive(item.path);

                        return (
                            <button
                                key={item.path}
                                onClick={() => router.push(item.path)}
                                className={`
                  w-full flex items-center space-x-4 
                  px-4 py-4 rounded-lg transition-all 
                  duration-200
                  ${active
                                        ? "bg-blue-50 border border-blue-200 text-blue-700 font-semibold"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    }
                `}
                            >
                                <IconComponent
                                    className={`
                    w-6 h-6 
                    ${active ? "text-blue-600" : item.color}
                  `}
                                />
                                <span className={`${item.className || 'text-base font-medium'}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>

                {/* FOOTER DEL SIDEBAR */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="
              w-full flex items-center space-x-4 
              px-4 py-4 text-gray-700 
              hover:bg-red-50 hover:text-red-700 
              rounded-lg transition-all duration-200
            "
                    >
                        <LogOut className="w-6 h-6" />
                        <span className="text-base font-semibold">
                            Cerrar sesión
                        </span>
                    </button>
                </div>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="flex-1 flex flex-col">

                {/* BARRA SUPERIOR */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="px-6 pt-2 pb-1">
                        <div className="text-lg font-semibold text-center w-full justify-center">

                            {/* TÍTULO Y DESCRIPCIÓN */}
                            <div>
                                <h2 className="text-xl font-bold ">
                                    {menuItems.find(item => item.path === pathname)?.label || "Dashboard"}
                                </h2>

                                <p className="text-base text-gray-600 mt-2">
                                    {pathname === "/dashboard"
                                        ? "Cargue los pacientes y recipes para generar las órdenes"
                                        : ""}

                                    {pathname === "/dashboard/orders"
                                        ? "Observe los detalles de la orden y genere los archivos para los proveedores"
                                        : ""}

                                    {/* {pathname === "/dashboard/delivery-note" 
                    ? "Creación de notas de entrega" 
                    : ""} */}
                                </p>
                            </div>

                            {/* // ÁREA DE USUARIO (OPCIONAL) */}
                            <div className="flex items-center space-x-4">
                                {/* // Aquí podrías agregar:
                // - Notificaciones
                // - Perfil de usuario
                // - Configuración */}
                            </div>
                        </div>
                    </div>
                </header>

                {/* CONTENIDO DINÁMICO */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>

                {/* PIE DE PÁGINA GLOBAL */}
                {/* <footer className="bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                        <span className="font-medium">Versión</span>
                        <span>1.5.3</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <span className="font-medium">Desarrollado por:</span>
                        <span className="text-blue-600 font-semibold text-base">
                            <Image
                                src={`/${process.env.NEXT_PUBLIC_API_BASE_URL_ASSETS}/assets/TCS-logo.svg`}
                                alt="Icono"
                                width={75}
                                height={75}
                                className="rounded-full"
                            />
                        </span>
                    </div>
                </footer> */}
            </div>
        </div>
    );
}