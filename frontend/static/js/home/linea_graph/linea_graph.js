//linea_graph.js
let metricasGlobal = [];

// Migrar las variables relacionadas con el zoom y el deslizar
let isNearBoundary = false;
let timeBottomScale = null;
let chartConfig = null;
let isZooming = false;
let canvas = document.getElementById('myChart');
const colors = ['rgba(61, 114, 170, 0.8)', 'rgba(122, 221, 239, 0.8)', 'rgba(174, 61, 120, 0.8)', 'rgba(0, 0, 0, 0.8)', 'rgba(58, 178, 42, 0.8)'];
let ctrlKeyHeld = false;
let isDragging = false;
let dragStartX = 0;
let lastDeltaX = 0;

// Migrar las funciones de manejo del zoom y el deslizar
function handleZoomStart() {
    console.log('zoom');
    isZooming = true;
}

function handleZoomEnd() {
    console.log('zoom false');
    isZooming = false;
}


function updateBoundaryState(chart) {
    if (!chart || !chart.scales || !chart.scales.timeBottom) {
        isNearBoundary = false;
        timeBottomScale = null;
        return;
    }

    timeBottomScale = chart.scales.timeBottom;
    isNearBoundary = timeBottomScale.left <= 0 || timeBottomScale.right >= chart.width;
}

function isAtDataBoundary(chart) {
    if (!chart || !chart.scales || !chart.scales.x) {
        return false;
    }

    let xAxis = chart.scales.x;
    let currentX = xAxis.getValueForPixel(dragStartX);

    return currentX <= xAxis.min || currentX >= xAxis.max;
}

// Migrar los eventos de mouse y rueda del ratón
document.addEventListener('mousedown', function (e) {
    isDragging = true;
    dragStartX = e.clientX;
    lastDeltaX = 0;
    updateBoundaryState(myChart);
});

document.addEventListener('mousemove', function (e) {
    if (isDragging && !isZooming) {
        let deltaX = dragStartX - e.clientX;
        updateBoundaryState(myChart);
        if (myChart && isAtDataBoundary(myChart)) {
            console.log('isAtDataBoundary true');
            deltaX = 0;
        }

        myChart.pan({ x: (deltaX * 2) * -1 });
        lastDeltaX = deltaX;

        dragStartX = e.clientX;
    }
});

document.addEventListener('mouseup', function () {
    isDragging = false;
});

// ... [El resto del código anterior]
// Función para manejar las coordenadas


canvas.addEventListener('wheel', function (e) {
    // Verificar si se mantiene presionada la tecla Ctrl y si el modo de zoom es 'x'
    if (e.ctrlKey && myChart.options.plugins.zoom.zoom.mode === 'x') {
        e.preventDefault();
        const proposedPan = e.deltaX;
        updateBoundaryState(myChart);

        if (isNearBoundary) {
            const panLimit = calculatePanLimit(proposedPan);
            myChart.pan({ x: panLimit });
        } else {
            myChart.pan({ x: proposedPan });
        }
    }

    // Llamar a la función para manejar las coordenadas independientemente del estado de la tecla Ctrl
    handleCoordinates(e.clientX, e.clientY);
});

function reiniciarGrafico() {
    // Reinicia los datasets y etiquetas del gráfico
    myChart.data.datasets = [];
    myChart.data.labels = [];

    // Usa los datos filtrados que ya tienes disponibles para actualizar el gráfico
    const recordingNameSeleccionado = document.getElementById('recordingNameSelect').value;
    filtrarYActualizarGrafico(recordingNameSeleccionado, document.getElementById('filtroSelect_pupil_range').value);

    // Restablece el zoom del gráfico
    myChart.resetZoom();

    // Actualiza el gráfico
    myChart.update();

    // Establece el nombre de la imagen como "imagen_1"
    nombreImagenActual = "imagen_1";

    // Imprime el nombre de la imagen en la consola
    console.log("nombreImagenActual =", nombreImagenActual);
}


function handleChartZoom(chartInstance) {
    updateBoundaryState(chartInstance);
    const zoomFactor = chartInstance.scales.timeBottom.getZoomLevel();
    const proposedMin = timeBottomScale.min - (timeBottomScale.max - timeBottomScale.min) / zoomFactor;

    // Establecer límites para evitar el zoom excesivo cerca de tiempo 0
    const minZoomFactor = timeBottomScale.width / (timeBottomScale.max - timeBottomScale.min);
    const maxZoomFactor = 2; // Ajusta según sea necesario

    if (proposedMin <= 0 || zoomFactor > maxZoomFactor) {
        return false; // No permitir el zoom si se superan los límites
    }
    return true; // Permitir el zoom
}

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: []
    },
    options: {
        elements: {
            line: {
                tension: 0.4,
            }
        },
        plugins: {
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                        start: handleZoomStart,
                        end: handleZoomEnd,
                    },
                    pinch: {
                        enabled: true,
                        start: handleZoomStart,
                        end: handleZoomEnd,
                    },
                    mode: 'x',
                },
                pan: {
                    enabled: true,
                    mode: 'x',
                },
                beforeZoom: function (chartInstance, args) {
                    return handleChartZoom(chartInstance);
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const timeIndex = context.dataIndex;
                        const minute = Math.floor(timeInSeconds[timeIndex] / 60);
                        const second = (timeInSeconds[timeIndex] % 60).toFixed(2);
                        return [`Minuto ${minute}`, `Segundo ${second}`, `${context.parsed.y}`];
                    }
                }
            },
            tooltip: {
                callbacks: {
                    // Función opcional para personalizar el tooltip
                    label: function (context) {
                        return context.dataset.label + ': ' + context.parsed.y + " (Tiempo: " + context.parsed.x + " mins)";
                    }

                }
            }
        }
    }
});


function filtrarYActualizarGrafico(recordingNameSeleccionado, filtroSeleccionado) {
    // Aquí puedes utilizar metricasGlobal y recordingNameSeleccionado
    actualizarGrafico(metricasGlobal, recordingNameSeleccionado, filtroSeleccionado);
}

function cargarMasDatos(participante, datos) {
    const recording_name = document.getElementById('recordingNameSelect').value;
    if (!datos) {
        console.log('recording name', recording_name)
        fetch(`/graph_data/?recording_name=${recording_name}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.    log('Datos recibidos:', data.metricas);
                metricasGlobal = data.metricas;
                // console.log(`metricas global 204: ${metricasGlobal}`)
                // Procesar y llenar el select
                const selectElement = document.getElementById('recordingNameSelect');
                selectElement.innerHTML = '';  // Limpiar opciones previas

                // Agregar las opciones al select basadas en el array de participantes
                data.participantes.forEach(participante => {
                    const option = document.createElement('option');
                    option.value = participante;
                    option.text = participante;
                    selectElement.appendChild(option);
                });

                // Una vez llenado el select, también puedes actualizar el gráfico si lo deseas
                const recordingNameSeleccionado = selectElement.value;
                // console.log(`seleccionado: ${recordingNameSeleccionado}`)
                actualizarGrafico(data.metricas, recordingNameSeleccionado);
            })
            .catch(error => console.error('Error al obtener los datos:', error));
        return
    }

    console.log('recording name', participante)
    fetch(`/graph_data/?recording_name=${recording_name}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // console.log('Datos recibidos:', data.metricas);
            datos = data.metricas
            // console.log(`datos de participante: ${participante}`)
            // Procesar y llenar el select
            // const selectElement = document.getElementById('recordingNameSelect');
            // selectElement.innerHTML = '';  // Limpiar opciones previas

            // // Agregar las opciones al select basadas en el array de participantes
            // data.participantes.forEach(participante => {
            //     const option = document.createElement('option');
            //     option.value = participante;
            //     option.text = participante;
            //     selectElement.appendChild(option);
            // });
            // Una vez llenado el select, también puedes actualizar el gráfico si lo deseas
            const recordingNameSeleccionado = participante;
            // console.log(`seleccionado: ${recordingNameSeleccionado}`)
            actualizarGrafico(data.metricas, recordingNameSeleccionado);
        })
        .catch(error => console.error('Error al obtener los datos:', error));
    // console.log(`GRAPH DATA CUANDO HAY PARAMETRO DATA: ${datos}`)
    return datos
}



function actualizarGrafico(metricas, recordingNameSeleccionado, filtroSeleccionado) {
    metricas.sort((a, b) => a[4] - b[4]);
    myChart.data.datasets = []; // Limpiar conjuntos de datos existentes

    let datosFiltradosIzq = [];
    let datosFiltradosDer = [];
    let tiempoEtiquetas = [];

    // Filtrar y organizar los datos
    metricas.forEach(item => {
        if (item[1]) {
            tiempoEtiquetas.push(parseFloat(item[4])); // Guardar el tiempo
            datosFiltradosIzq.push({ x: parseFloat(item[4]), y: parseFloat(item[2]) }); // Guardar los datos de Pupil Diameter Left
            datosFiltradosDer.push({ x: parseFloat(item[4]), y: parseFloat(item[3]) }); // Guardar los datos de Pupil Diameter Right
        }
    });

    // Determinar qué datos se mostrarán según el filtro seleccionado
    switch (filtroSeleccionado) {
        case 'altos':
            // Filtrar datos altos según el filtro seleccionado
            datosFiltradosIzq = datosFiltradosIzq.filter(item => item.y > 3.3);
            datosFiltradosDer = datosFiltradosDer.filter(item => item.y > 3.3);
            break;
        case 'medios':
            // Filtrar datos medios según el filtro seleccionado
            datosFiltradosIzq = datosFiltradosIzq.filter(item => item.y >= 2.7 && item.y <= 3.3);
            datosFiltradosDer = datosFiltradosDer.filter(item => item.y >= 2.7 && item.y <= 3.3);
            break;
        case 'bajos':
            // Filtrar datos bajos según el filtro seleccionado
            datosFiltradosIzq = datosFiltradosIzq.filter(item => item.y < 2.6);
            datosFiltradosDer = datosFiltradosDer.filter(item => item.y < 2.6);
            break;
    }

    // Agregar conjuntos de datos al gráfico
    myChart.data.datasets.push({
        label: 'Pupil Diameter Left',
        data: datosFiltradosIzq,
        fill: false,
        borderColor: 'blue'
    });

    myChart.data.datasets.push({
        label: 'Pupil Diameter Right',
        data: datosFiltradosDer,
        fill: false,
        borderColor: 'red'
    });

    // Actualizar etiquetas de tiempo
    myChart.data.labels = tiempoEtiquetas;

    // Actualizar el gráfico
    myChart.update();
}



// Evento para actualizar el gráfico cuando se selecciona un nuevo registro
document.getElementById('recordingNameSelect').addEventListener('change', function () {
    const recordingNameSeleccionado = this.value;
    // console.log(`Evento de cambio disparado ${recordingNameSeleccionado}`);
    metricasGlobal = cargarMasDatos(recordingNameSeleccionado, metricasGlobal)
    // filtrarYActualizarGrafico(recordingNameSeleccionado, document.getElementById('filtroSelect_pupil_range').value);
});

// Evento para actualizar el gráfico cuando se cambia el filtro
document.getElementById('filtroSelect_pupil_range').addEventListener('change', function () {
    const recordingNameSeleccionado = document.getElementById('recordingNameSelect').value;
    filtrarYActualizarGrafico(recordingNameSeleccionado, this.value);
});

// Evento para cargar más datos al hacer scroll
// document.getElementById('graph-div').addEventListener('scroll', function () {
//     if (this.scrollTop + this.clientHeight >= this.scrollHeight) {
//         const currentPage = parseInt(this.dataset.currentPage) || 1;
//         this.dataset.currentPage = currentPage + 1;

//         const nextStart = (currentPage) * 10;
//         const nextEnd = nextStart + 10;

//         cargarMasDatos(currentPage + 1, 10);
//     }
// });

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

cargarMasDatos(1);