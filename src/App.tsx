
import { WalletProvider } from './core/context/WalletContext';
import { AuthProvider } from "./core/context/AuthContext";
import { RouterProvider } from 'react-router-dom';
import { router } from './core/routes/AppRoutes';

import './App.css'

function App() {
  return (
      <WalletProvider>

    <AuthProvider>

        <RouterProvider router={router}/>

    </AuthProvider>

</WalletProvider>
  );
}

export default App
