document.addEventListener('DOMContentLoaded', function () {
    let botones = document.querySelectorAll('.btn-accion');
    let btn = document.querySelector('.btn_close_list_projects_modal');
    let modal_list_projects = document.querySelector('.main_modal_list_projects');

    let btn_open_list_project = document.querySelector('#btn_projects');

    btn_open_list_project.addEventListener('click', () => {
        console.log('se abrio el modal');
        modal_list_projects.style.display = 'flex';
    });

    btn.addEventListener('click', () => {
        // Cerrar el modal
        modal_list_projects.style.display = 'none';
    });

    // Iterar sobre cada botón y agregar el evento de clic
    botones.forEach(function (boton) {
        boton.addEventListener('click', function (e) {
            // Obtener el ID desde el atributo data-id del botón clicado
            var id = boton.getAttribute('data-id');

            // Redirigir a la vista de abrir proyecto con el ID del proyecto
            fetch('/abrir-proyecto/' + id + '/')
                .then(response => response.json())
                .then(data => {
                    // Muestra un toastr con el mensaje obtenido del servidor
                    toastr.success(data.mensaje);

                    // Redirigir a la página de inicio (homepage) después de 3 segundos
                    setTimeout(() => {
                        window.location.href = '/homepage';
                    }, 1500);
                })
                .catch(error => {
                    console.error('Error al establecer la sesión:', error);
                    // Muestra un toastr de error si hay un problema
                    toastr.error('Error al establecer la sesión');
                });
        });
    });
});
