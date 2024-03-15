document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Obtener el archivo seleccionado por el usuario
    const archivo = document.querySelector('input[type="file"]').files[0];
    console.log(archivo)
    // Crear un objeto FormData para enviar el archivo
    const formData = new FormData();
    formData.append('excel_file', archivo);

    // Obtener el token CSRF de las cookies
    const csrftoken = getCookie('csrftoken');

    // Agregar el token CSRF a formData
    formData.append('csrfmiddlewaretoken', csrftoken);

    // Realizar una solicitud Ajax para enviar el archivo al servidor
    fetch('/procesar_archivo/', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.blob())
        .then(data => {
            const url = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'archivo.json';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            console.log('correcto')
        })
        .catch(error => {
            console.log('incorrecto')
            console.error(error);
        });
});

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
