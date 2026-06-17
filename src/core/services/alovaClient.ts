import { createAlova } from 'alova';
import GlobalFetch from 'alova/fetch';
import ReactHook from 'alova/react';

// Configuramos la instancia de Alova apuntando al puerto 4000 de tu JSON-Server
export const apiAlova = createAlova({

   baseURL: 'http://localhost:4000',
   statesHook: ReactHook,
   requestAdapter: GlobalFetch(),
   // also similar to axios
   responded:{ 
    onSuccess: async (response) => {
      if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.status}`);
      }
      return response.json();
    }
  }
});