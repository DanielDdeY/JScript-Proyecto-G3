import type { ReactNode } from 'react';
import { WalletProvider } from '../../modules/wallet/presentation/context/WalletProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return <WalletProvider>{children}</WalletProvider>;
}
