window.addEventListener("load", function () {
  // Sección de métricas
  const filtroSelect_pupil_range = document.getElementById("filtroSelect_pupil_range");
  const filtroMetricas1 = document.getElementById("filtro_metricas_1");
  configurarSelectListener(filtroSelect_pupil_range, filtroMetricas1);

  const recordingNameSelect = document.getElementById("recordingNameSelect");
  const filtroMetricas2 = document.getElementById("filtro_metricas_2");
  configurarSelectListener(recordingNameSelect, filtroMetricas2);

  // Sección de intereses
  const seleccionarRef = document.getElementById("seleccionar-ref");
  const filtroInteres1 = document.getElementById("filtro_interes_1");
  configurarSelectListener(seleccionarRef, filtroInteres1, true);

  const seleccionarGenero = document.getElementById("seleccionar-genero");
  const filtroInteres2 = document.getElementById("filtro_interes_2");
  configurarSelectListener(seleccionarGenero, filtroInteres2, true);

  // Sección de impacto
  const seleccionarRefImpacto = document.getElementById("seleccionar-ref-impacto");
  const filtroImpacto1 = document.getElementById("filtro_impacto_1");
  configurarSelectListener(seleccionarRefImpacto, filtroImpacto1, true);

  const seleccionarGeneroImpacto = document.getElementById("seleccionar-genero-impacto");
  const filtroImpacto2 = document.getElementById("filtro_impacto_2");
  configurarSelectListener(seleccionarGeneroImpacto, filtroImpacto2, true);
});

function configurarSelectListener(selectElement, smallElement, verificarRefGenero = false) {
  if (selectElement && smallElement) {
    if (selectElement.options.length > 0) {
      if (verificarRefGenero && (selectElement.value === "" || selectElement.value === "0")) {
        console.error("Debe seleccionar una referencia y un género.");
        return;
      }
      smallElement.textContent = selectElement.options[0].textContent;
      selectElement.addEventListener("change", function () {
        smallElement.textContent = this.options[this.selectedIndex].textContent;
      });
    } else {
      console.error("No hay opciones definidas en el select:", selectElement.id);
    }
  } else {
    console.error("Los elementos select y small deben estar definidos.");
  }
}
