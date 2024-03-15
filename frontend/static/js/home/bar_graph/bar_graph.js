// // bar_graph.js
// let data = [
//     {
//         Participant: 'Diego Aponte',
//         Edad: 22,
//         Genero: 'Masculino',
//         Marco: 0.26,
//         Patas: 1.06,
//         Puente: 3.01,
//         Average: 1.44,
//         Median: 1.06,
//         Count: 3,
//         'Total Time of Interest Duration': 12.98,
//     },
//     {
//         Participant: 'Alejandro Correa',
//         Edad: 22,
//         Genero: 'Masculino',
//         Marco: 0.00,
//         Patas: 0.38,
//         Puente: 2.34,
//         Average: 0.91,
//         Median: 0.38,
//         Count: 3,
//         'Total Time of Interest Duration': 12.30,
//     },
//     {
//         Participant: 'Daniela Torres',
//         Edad: 25,
//         Genero: 'Femenino',
//         Marco: 0.15,
//         Patas: 0.75,
//         Puente: 2.90,
//         Average: 1.25,
//         Median: 0.75,
//         Count: 3,
//         'Total Time of Interest Duration': 13.20,
//     },
//     {
//         Participant: 'Carlos Ramirez',
//         Edad: 28,
//         Genero: 'Masculino',
//         Marco: 0.10,
//         Patas: 1.20,
//         Puente: 2.50,
//         Average: 1.30,
//         Median: 1.20,
//         Count: 3,
//         'Total Time of Interest Duration': 11.90,
//     },
//     {
//         Participant: 'Laura Gomez',
//         Edad: 24,
//         Genero: 'Femenino',
//         Marco: 0.20,
//         Patas: 0.90,
//         Puente: 3.20,
//         Average: 1.60,
//         Median: 0.90,
//         Count: 3,
//         'Total Time of Interest Duration': 13.40,
//     },
//     {
//         Participant: 'Miguel Torres',
//         Edad: 26,
//         Genero: 'Masculino',
//         Marco: 0.30,
//         Patas: 1.40,
//         Puente: 2.70,
//         Average: 1.45,
//         Median: 1.40,
//         Count: 3,
//         'Total Time of Interest Duration': 11.80,
//     },
//     {
//         Participant: 'Isabella Rodriguez',
//         Edad: 23,
//         Genero: 'Femenino',
//         Marco: 0.25,
//         Patas: 1.10,
//         Puente: 2.80,
//         Average: 1.30,
//         Median: 1.10,
//         Count: 3,
//         'Total Time of Interest Duration': 12.70,
//     },
//     {
//         Participant: 'Juan Perez',
//         Edad: 30,
//         Genero: 'Masculino',
//         Marco: 0.15,
//         Patas: 1.00,
//         Puente: 3.50,
//         Average: 1.20,
//         Median: 1.00,
//         Count: 3,
//         'Total Time of Interest Duration': 13.10,
//     },
//     {
//         Participant: 'Camila Sanchez',
//         Edad: 27,
//         Genero: 'Femenino',
//         Marco: 0.18,
//         Patas: 0.80,
//         Puente: 2.40,
//         Average: 1.15,
//         Median: 0.80,
//         Count: 3,
//         'Total Time of Interest Duration': 12.50,
//     },
//     {
//         Participant: 'Ricardo Martinez',
//         Edad: 32,
//         Genero: 'Masculino',
//         Marco: 0.22,
//         Patas: 1.30,
//         Puente: 3.00,
//         Average: 1.40,
//         Median: 1.30,
//         Count: 3,
//         'Total Time of Interest Duration': 12.90,
//     },
// ];

// Obtén referencias a elementos HTML
let summaryContainer = document.getElementById('summaryContainer');
let generalSummaryContainer = document.getElementById('generalSummaryContainer');
let genderSummaryContainer = document.getElementById('genderSummaryContainer');
let showSummaryButton = document.getElementById('showSummaryButton');//boton de mostrar resumen

let genderFilter = document.getElementById('genderFilter');
let attributeFilter = document.getElementById('attributeFilter');
let barChartCanvas = document.getElementById('barChart_interes');
let ageFilterSelect = document.getElementById('ageFilterSelect');

// Obtén los atributos disponibles en los datos
let availableAttributes = Object.keys(data[0]).filter(key => key !== 'Participant' && key !== 'Genero');

// funcion para mostrar y ocultar resumen:
showSummaryButton.addEventListener('click', () => {
    // Muestra u oculta los resúmenes según su estado actual
    const isHidden = summaryContainer.style.display === 'none';
    summaryContainer.style.display = isHidden ? 'block' : 'none';
    generalSummaryContainer.style.display = isHidden ? 'block' : 'none';
    genderSummaryContainer.style.display = isHidden ? 'block' : 'none';

    // Cambia el texto del botón
    showSummaryButton.innerText = isHidden ? 'Ocultar Resumen' : 'Mostrar Resumen';
});


// Llena el segundo select con los atributos disponibles
availableAttributes.forEach(attribute => {
    let option = document.createElement('option');
    option.value = attribute;
    option.text = attribute;
    attributeFilter.add(option);
});

let barChart;
let zoomLevel = 1;

function handleZoom(event) {
    const delta = event.deltaY;
    const scaleFactor = 0.02;

    if (delta > 0) {
        zoomLevel += scaleFactor;
    } else {
        zoomLevel -= scaleFactor;
    }

    generateBarChart(filteredData, attributeFilter.value);
}

function handlePan(event) {
    const panFactor = 10;

    if (barChart) {
        if (event.key === 'ArrowLeft') {
            barChart.options.scales.xAxes[0].ticks.min -= panFactor;
            barChart.options.scales.xAxes[0].ticks.max -= panFactor;
        } else if (event.key === 'ArrowRight') {
            barChart.options.scales.xAxes[0].ticks.min += panFactor;
            barChart.options.scales.xAxes[0].ticks.max += panFactor;
        }

        barChart.update();
    }
}

function processData(data) {
    let processedData = {};

    // Itera sobre cada participante
    data.forEach(participant => {
        // Itera sobre cada campo (excluyendo 'Participant' y 'Genero')
        Object.keys(participant).forEach(key => {
            if (key !== 'Participant' && key !== 'Genero') {
                // Inicializa el objeto si es la primera vez que se encuentra el campo
                if (!processedData[key]) {
                    processedData[key] = {
                        max: -Infinity,
                        min: Infinity,
                        sum: 0,
                        count: 0,
                        variance: 0,
                    };
                }

                // Actualiza los valores de máximo, mínimo y suma
                const value = participant[key];
                processedData[key].max = Math.max(processedData[key].max, value);
                processedData[key].min = Math.min(processedData[key].min, value);
                processedData[key].sum += value;
                processedData[key].count++;
            }
        });
    });

    // Calcula los promedios, diferencias y varianzas
    Object.keys(processedData).forEach(key => {
        processedData[key].average = processedData[key].sum / processedData[key].count;
        processedData[key].difference = processedData[key].max - processedData[key].min;
        processedData[key].variance = calculateVariance(data, key, processedData[key].average);
    });

    return processedData;
}

function calculateVariance(data, key, average) {
    const sumOfSquares = data.reduce((sum, participant) => {
        return sum + Math.pow(participant[key] - average, 2);
    }, 0);

    return sumOfSquares / (data.length - 1);
}

// Función para generar el gráfico de barras
function generateBarChart(data, selectedAttribute) {
    // Extrae el nombre de los participantes y los valores específicos del atributo seleccionado
    let participantNames = data.map(participant => participant.Participant);
    let attributeValues = data.map(participant => participant[selectedAttribute]);

    let dataset = [
        {
            label: selectedAttribute,
            data: attributeValues,
            backgroundColor: getRandomColor(),
            borderColor: getRandomColor(),
            borderWidth: 1
        },
    ];

    let ctx = barChartCanvas.getContext('2d');

    // Destruye el gráfico existente si ya existe
    if (barChart) {
        barChart.destroy();
    }

    barChart = new Chart(ctx, {
        type: 'bar',
        data: { labels: participantNames, datasets: dataset },
        options: {
            scales: {
                yAxes: [{
                    ticks: { beginAtZero: true }
                }],
            },
            plugins: {
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true,
                        },
                        mode: 'xy',
                        onZoom: handleZoom
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                        onPan: handlePan
                    },
                },
            },
        },
    });
}

function getRandomColor() {
    return `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`;
}

function filterDataByGender(gender) {
    return gender === 'todos' ? data : data.filter(item => item.Genero === gender);
}

// Evento de cambio en el filtro de género
genderFilter.addEventListener('change', () => {
    updateChart();
});

// Evento de cambio en el filtro de atributo
attributeFilter.addEventListener('change', () => {
    updateChart();
    displayAllSummaries(data, attributeFilter.value);
});

function updateChart() {
    let selectedGender = genderFilter.value;
    let selectedAttribute = attributeFilter.value;

    let filteredData = filterDataByGender(selectedGender);
    generateBarChart(filteredData, selectedAttribute);
}

// Función para mostrar todos los resúmenes
function displayAllSummaries(data, selectedAttribute) {
    // Muestra el resumen original
    // displaySummary(data, selectedAttribute);

    // Muestra el resumen general
    displayGeneralSummaryExtended(data);

    // Muestra el resumen por género
    // displayGenderSummary(data, selectedAttribute);
}

// Función para mostrar el resumen
// function displaySummary(data, selectedAttribute) {
//     // Procesa los datos para obtener máximos, mínimos y promedios generales
//     let processedData = processData(data);

//     // Obtiene la información específica del atributo seleccionado
//     let attributeInfo = processedData[selectedAttribute];

//     // Crea el mensaje de resumen
//     let summaryMessage = `
//             <p><strong>Resumen para ${selectedAttribute}:</strong></p>
//             <ul>
//                 <li>Máximo: ${attributeInfo.max}</li>
//                 <li>Mínimo: ${attributeInfo.min}</li>
//                 <li>Promedio: ${attributeInfo.average.toFixed(2)}</li>
//             </ul>
//         `;

//     // Muestra el resumen en el contenedor
//     summaryContainer.innerHTML = summaryMessage;
// }

// Función para mostrar el resumen general extendido
function displayGeneralSummaryExtended(data) {
    // Procesa los datos para obtener estadísticas generales
    let processedData = processData(data);

    // Obtiene la información específica del atributo seleccionado
    let attributeInfo = processedData[attributeFilter.value];

    // Crea el mensaje de resumen general
    let generalSummaryMessage = `
        <p>Resumen General Extendido para ${attributeFilter.value}:</p>
        <table border="1">
            <tr>
                <th></th>
                <th>Masculino</th>
                <th>Femenino</th>
                <th>General</th>
            </tr>
            <tr>
                <td>Máximo</td>
                <td>${processedData[attributeFilter.value].max}</td>
                <td>${processedData[attributeFilter.value].min}</td>
                <td>${attributeInfo.max}</td>
            </tr>
            <tr>
                <td>Mínimo</td>
                <td>${processedData[attributeFilter.value].min}</td>
                <td>${processedData[attributeFilter.value].min}</td>
                <td>${attributeInfo.min}</td>
            </tr>
            <tr>
                <td>Promedio</td>
                <td>${processedData[attributeFilter.value].average.toFixed(2)}</td>
                <td>${processedData[attributeFilter.value].average.toFixed(2)}</td>
                <td>${attributeInfo.average.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Count</td>
                <td>${processedData[attributeFilter.value].count}</td>
                <td>${processedData[attributeFilter.value].count}</td>
                <td>${data.length}</td>
            </tr>
            <tr>
                <td>Variance</td>
                <td>${processedData[attributeFilter.value].variance.toFixed(2)}</td>
                <td>${processedData[attributeFilter.value].variance.toFixed(2)}</td>
                
                <td>${calculateVariance(data, attributeFilter.value, attributeInfo.average).toFixed(2)}</td>
            </tr>
        </table>
    `;

    // Muestra el resumen general en el contenedor correspondiente
    generalSummaryContainer.innerHTML = generalSummaryMessage;
}

// Evento de cambio en el filtro de género
genderFilter.addEventListener('change', () => {
    updateChart();
    displayAllSummaries(data, attributeFilter.value);
});


generateBarChart(data, availableAttributes[0]);
displayAllSummaries(data, availableAttributes[0]);  