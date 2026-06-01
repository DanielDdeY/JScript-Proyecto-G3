import React, { createContext, useState, type ReactNode, useContext } from 'react';

// 1. Definición de las Interfaces de Datos
export interface Perfil {
    nombre: string;
    saldoTotal: number;
}

export interface Tarjeta {
    id: string;
    banco: string;
    numero: string;
    saldo: number;
}

export interface ResumenFinanciero {
    ingresos: number;
    gastos: number;
    ahorro: number;
}

export interface Proyeccion {
    tiempo: string;
    monto: number;
    porcentaje: string;
}

// Interface para el contenido del Contexto
export interface WalletContextType {
    perfil: Perfil;
    tarjetas: Tarjeta[];
    resumenFinanciero: ResumenFinanciero;
    proyecciones: Proyeccion[];
}

// Inicialización del Contexto con soporte estricto de tipos
export const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
    children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
    const [perfil] = useState<Perfil>({ nombre: "Pepito", saldoTotal: 12450.75 });

    const [tarjetas] = useState<Tarjeta[]>([
        { id: "1", banco: "VISA", numero: "1234", saldo: 4500.00 },
        { id: "2", banco: "BCP", numero: "5678", saldo: 3200.00 },
        { id: "3", banco: "BBVA", numero: "7890", saldo: 4750.75 }
    ]);

    const [resumenFinanciero] = useState<ResumenFinanciero>({
        ingresos: 3800.00,
        gastos: 2300.00,
        ahorro: 1500.00
    });

    const [proyecciones] = useState<Proyeccion[]>([
        { tiempo: "En 1 mes", monto: 13900.00, porcentaje: "+ 11.6%" },
        { tiempo: "En 3 meses", monto: 16750.00, porcentaje: "+ 34.6%" },
        { tiempo: "En 6 meses", monto: 20450.00, porcentaje: "+ 64.2%" },
        { tiempo: "En 1 año", monto: 26500.00, porcentaje: "+ 112.9%" }
    ]);

    return (
        <WalletContext.Provider value={{ perfil, tarjetas, resumenFinanciero, proyecciones }}>
            {children}
        </WalletContext.Provider>
    );
};

// Hook personalizado para evitar validar null/undefined en cada componente
export const useWallet = (): WalletContextType => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet debe ser utilizado dentro de un WalletProvider');
    }
    return context;
};