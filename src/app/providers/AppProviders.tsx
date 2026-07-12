import type { ReactNode } from 'react';
import { AuthProvider } from '../../modules/auth/presentation/context/AuthProvider';
import { WalletProvider } from '../../modules/wallet/presentation/context/WalletProvider';
import { NotificacionesProvider } from '../../modules/notificaciones/presentation/context/NotificacionesProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <WalletProvider>
        <NotificacionesProvider>{children}</NotificacionesProvider>
      </WalletProvider>
    </AuthProvider>
  );
}
