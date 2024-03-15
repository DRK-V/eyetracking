const graficosEliminados = new Set();
const reportesAgregados = new Set();

function agregarAReporte() {
  const modalReportes = document.getElementById("modal_reportes");

  if (!modalReportes.innerHTML.trim()) {
    agregarGrafico();
    return;
  }

  const referencia = document.getElementById("seleccionar-ref").value;
  const generoSeleccionado =
    document.getElementById("seleccionar-genero").value;
  const nombreGrafico = document.getElementById("interes").innerText;

  const claveReporte = `${nombreGrafico}-${referencia}-${generoSeleccionado}`;
  const reporteExistente = modalReportes.querySelector(
    `.titulo[data-key="${claveReporte}"]`
  );

  if (reporteExistente) {
    toastr.error(`El gráfico ya está en reportes`);
    return;
  }

  agregarGrafico();
  validarContenido()
}

function agregarGrafico() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const graficoCanvas = document.getElementById("grafico-barras");
  let vistaPrevia = document.getElementById("vistaPrevia");
  canvas.width = graficoCanvas.width;
  canvas.height = graficoCanvas.height;

  ctx.drawImage(graficoCanvas, 0, 0);

  // Obtener los datos del gráfico
  const datos = graficoBarras.data.datasets[0].data;
  const datosValidos = datos.some((valor) => !isNaN(valor) && valor !== null);

  if (!datosValidos) {
    toastr.error(`El gráfico no contiene datos válidos`);
    return;
  }
  // Dibujar el promedio en cada barra
  ctx.font = "12px Arial";
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";

  datos.forEach((valor, indice) => {
    const promedio = valor.toFixed(2); // Redondear el promedio a dos decimales
    const barraX = graficoBarras.getDatasetMeta(0).data[indice].x;
    const barraY = graficoBarras.getDatasetMeta(0).data[indice].y;
    const barraAltura = graficoBarras.getDatasetMeta(0).data[indice].height;
    const textY = barraY + barraAltura / 2 + 6;

    ctx.fillText(promedio, barraX, textY);
  });

  // Convertir el canvas a una imagen
  const imagenGrafico = canvas.toDataURL(); // Convierte el canvas a una imagen base64

  const referencia = document.getElementById("seleccionar-ref").value;
  const generoSeleccionado =
    document.getElementById("seleccionar-genero").value;
  const nombreGrafico = document.getElementById("interes").innerText;
  // Crear un nuevo div para el reporte
  const reporteDiv = document.createElement("div");
  reporteDiv.classList.add("reporte-item"); // Agregar una clase CSS al div

  // Ajustar el texto del género según corresponda
  const generoTexto =
    generoSeleccionado.toLowerCase() === "todos"
      ? "Todos los participantes"
      : `${generoSeleccionado}`;

  const prefijoGenero =
    generoSeleccionado.toLowerCase() === "todos" ? "de" : "del género:";

  // Añadir un botón para eliminar el reporte
  reporteDiv.innerHTML += `
  <button class="eliminar-reporte-btn" onclick="eliminarReporte(this)">
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
    <path
        d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
</svg>
</button>
`;
  reporteDiv.innerHTML += `
    <h1 class="titulo" data-key="${nombreGrafico}-${referencia}-${generoSeleccionado}">${nombreGrafico}, promedio de la referencia: ${referencia}, ${prefijoGenero} ${generoTexto}</h1>
        <div class="contenido">
            <div class="grafico" style="margin: 30px;">
                <img src="${imagenGrafico}" alt="Gráfico de barras">
            </div>
            <div class="resumen" style="margin: 50px 15px 20px 5px">
                ${document.getElementById("resumen-container").innerHTML}
            </div>
        </div>
    `;

  const reporteContainer = document.getElementById("modal_reportes");

  reporteContainer.appendChild(reporteDiv);
  // Mostrar mensaje de toast
  toastr.success(`Se agregó el reporte`);

  vistaPrevia.style.display = "flex";
  vistaPrevia.innerHTML = `
       <img src="${imagenGrafico}" alt="Vista previa" class="vista-previa-imagen">
   `;
  setTimeout(() => {
    vistaPrevia.style.display = "none";
    vistaPrevia.innerHTML = "";
  }, 3000);
  validarContenido()

}

function eliminarReporte(button) {
  const reporteDiv = button.parentElement;
  const claveReporte = reporteDiv
    .querySelector(".titulo")
    .getAttribute("data-key");

  reportesAgregados.delete(claveReporte);

  graficosEliminados.delete(claveReporte);

  reporteDiv.remove();

  toastr.success(`Se eliminó el reporte`);
  validarContenido()
}

const reportesAgregadosImpacto = new Set();

function agregarAReporteImpacto() {
  // Capturar imagen del gráfico con promedios
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const graficoCanvas = document.getElementById("grafico-barras-impacto");
  canvas.width = graficoCanvas.width;
  canvas.height = graficoCanvas.height;

  // Dibujar el gráfico original
  ctx.drawImage(graficoCanvas, 0, 0);

  // Obtener los datos del gráfico
  const datos = graficoBarrasImpacto.data.datasets[0].data;
  const datosValidos = datos.some((valor) => !isNaN(valor) && valor !== null);

  if (!datosValidos) {
    toastr.error(`El gráfico no contiene datos válidos`);
    return;
  }
  // Dibujar el promedio en cada barra
  ctx.font = "12px Arial";
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";

  datos.forEach((valor, indice) => {
    const promedio = valor.toFixed(2); // Redondear el promedio a dos decimales
    const barraX = graficoBarrasImpacto.getDatasetMeta(0).data[indice].x;
    const barraY = graficoBarrasImpacto.getDatasetMeta(0).data[indice].y;
    const barraAltura =
      graficoBarrasImpacto.getDatasetMeta(0).data[indice].height;
    const textY = barraY + barraAltura / 2 + 6;
    ctx.fillText(promedio, barraX, textY);
  });

  // Convertir el canvas a una imagen
  const imagenGrafico = canvas.toDataURL();

  // Obtener la referencia y el género del gráfico
  const referencia = document.getElementById("seleccionar-ref-impacto").value;
  const generoSeleccionadoImpacto = document.getElementById(
    "seleccionar-genero-impacto"
  ).value;
  const nombreGrafico = document.getElementById("impacto").innerText;

  const claveReporteImpacto = `${nombreGrafico}-${referencia}-${generoSeleccionadoImpacto}`;

  if (reportesAgregadosImpacto.has(claveReporteImpacto)) {
    toastr.error(`El gráfico ya está en reportes`);
    return;
  }

  reportesAgregadosImpacto.add(claveReporteImpacto);

  const reporteDiv = document.createElement("div");
  reporteDiv.classList.add("reporte-item");

  const generoTexto =
    generoSeleccionadoImpacto.toLowerCase() === "todos"
      ? "Todos los participantes"
      : `${generoSeleccionadoImpacto}`;

  const prefijoGenero =
    generoSeleccionadoImpacto.toLowerCase() === "todos" ? "de" : "del género:";
  reporteDiv.innerHTML += `
  <h1 class="titulo">${nombreGrafico}, promedio de la referencia: ${referencia}, ${prefijoGenero} ${generoTexto}</h1>
      <div class="contenido">
          <div class="grafico" style="margin: 30px;">
              <img src="${imagenGrafico}" alt="Gráfico de barras">
          </div>
          <div class="resumen" style="margin: 50px 15px 20px 5px" >
              ${document.getElementById("resumen-container-impacto").innerHTML}
          </div>
      </div>
  `;

  // Añadir botón de eliminar reporte
  const eliminarReporteBtn = document.createElement("button");
  eliminarReporteBtn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
    <path
        d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
</svg>
`;
  eliminarReporteBtn.classList.add("eliminar-reporte-btn");
  eliminarReporteBtn.onclick = function () {
    eliminarReporteImpacto(claveReporteImpacto, reporteDiv);
  };
  reporteDiv.appendChild(eliminarReporteBtn);

  const reporteContainer = document.getElementById("modal_reportes");
  reporteContainer.appendChild(reporteDiv);

  // Mostrar mensaje de toast
  toastr.success(`Se agregó el reporte`);

  // Mostrar vista previa durante 3 segundos
  vistaPrevia.style.display = "flex";
  vistaPrevia.innerHTML = `
      <img src="${imagenGrafico}" alt="Vista previa" class="vista-previa-imagen">
  `;
  setTimeout(() => {
    vistaPrevia.style.display = "none";
    vistaPrevia.innerHTML = "";
  }, 3000);
  validarContenido()
}

function eliminarReporteImpacto(clave, reporteDiv) {
  const reporteContainer = reporteDiv.parentElement;
  reporteContainer.removeChild(reporteDiv);
  reportesAgregadosImpacto.delete(clave); // Eliminar la clave del conjunto
  validarContenido()
}

const reportesAgregadosMetricas = new Set();

// Variable para almacenar el nombre de la imagen actual
let nombreImagenActual = "imagen_1"; // Nombre de imagen predeterminado

function agregarAReporteMetricas() {
  // Capturar imagen del gráfico
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const chartCanvas = document.getElementById("myChart");
  canvas.width = chartCanvas.width;
  canvas.height = chartCanvas.height;

  // Dibujar el gráfico original
  ctx.drawImage(chartCanvas, 0, 0);

  const imagenGrafico = canvas.toDataURL();

  const filtroSelect = document.getElementById("filtroSelect_pupil_range");
  const pupil_range =
    filtroSelect.options[filtroSelect.selectedIndex].textContent;

  const recordingNameSelect = document.getElementById("recordingNameSelect");
  const recordingName =
    recordingNameSelect.options[recordingNameSelect.selectedIndex].textContent;

  // Usar el nombre de la imagen actual
  const claveReporteMetricas = `${recordingName}, promedio de ${pupil_range} de los participantes, Imagen: ${nombreImagenActual}`;

  // Verificar si el reporte de métricas ya existe
  if (reportesAgregadosMetricas.has(claveReporteMetricas)) {
    toastr.error(`El gráfico ya está en reportes`);
    return;
  }

  reportesAgregadosMetricas.add(claveReporteMetricas);

  // Crear un nuevo div para el reporte de métricas
  const reporteDiv = document.createElement("div");
  reporteDiv.classList.add("reporte-item");
  const nombreGrafico = document.getElementById("metricas").innerText;

  // Agregar imagen del gráfico al div del reporte
  reporteDiv.innerHTML += `
  <h1 class="titulo"> ${nombreGrafico}, promedio de ${pupil_range} del participante (${recordingName}),${nombreImagenActual}</h1>
  <div class="grafico" style="margin: 30px; text-align: center; display: flex; justify-content: center;">
      <img src="${imagenGrafico}" alt="Gráfico de métricas" style="max-width: 100%; height: auto;">
  </div>
  <button class="eliminar-reporte-btn" onclick="eliminarReporte(this, '${claveReporteMetricas}')">
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
      <path
          d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
    </svg>
  </button>
`;

  const reporteContainer = document.getElementById("modal_reportes");
  reporteContainer.appendChild(reporteDiv);

  // Mostrar mensaje de toast
  toastr.success(`Se agregó el reporte`);

  // Mostrar vista previa durante 3 segundos
  vistaPrevia.style.display = "flex";
  vistaPrevia.innerHTML = `
       <img src="${imagenGrafico}" alt="Vista previa" class="vista-previa-imagen" style="max-width: 100%; height: auto; display: block; margin: 0 auto;">
   `;
  setTimeout(() => {
    vistaPrevia.style.display = "none";
    vistaPrevia.innerHTML = "";
  }, 3000);
  validarContenido()
}

function eliminarReporte(button, clave) {
  const reporteDiv = button.parentElement;
  const reporteContainer = reporteDiv.parentElement;
  reporteContainer.removeChild(reporteDiv);
  reportesAgregadosMetricas.delete(clave); // Eliminar la clave del conjunto
  validarContenido()
}

// Modificar handleCoordinates para actualizar el nombre de la imagen
function handleCoordinates(x, y) {
  console.log("Coordinates:", { x: x, y: y });
  // Generar un nuevo nombre de imagen basado en las coordenadas
  nombreImagenActual = `imagen_${x}_${y}`;
}

function descargarPDF() {

  const botonImprimir = document.getElementById("botonImprimir");
  botonImprimir.style.display = "none";

  const modalReportes = document.getElementById("modal_reportes");

  // Ocultar los botones de eliminar reporte
  const botonesEliminar = modalReportes.querySelectorAll(
    ".eliminar-reporte-btn"
  );
  botonesEliminar.forEach((boton) => {
    boton.style.display = "none";
  });

  // Verificar si hay contenido en el contenedor modal_reportes
  const reportes = document.querySelectorAll(".reporte-item");
  if (reportes.length === 0) {
    toastr.error("No hay datos de gráficos para descargar en PDF");
    botonImprimir.style.display = "";
    return;
  }

  // URL de la imagen adicional
  const logoURL =
    "https://e7.pngegg.com/pngimages/964/723/png-clipart-logo-sena-la-granja-leaf-text.png";

  // Obtener la información del usuario de la cookie
  const userCookie = getCookie("user_eyetracking");
  if (!userCookie) {
    console.error("La cookie user_eyetracking no está definida");
    return;
  }

  // Convertir el contenido de la cookie a un array
  const userData = JSON.parse(userCookie);

  // Obtener el nombre y el apellido del usuario del array
  const nombre = userData[1];
  const apellido = userData[2];

  // Obtener el texto dentro del enlace
  const enlace = document.querySelector(
    ".flex.items-center.md\\:w-1\\/3.justify-center.md\\:justify-start.text-white.pl-4 a"
  );
  const span1 = enlace.querySelector("#span1");
  const texto1Nodes = Array.from(span1.childNodes).filter(
    (node) => node.nodeType === Node.TEXT_NODE
  );
  const texto1 = texto1Nodes.map((node) => node.textContent.trim()).join(" ");
  const texto2 = enlace.querySelector("#span2").textContent.trim();

  const imagen = enlace.querySelector("img");

  // Obtener la fecha y hora actual
  const fechaActual = new Date().toLocaleDateString();
  const horaActual = new Date().toLocaleTimeString();

  const nombreProyectoElemento = document.getElementById("titulo_proyecto");
  let nombreProyecto = "";

  if (nombreProyectoElemento) {
    nombreProyecto = nombreProyectoElemento.textContent
      .trim()
      .replace("Analisis -", "")
      .trim();
  }

  // Obtener el contenido de los gráficos y dividirlos en grupos de dos por página
  const graficosPorPagina = [];
  const graficos = modalReportes.querySelectorAll(".reporte-item");
  graficos.forEach((grafico, index) => {
    if (index % 2 === 0) {
      graficosPorPagina.push([]);
    }
    const paginaActual = Math.floor(index / 2);
    graficosPorPagina[paginaActual].push(grafico.outerHTML);
  });

  const contenidoGraficos = graficosPorPagina
    .map(
      (grupo) => `
    <div style="page-break-after: always; text-align: center; position: relative;">
        <h1 style="font-size: 32px; margin-bottom: 20px; margin-top: 50px;">Información del Reporte</h1>
        <div style="display: flex; flex-direction: column; align-items: center;">
            ${grupo.join("")}
        </div>
    </div>
`
    )
    .join("");


  const contenidoProyecto = `
      <div style="page-break-after: always; text-align: center; position: relative;">
          <!-- Mostrar la imagen oculta en la esquina superior izquierda -->
          <div style="border-radius: 50%; overflow: hidden; width: 100px; height: 100px; margin-right: 20px;">
              <img src="/static/img/logo-sena.png" alt="Imagen" style="width: 100%; height: 100%;">
          </div>
          <div style="display: flex; align-items: center; justify-content: center; margin-top: 60px;">
              <div style="border-radius: 50%; overflow: hidden; width: 100px; height: 100px; top:60px; ">
                  <img src="${imagen.src}" alt="Imagen del usuario" style="width: 100%; height: 100%;">
              </div>
          </div>
          <div style="display: flex; align-items: center; justify-content: center; margin-top: 100px;">
              <span style="font-size: 34px;">${texto1}</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: center; margin-top: 30px;">
              <span style="font-size: 34px;">${texto2}</span>
          </div>
          <p style="margin-top: 100px; font-size: 24px;">Nombre del proyecto: ${nombreProyecto}</p>
          <h1 style="margin-top: 100px; font-size: 24px;">nombre analista: ${nombre} ${apellido}</h1>
          <p style="margin-top: 100px; font-size: 24px;">Fecha y hora de generación de informe:</p>
          <p style="margin-top: 10px;"> ${fechaActual} - ${horaActual}</p>
          <!-- Agregar numeración de páginas -->
          <div id="numeroPagina" style="position: absolute; bottom: 20px; right: 20px; font-size: 14px;"></div>
      </div>
  `;

  html2pdf()
    .set({
      filename: `reportes-${nombreProyecto}-${fechaActual}.pdf`,
      output: "blob",
    })
    .from(contenidoProyecto + contenidoGraficos)
    .toPdf()
    .get("pdf")
    .then(function (pdf) {
      const totalPaginas = pdf.internal.getNumberOfPages();
      const fecha = new Date();
      const mes = fecha.toLocaleString('default', { month: 'long' });
      const año = fecha.getFullYear();

      for (let i = 1; i <= totalPaginas; i++) {
        pdf.setPage(i);
        pdf.setFontSize(14);
        pdf.text(
          `pagina ${i} / ${totalPaginas}`,
          pdf.internal.pageSize.getWidth() - 50,
          pdf.internal.pageSize.getHeight() - 4
        );

        // Agregar el pie de página al lado izquierdo
        pdf.text(
          `${mes} de ${año}`,
          20, // Posición X
          pdf.internal.pageSize.getHeight() - 4 // Posición Y
        );


        pdf.text(
          "análisis de Eye Tracking",
          pdf.internal.pageSize.getWidth() / 2, // Posición X centrada
          pdf.internal.pageSize.getHeight() - 4, // Posición Y
          { align: "center" } // Alineación centrada
        );
      }

      // Mostrar nuevamente los botones de eliminar reporte
      botonesEliminar.forEach((boton) => {
        boton.style.display = "";
      });
    })
    .save()
    .then(() => {
      botonImprimir.style.display = "";

      reportesAgregadosImpacto.clear();
      reportesAgregadosMetricas.clear();

      const reportes = document.querySelectorAll(".reporte-item");
      reportes.forEach((reporte) => {
        reporte.remove();
      });
    });

  validarContenido()
}

function getCookie(name) {
  const cookieValue = document.cookie.match(
    "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"
  );
  return cookieValue ? cookieValue.pop() : null;
}
const userCookie = getCookie("user_eyetracking");
//console.log("Contenido de la cookie user_eyetracking:", userCookie);

function validarContenido() {
  let items = document.querySelectorAll("#modal_reportes>.reporte-item")
  let container_no_reports = document.querySelector("#container-no-data-report")
  console.log(items.length)
  if (items.length < 1) {
    container_no_reports.style.display = "flex"
  } else {
    container_no_reports.style.display = "none"
  }
}

document.addEventListener("DOMContentLoaded", (event) => {
  validarContenido()
});
