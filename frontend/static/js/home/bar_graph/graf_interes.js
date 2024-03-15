let graficoBarras;  // Variable para almacenar el gráfico

// Cargar códigos de referencia y géneros al desplegable
fetch('/graph_interes_data/')
    .then(response => response.json())
    .then(data => {
        const selectRef = document.getElementById('seleccionar-ref');
        const selectGenero = document.getElementById('seleccionar-genero');

        const codigosUnicos = [...new Set(data.datos_interes.map(fila => fila.Ref))];

        // Modificar la línea siguiente para obtener solo 'Masculino' y 'Femenino'
        const generosUnicos = [...new Set(data.datos_interes.filter(fila => fila.Genero === 'Masculino' || fila.Genero === 'Femenino').map(fila => fila.Genero))];

        codigosUnicos.forEach(codigo => {
            const optionRef = document.createElement('option');
            optionRef.value = codigo;
            optionRef.text = codigo;
            selectRef.appendChild(optionRef);
        });

        generosUnicos.forEach(genero => {
            const optionGenero = document.createElement('option');
            optionGenero.value = genero;
            optionGenero.text = genero;
            selectGenero.appendChild(optionGenero);
        });

        // Obtener el primer código de referencia y género disponibles
        const primerCodigoRef = codigosUnicos.length > 0 ? codigosUnicos[0] : null;
        const primerGenero = generosUnicos.length > 0 ? generosUnicos[0] : null;

        // Seleccionar automáticamente el primer código de referencia y género
        if (primerCodigoRef) {
            selectRef.value = primerCodigoRef;
            // Actualizar automáticamente con la opción "todos" al cargar la página
            obtenerDatosYActualizarGrafico(primerCodigoRef, 'todos');
        }

        // Llamar a la función para mostrar el promedio con ambos géneros al cargar
        obtenerDatosYActualizarGrafico(primerCodigoRef, 'todos');
    })
    .catch(error => console.error('Error al obtener datos:', error));

// Eventos cuando se selecciona un código de referencia o género
document.getElementById('seleccionar-ref').addEventListener('change', () => {
    const refSeleccionado = document.getElementById('seleccionar-ref').value;
    const generoSeleccionado = document.getElementById('seleccionar-genero').value;
    obtenerDatosYActualizarGrafico(refSeleccionado, generoSeleccionado);
});
function toggleResumen() {
    const resumenContainer = document.getElementById('resumen-container');
    resumenContainer.style.display = resumenContainer.style.display === 'none' ? 'block' : 'none';
}
document.getElementById('seleccionar-genero').addEventListener('change', () => {
    const refSeleccionado = document.getElementById('seleccionar-ref').value;
    const generoSeleccionado = document.getElementById('seleccionar-genero').value;
    obtenerDatosYActualizarGrafico(refSeleccionado, generoSeleccionado);
});

function obtenerDatosYActualizarGrafico(ref, genero) {
    const url = `/graph_interes_data/?ref=${ref}&genero=${genero}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Filtrar datos solo para el código de referencia seleccionado
            const datosRef = data.datos_interes.filter(fila => fila.Ref === ref);

            // Calcular promedios para todos los datos de la referencia
            const promedioTodos = calcularPromedioPorGenero(datosRef, 'todos');

            // Calcular promedios para el género masculino
            const promedioMasculino = calcularPromedioPorGenero(datosRef, 'Masculino');

            // Calcular promedios para el género femenino
            const promedioFemenino = calcularPromedioPorGenero(datosRef, 'Femenino');

            // Actualizar la tabla de resumen con los promedios calculados
            actualizarTablaResumen([
                { genero: 'Todos', marco: promedioTodos.marco, patas: promedioTodos.patas, puente: promedioTodos.puente },
                { genero: 'Masculino', marco: promedioMasculino.marco, patas: promedioMasculino.patas, puente: promedioMasculino.puente },
                { genero: 'Femenino', marco: promedioFemenino.marco, patas: promedioFemenino.patas, puente: promedioFemenino.puente }
            ]);

            // Actualizar el gráfico de barras
            if (graficoBarras) {
                // Actualizar los datos del gráfico según el género seleccionado
                let datosGrafico;
                if (genero === 'Masculino') {
                    datosGrafico = [promedioMasculino.marco, promedioMasculino.patas, promedioMasculino.puente];
                } else if (genero === 'Femenino') {
                    datosGrafico = [promedioFemenino.marco, promedioFemenino.patas, promedioFemenino.puente];
                } else {
                    datosGrafico = [promedioTodos.marco, promedioTodos.patas, promedioTodos.puente];
                }
                graficoBarras.data.datasets[0].data = datosGrafico;
                graficoBarras.update();
            } else {
                // Crear el gráfico de barras si es la primera vez que se cargan los datos
                graficoBarras = crearGraficoBarras(['Marco', 'Patas', 'Puente'], [
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

function crearGraficoBarras(etiquetas, datos) {
    const ctx = document.getElementById('grafico-barras').getContext('2d');
    if (graficoBarras) {
        graficoBarras.destroy();
    }
    graficoBarras = new Chart(ctx, {
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
    return graficoBarras;
}



function mostrarResumen() {
    const resumenContainer = document.getElementById('resumen-container');
    resumenContainer.style.display = 'block';
}

function actualizarTablaResumen(datos) {
    const tablaBody = document.getElementById('resumen-tabla-body');
    // Limpiar la tabla antes de actualizar
    tablaBody.innerHTML = '';

    datos.forEach(fila => {
        const tr = document.createElement('tr');
        const tdGenero = document.createElement('td');
        const tdMarco = document.createElement('td');
        const tdPatas = document.createElement('td');
        const tdPuente = document.createElement('td');

        tdGenero.textContent = fila.genero;
        tdMarco.textContent = fila.marco.toFixed(3);
        tdPatas.textContent = fila.patas.toFixed(3);
        tdPuente.textContent = fila.puente.toFixed(3);

        tr.appendChild(tdGenero);
        tr.appendChild(tdMarco);
        tr.appendChild(tdPatas);
        tr.appendChild(tdPuente);

        tablaBody.appendChild(tr);
    });
}

