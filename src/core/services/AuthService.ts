const URL = "http://localhost:4000/usuarios";

// Registrar usuario
export const registrarUsuario = async (usuario: any) => {

    // Buscar si el correo ya existe
    const existe = await fetch(`${URL}?correo=${usuario.correo}`);

    const datos = await existe.json();

    if (datos.length > 0) {

        throw new Error("Este correo ya está registrado.");

    }

    const respuesta = await fetch(URL, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(usuario)

    });

    return await respuesta.json();

};

// Login
export const loginUsuario = async (
    correo: string,
    password: string
) => {

    const respuesta = await fetch(

        `${URL}?correo=${correo}&password=${password}`

    );

    return await respuesta.json();

};