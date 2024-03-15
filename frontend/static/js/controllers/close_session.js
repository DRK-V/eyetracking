const btn_close = document.querySelector('#close_session_btn');

function deleteCookie(cookieName) {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

btn_close.addEventListener('click', () => {
    // Pregunta al usuario si realmente desea cerrar la sesión
    const userConfirmed = confirm('¿Estás seguro de que deseas cerrar la sesión?');

    if (userConfirmed) {
        // Si el usuario confirmó, elimina la cookie
        deleteCookie('user_eyetracking');
        window.location.href = 'login/'; // Reemplaza '/login' con la ruta correcta
    }
});
