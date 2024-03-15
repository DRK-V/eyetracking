// Declarar variables globales
const fileListElement = document.getElementById('fileList');
const containerFilesUploaded = document.getElementById('container_files_uploaded');
const uploadedFiles = new Set(); // Usamos un Set para evitar duplicados
const uploadButton = document.getElementById('uploadButton');

const excelFileInput = document.getElementById('excelFileInput');
const excelFileListElement = document.getElementById('excelFileList');
const containerExcelFilesUploaded = document.getElementById('container_excel_files_uploaded');
const uploadedExcelFiles = new Set(); // Usamos un Set para evitar duplicados
const uploadExcelButton = document.getElementById('uploadExcelButton');

// Lógica para cargar archivos normales
document.getElementById('fileInput').addEventListener('change', () => uploadFiles(fileListElement, uploadedFiles, uploadButton, containerFilesUploaded));

// Lógica para subir archivos normales
uploadButton.addEventListener('click', () => {
    console.log('Archivos a enviar:');
    uploadedFiles.forEach(file => console.log(file));
});


if (excelFileInput) {
    // Lógica para cargar archivos Excel
    excelFileInput.addEventListener('change', () => uploadFiles(excelFileListElement, uploadedExcelFiles, uploadExcelButton, containerExcelFilesUploaded));
}

function uploadFiles(listElement, fileList, uploadButton, containerFilesUploaded, callback) {
    const inputElement = listElement === fileListElement ? document.getElementById('fileInput') : document.getElementById('excelFileInput');
    const fileListArray = inputElement.files;

    for (let i = 0; i < fileListArray.length; i++) {
        const file = fileListArray[i];
        // Verificar si el archivo ya está en la lista
        if (!fileList.has(file.name)) {
            console.log(`Archivo${listElement === fileListElement ? '' : ' Excel'} ${i + 1}: ${file.name}`);
            fileList.add(file.name);
            createFileListItem(listElement, file, fileList, uploadButton, containerFilesUploaded);
        } else {
            console.log(`El archivo ${file.name} ya está seleccionado.`);
        }
    }

    if (fileList.size > 0) {
        containerFilesUploaded.style.display = 'flex';
        uploadButton.disabled = false;
    }

    // Llama a la función de callback si se proporciona
    if (callback && typeof callback === 'function') {
        callback();
    }
}

// Función para crear elementos de la interfaz para archivos y archivos Excel
function createFileListItem(listElement, file, fileList, uploadButton, containerFilesUploaded) {
    const listItem = document.createElement('li');
    listItem.className = listElement === fileListElement ? 'lista_archivos' : 'lista_archivos_excel';
    listItem.textContent = file.name;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'text-red-500 ml-2';
    const iconBtn = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
    `;
    deleteButton.onclick = createDeleteHandler(listItem, file, fileList, uploadButton, containerFilesUploaded); // Corrección aquí

    deleteButton.innerHTML = iconBtn;
    listItem.appendChild(deleteButton);
    listElement.appendChild(listItem);
}

// Función para crear un manejador de eliminación para cada elemento
function createDeleteHandler(item, file, fileList, uploadButton, containerFilesUploaded) {
    return function () {
        console.log('Eliminando archivo:', file.name);
        item.remove();

        // Eliminar solo el elemento de la interfaz, no el nombre del archivo de la lista
        fileList.delete(file.name);

        if (fileList.size === 0) {
            containerFilesUploaded.style.display = 'none';
            uploadButton.disabled = true;
        }
    };
}
