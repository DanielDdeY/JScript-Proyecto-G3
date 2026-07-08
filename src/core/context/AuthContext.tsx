import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

interface Usuario {

    id?: number;

    nombres: string;

    apellidos: string;

    correo: string;

    dni: string;

    celular: string;

}

interface AuthContextType {

    usuario: Usuario | null;

    login: (usuario: Usuario) => void;

    logout: () => void;

    autenticado: boolean;

}

const AuthContext = createContext<AuthContextType>(
    {} as AuthContextType
);

export const AuthProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {

    const [usuario, setUsuario] = useState<Usuario | null>(null);

    useEffect(() => {

        const datos = localStorage.getItem("usuario");

        if (datos) {

            setUsuario(JSON.parse(datos));

        }

    }, []);

    const login = (usuario: Usuario) => {

        localStorage.setItem(
            "usuario",
            JSON.stringify(usuario)
        );

        setUsuario(usuario);

    };

    const logout = () => {

        localStorage.removeItem("usuario");

        setUsuario(null);

    };

    return (

        <AuthContext.Provider

            value={{
                usuario,
                login,
                logout,
                autenticado: usuario !== null
            }}

        >

            {children}

        </AuthContext.Provider>

    );

};

export const useAuth = () => useContext(AuthContext);