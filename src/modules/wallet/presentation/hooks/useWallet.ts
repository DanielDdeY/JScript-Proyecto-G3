import { useContext } from 'react';
import { WalletContext } from '../context/WalletProvider';

export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error('useWallet debe ser usado dentro de WalletProvider');
  }

  return context;
}
