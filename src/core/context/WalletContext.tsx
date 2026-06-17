import React, { createContext, useState, useEffect,type ReactNode, useContext } from 'react';
import { apiAlova } from '../services/alovaClient';

import type { WalletContextType } from '../../shared/types/walletContextType';
import type { Perfil } from '../../shared/types/perfil';
import type { Proyeccion } from '../../shared/types/proyeccion';
import type { ResumenFinanciero } from '../../shared/types/resumenFinanciero';
import type { Tarjeta } from '../../shared/types/tarjeta';


export const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const [proyecciones, setProyecciones] = useState<Proyeccion[]>([]);
  const [resumenFinanciero, setResumenFinanciero] = useState<ResumenFinanciero | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const cargarDatosConAlova = async () => {
      try {
        setCargando(true);

        // 1. Definimos los métodos de Alova especificando el tipado estricto genérico <T>
        const metodoPerfil = apiAlova.Get<Perfil>('/perfil');
        const metodoTarjetas = apiAlova.Get<Tarjeta[]>('/tarjetas?_expand=banco'); // JOIN relacional con Banco
        const metodoProyecciones = apiAlova.Get<Proyeccion[]>('/proyecciones');

        // 2. Ejecutamos las promesas en paralelo usando el método .send() de Alova
        const [perfilData, tarjetasData, proyeccionesData] = await Promise.all([
          metodoPerfil.send(),
          metodoTarjetas.send(),
          metodoProyecciones.send()
        ]);

        // 3. Almacenamos las respuestas asíncronas en el estado de React
        setPerfil(perfilData);
        setTarjetas(tarjetasData);
        setProyecciones(proyeccionesData);

        // Armamos el bloque del resumen sumando los flujos de tu db.json
        setResumenFinanciero({
          ingresos: 4650.00, // Sueldo + Freelance
          gastos: 3061.40,   // Cafés + Laptop + Suscripción
          ahorro: 1588.60
        });

      } catch (error) {
        console.error('Error cargando la billetera virtual con Alova:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatosConAlova();
  }, []);

  return (
    <WalletContext.Provider value={{ perfil, tarjetas, resumenFinanciero, proyecciones, cargando }}>
      {children}
    </WalletContext.Provider>
  );
};

// Hook personalizado para consumir el estado en cualquier parte de la App de forma segura
export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet debe ser utilizado dentro de un WalletProvider');
  }
  return context;
};