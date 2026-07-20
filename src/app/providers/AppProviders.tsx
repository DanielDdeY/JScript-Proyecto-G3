import type { ReactNode } from 'react';
import { AuthProvider } from '../../modules/auth/presentation/context/AuthProvider';
import { useAuth } from '../../modules/auth/presentation/hooks/useAuth';
import { WalletProvider } from '../../modules/wallet/presentation/context/WalletProvider';
import { NotificacionesProvider } from '../../modules/notificaciones/presentation/context/NotificacionesProvider';
import { InversionesProvider } from '../../modules/proyecciones/presentation/context/InversionesProvider';
import { PrestamosProvider } from '../../modules/proyecciones/presentation/context/PrestamosProvider';
import { MetasProvider } from '../../modules/proyecciones/presentation/context/MetasProvider';
import { ProyeccionesProvider } from '../../modules/proyecciones/presentation/context/ProyeccionesProvider';

interface AppProvidersProps {
  readonly children: ReactNode;
}

function DataProviders({ children }: { readonly children: ReactNode }) {
  const { usuario } = useAuth();
  return (
    <WalletProvider key={usuario?.id ?? 'guest'}>
      <PrestamosProvider>
        <InversionesProvider>
          <MetasProvider>
            <ProyeccionesProvider>
              <NotificacionesProvider>{children}</NotificacionesProvider>
            </ProyeccionesProvider>
          </MetasProvider>
        </InversionesProvider>
      </PrestamosProvider>
    </WalletProvider>
  );
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <DataProviders>{children}</DataProviders>
    </AuthProvider>
  );
}
