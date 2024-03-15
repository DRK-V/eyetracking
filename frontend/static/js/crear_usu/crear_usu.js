const form1 = document.querySelector(".formu_p1");
const namen1 = document.querySelector("#a_name");
const apellido1 = document.querySelector("#a_apellido");
const correo1 = document.querySelector("#a_correo");
const contrasena1 = document.querySelector("#a_contrasena");
const rol1 = document.querySelector("#a_rol");
let boton = document.querySelector(".struc_boton1");

// Aca se compara los valores del objeto con los valores guardados
// Verificar si la cookie tiene un valor y compararlo con los valores de los elementos HTML
form1.addEventListener("input", (event) => {
  // Suponiendo que el valor de la cookie es un objeto con propiedades nombre, apellido, correo, contrasena
  if (
    namen1.value.trim() !== "" &&
    apellido1.value.trim() !== "" &&
    correo1.value.trim() !== "" &&
    contrasena1.value.trim() !== "" &&
    rol1.value.trim() !== ""
  ) {
    console.log("Los Campos están llenos");
    boton.style.display = "flex";
  } else {
    console.log("Los campos no están llenos");
    boton.style.display = "none";
  }
});

boton.addEventListener("click", () => {
  const analista = {
    nombre: namen1.value,
    apellido: apellido1.value,
    correo: correo1.value,
    contrasena: contrasena1.value,
    rol: rol1.value,
  };

  fetch("/crear_usuario/", {
    method: "POST",
    "content-type": "application/json",
    body: JSON.stringify(analista),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Respuesta del servidor:", data);
      if (data.status === 400) {
        toastr.error(data.mensaje);
      }
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("Respuesta del servidor:", data);
      toastr.success("creado exitosamente");
    })
    .catch((error) => {
      console.error("Error en la solicitud:", error);
    });
});
