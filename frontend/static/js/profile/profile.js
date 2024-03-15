const form = document.querySelector('.formu_p');
const namen = document.querySelector('#name');
const apellido = document.querySelector('#apellido');
const correo = document.querySelector('#correo');
const contrasena = document.querySelector('#contrasena');
const rol = document.querySelector('#rol')
let boton1 = document.querySelector('.struc_boton');

// Aca se obtiene la info de la cookie
function obtenerCookie(nombre) {
    const cookies = document.cookie.split("; ").map(cookie => {
        const [cookieNombre, cookieValor] = cookie.split("=");
        return { nombre: cookieNombre, valor: cookieValor };
    });

    const cookieBuscada = cookies.find(cookie => cookie.nombre === nombre);

    if (cookieBuscada && cookieBuscada.valor) {
        try {
            // Intenta parsear el valor de la cookie como JSON
            return JSON.parse(cookieBuscada.valor);
        } catch (error) {
            // Si hay un error al parsear JSON, devuelve el valor de la cookie como está
            return cookieBuscada.valor;
        }
    }

    return null;
}

// Uso
const valorDeMiCookie = obtenerCookie("user_eyetracking");
console.log(valorDeMiCookie);


// Aca se compara los valores del objeto con los valores guardados
// Verificar si la cookie tiene un valor y compararlo con los valores de los elementos HTML

form.addEventListener('input', () => {
    if (valorDeMiCookie) {
        // Suponiendo que el valor de la cookie es un objeto con propiedades nombre, apellido, correo, contrasena
        if (valorDeMiCookie[1] === namen.value &&
            valorDeMiCookie[2] === apellido.value &&
            valorDeMiCookie[4] === correo.value &&
            valorDeMiCookie[5] === contrasena.value &&
            valorDeMiCookie[6] === rol.value) {
            console.log("Los valores coinciden");
            boton1.style.display = "none"
        } else {
            console.log("Los valores NO coinciden");
            boton1.style.display = "flex"
        }
    } else {
        console.log("No se encontró la cookie o no tiene un formato válido");
    }

})

boton1.addEventListener('click', () => {
    usuario = {
        'id': valorDeMiCookie[0],
        'nombre': namen.value,
        'apellido': apellido.value,
        'correo': correo.value,
        'contrasena': contrasena.value,
        'rol': rol.value,

    }

    fetch('/actualizar_usuario/', {
        method: 'POST',
        'Content-Type': 'application/json',
        body: JSON.stringify(usuario)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor:', data)
        })
})