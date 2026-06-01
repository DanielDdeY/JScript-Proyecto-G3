
import { WalletProvider } from './core/context/WalletContext';
import { RouterProvider } from 'react-router-dom';
import { router } from './core/routes/AppRoutes';

import './App.css'

function App() {
  return (
      <WalletProvider>
          <RouterProvider router={router} />
      </WalletProvider>
  );
}

export default App
