let graficoBarrasImpacto;  // Variable para almacenar el gráfico

// Cargar códigos de referencia y géneros al desplegable
fetch('/graph_impacto_data/')
    .then(response => response.json())
    .then(data => {
        const selectRefImpacto = document.getElementById('seleccionar-ref-impacto');
        const selectGeneroImpacto = document.getElementById('seleccionar-genero-impacto');

        const codigosUnicosImpacto = [...new Set(data.datos_impacto.map(fila => fila.Ref))];

        // Modificar la línea siguiente para obtener solo 'Masculino' y 'Femenino'
        const generosUnicosImpacto = [...new Set(data.datos_impacto.filter(fila => fila.Genero === 'Masculino' || fila.Genero === 'Femenino').map(fila => fila.Genero))];

        codigosUnicosImpacto.forEach(codigo => {
            const optionRefImpacto = document.createElement('option');
            optionRefImpacto.value = codigo;
            optionRefImpacto.text = codigo;
            selectRefImpacto.appendChild(optionRefImpacto);
        });

        generosUnicosImpacto.forEach(genero => {
            const optionGeneroImpacto = document.createElement('option');
            optionGeneroImpacto.value = genero;
            optionGeneroImpacto.text = genero;
            selectGeneroImpacto.appendChild(optionGeneroImpacto);
        });

        // Obtener el primer código de referencia y género disponibles
        const primerCodigoRefImpacto = codigosUnicosImpacto.length > 0 ? codigosUnicosImpacto[0] : null;
        const primerGeneroImpacto = generosUnicosImpacto.length > 0 ? generosUnicosImpacto[0] : null;

        // Seleccionar automáticamente el primer código de referencia y género
        if (primerCodigoRefImpacto) {
            selectRefImpacto.value = primerCodigoRefImpacto;
            // Actualizar automáticamente con la opción "todos" al cargar la página
            obtenerDatosYActualizarGraficoImpacto(primerCodigoRefImpacto, 'todos');
        }

        // Llamar a la función para mostrar el promedio con ambos géneros al cargar
        obtenerDatosYActualizarGraficoImpacto(primerCodigoRefImpacto, 'todos');
    })
    .catch(error => console.error('Error al obtener datos:', error));

// Eventos cuando se selecciona un código de referencia o género
document.getElementById('seleccionar-ref-impacto').addEventListener('change', () => {
    const refSeleccionadoImpacto = document.getElementById('seleccionar-ref-impacto').value;
    const generoSeleccionadoImpacto = document.getElementById('seleccionar-genero-impacto').value;
    obtenerDatosYActualizarGraficoImpacto(refSeleccionadoImpacto, generoSeleccionadoImpacto);
});

document.getElementById('seleccionar-genero-impacto').addEventListener('change', () => {
    const refSeleccionadoImpacto = document.getElementById('seleccionar-ref-impacto').value;
    const generoSeleccionadoImpacto = document.getElementById('seleccionar-genero-impacto').value;
    obtenerDatosYActualizarGraficoImpacto(refSeleccionadoImpacto, generoSeleccionadoImpacto);
});

function toggleResumenImpacto() {
    const resumenContainerImpacto = document.getElementById('resumen-container-impacto');
    resumenContainerImpacto.style.display = resumenContainerImpacto.style.display === 'none' ? 'block' : 'none';
}

function obtenerDatosYActualizarGraficoImpacto(ref, genero) {
    const urlImpacto = `/graph_impacto_data/?ref=${ref}&genero=${genero}`;
    fetch(urlImpacto)
        .then(response => response.json())
        .then(data => {
            // Filtrar datos solo para el código de referencia seleccionado
            const datosRef = data.datos_impacto.filter(fila => fila.Ref === ref);

            // Calcular promedios para todos los datos de la referencia
            const promedioTodos = calcularPromedioPorGenero(datosRef, 'todos');

            // Calcular promedios para el género masculino
            const promedioMasculino = calcularPromedioPorGenero(datosRef, 'Masculino');

            // Calcular promedios para el género femenino
            const promedioFemenino = calcularPromedioPorGenero(datosRef, 'Femenino');

            // Actualizar la tabla de resumen con los promedios calculados
            actualizarTablaResumenImpacto([
                { genero: 'Todos', marco: promedioTodos.marco, patas: promedioTodos.patas, puente: promedioTodos.puente },
                { genero: 'Masculino', marco: promedioMasculino.marco, patas: promedioMasculino.patas, puente: promedioMasculino.puente },
                { genero: 'Femenino', marco: promedioFemenino.marco, patas: promedioFemenino.patas, puente: promedioFemenino.puente }
            ]);

            // Actualizar el gráfico de barras
            if (graficoBarrasImpacto) {
                // Actualizar los datos del gráfico según el género seleccionado
                let datosGrafico;
                if (genero === 'Masculino') {
                    datosGrafico = [promedioMasculino.marco, promedioMasculino.patas, promedioMasculino.puente];
                } else if (genero === 'Femenino') {
                    datosGrafico = [promedioFemenino.marco, promedioFemenino.patas, promedioFemenino.puente];
                } else {
                    datosGrafico = [promedioTodos.marco, promedioTodos.patas, promedioTodos.puente];
                }
                graficoBarrasImpacto.data.datasets[0].data = datosGrafico;
                graficoBarrasImpacto.update();
            } else {
                // Crear el gráfico de barras si es la primera vez que se cargan los datos
                graficoBarrasImpacto = crearGraficoBarrasImpacto(['Marco', 'Patas', 'Puente'], [
                    promedioTodos.marco,
                    promedioTodos.patas,
                    promedioTodos.puente
                ]);
            }
        })
        .catch(error => console.error('Error al obtener datos:', error));
}



function calcularPromedioPorGenero(datos, genero) {
    const datosFiltrados = genero === 'todos' ? datos : datos.filter(fila => fila.Genero === genero);
    const marcoValues = datosFiltrados.map(fila => fila.Marco).filter(valor => valor !== undefined && valor !== null);
    const patasValues = datosFiltrados.map(fila => fila.Patas).filter(valor => valor !== undefined && valor !== null);
    const puenteValues = datosFiltrados.map(fila => fila.Puente).filter(valor => valor !== undefined && valor !== null);

    return {
        marco: calcularPromedio(marcoValues),
        patas: calcularPromedio(patasValues),
        puente: calcularPromedio(puenteValues)
    };
}



function calcularPromedio(valores) {
    const suma = valores.reduce((total, valor) => total + valor, 0);
    return suma / valores.length;
}

function crearGraficoBarrasImpacto(etiquetas, datos) {
    const ctxImpacto = document.getElementById('grafico-barras-impacto').getContext('2d');
    if (graficoBarrasImpacto) {
        graficoBarrasImpacto.destroy();
    }
    graficoBarrasImpacto = new Chart(ctxImpacto, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Promedio',
                data: datos,
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 205, 86, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 205, 86, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    return graficoBarrasImpacto;
}



function mostrarResumenImpacto() {
    const resumenContainerImpacto = document.getElementById('resumen-container-impacto');
    resumenContainerImpacto.style.display = 'block';
}

function actualizarTablaResumenImpacto(datos) {
    const tablaBodyImpacto = document.getElementById('resumen-tabla-body-impacto');
    // Limpiar la tabla antes de actualizar
    tablaBodyImpacto.innerHTML = '';

    datos.forEach(fila => {
        const trImpacto = document.createElement('tr');
        const tdGeneroImpacto = document.createElement('td');
        const tdMarcoImpacto = document.createElement('td');
        const tdPatasImpacto = document.createElement('td');
        const tdPuenteImpacto = document.createElement('td');

        tdGeneroImpacto.textContent = fila.genero;
        tdMarcoImpacto.textContent = fila.marco.toFixed(3);
        tdPatasImpacto.textContent = fila.patas.toFixed(3);
        tdPuenteImpacto.textContent = fila.puente.toFixed(3);

        trImpacto.appendChild(tdGeneroImpacto);
        trImpacto.appendChild(tdMarcoImpacto);
        trImpacto.appendChild(tdPatasImpacto);
        trImpacto.appendChild(tdPuenteImpacto);

        tablaBodyImpacto.appendChild(trImpacto);
    });
}
