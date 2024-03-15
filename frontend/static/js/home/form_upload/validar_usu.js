function getCookie(name) {
    const cookieValue = document.cookie.match(
        "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"
    );
    return cookieValue ? cookieValue.pop() : null;
}

function validarRolUsuario() {
    const userCookie = getCookie("user_eyetracking");
    //console.log("Contenido de la cookie user_eyetracking:", userCookie);


    if (userCookie) {
        // Parsear el JSON de la cookie para obtener la información
        const userData = JSON.parse(userCookie);
        // Obtener el rol del usuario
        const userRole = userData[userData.length - 1];

        console.log("Rol del usuario:", userRole);

        // Obtener el elemento del menú "Crear"
        const optionCrearUsuario = document.getElementById('option_crear_usuario');

        if (userRole === 'admin') {
            optionCrearUsuario.style.display = 'block';
        } else {
            optionCrearUsuario.style.display = 'none';
        }
    } else {
        console.log("No se encontró la cookie 'user_eyetracking' o está vacía.");
    }
}

document.addEventListener('DOMContentLoaded', validarRolUsuario);
