// upload.js
function enviarArchivos() {
  var filesEnviados = document.getElementById("fileInput").files;

  // Validar que se hayan seleccionado archivos antes de enviar la solicitud al servidor
  if (filesEnviados.length === 0) {
    console.error("Error: No se han seleccionado archivos para cargar.");
    return;
  }

  document.getElementById("loading-overlay").style.display = "block";

  var uploadUrl = document.getElementById("uploadButton").getAttribute("data-url");

  var formData = new FormData();
  for (var i = 0; i < filesEnviados.length; i++) {
    formData.append("archivos", filesEnviados[i]);
  }

  var progreso = 1;
  var timeoutID;

  function llenarBarraCompleta() {
    var incremento = 100 - progreso;
    var incrementoPorSegundo = incremento / 50;
    var tiempoTranscurrido = 0;

    function llenarEn5Segundos() {
      if (tiempoTranscurrido < 5000) {
        progreso += incrementoPorSegundo;
        actualizarProgreso();
        tiempoTranscurrido += 100;
        timeoutID = setTimeout(llenarEn5Segundos, 100);
      } else {
        progreso = 100;
        actualizarProgreso();
      }
    }

    llenarEn5Segundos();
  }

  function actualizarProgreso() {
    if (progreso > 90 && !timeoutID) {
      progreso = 90;
    }

    document.getElementById("barra-progreso").style.width = progreso + "%";
    document.getElementById("porcentaje-progreso").innerText = progreso.toFixed(2) + "%";

    if (progreso === 100) {
      setTimeout(function () {
        document.getElementById("loading-overlay").style.display = "none";
      }, 1000);
    }
  }

  setInterval(function () {
    if (progreso < 90) {
      progreso += 0.5;
      actualizarProgreso();
    }
  }, 10000);

  // Realizar la solicitud al servidor usando fetch
  fetch(uploadUrl, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Respuesta del servidor:", data);


      llenarBarraCompleta();

      setTimeout(function () {
        window.location.reload(true);
      }, 5000);
    })
    .catch((error) => {
      console.error("Error al enviar archivos:", error);


      document.getElementById("loading-overlay").style.display = "none";
    });
}
