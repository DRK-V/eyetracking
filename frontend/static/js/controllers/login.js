document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#formulario_login");
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar que el formulario se envíe normalmente
    console.log("se detuvo el form");

    // Obtener los valores de los campos de correo y contraseña
    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;

    // Crear un objeto con los datos del formulario
    const data = {
      correo: correo,
      contrasena: contrasena,
    };

    // Realizar la petición fetch
    fetch("/validar_usuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Respuesta del servidor:", data);

        // Mostrar un toastr en lugar de alert
        if (data.autenticado) {
          toastr.success("¡Usuario y contraseña válidos!");

          // Mostrar toda la información del usuario en la consola
          console.log("Información del usuario:", data.cliente_info);

          // Establecer la cookie user_eyetracking con los datos del usuario y expiración de 4 horas
          const expirationDate = new Date();
          expirationDate.setTime(expirationDate.getTime() + 4 * 60 * 60 * 1000); // 4 horas
          document.cookie = `user_eyetracking=${JSON.stringify(
            data.cliente_info
          )}; expires=${expirationDate.toUTCString()}; path=/`;
          // document.cookie = `user_eyetracking=${JSON.stringify(data.cliente_info)}; expires=${expirationDate.toUTCString()}; path=/; domain=localhost`;

          // Verificar si la cookie se ha establecido correctamente
          const userCookie = getCookie("user_eyetracking");
          if (userCookie) {
            console.log(
              "Cookie user_eyetracking establecida correctamente:",
              userCookie
            );
            window.location.href = "/homepage";
          } else {
            console.error("Error al establecer la cookie user_eyetracking");
          }
        } else {
          toastr.error("Usuario o contraseña incorrectos");
        }
      })
      .catch((error) => {
        console.error("Error al realizar la petición:", error);
        // Mostrar un toastr de error
        toastr.error(
          "Error al intentar iniciar sesión. Por favor, intenta nuevamente."
        );
      });
  });

  // Función para obtener el valor de una cookie por su nombre
  function getCookie(name) {
    const cookieValue = document.cookie.match(
      "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"
    );
    return cookieValue ? cookieValue.pop() : null;
  }

  const input = document.getElementById("correo");

  input.addEventListener("input", () => {
    // Aplicar estilos según sea necesario
    input.style.backgroundColor = "#fffff";
    input.style.color = "#ffff";
  });
});
