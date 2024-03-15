function convertExcelToJson() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (file) {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function (results) {
        const jsonData = results.data;
        const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], {
          type: "application/json",
        });
        saveAs(jsonBlob, "data.json");
      },
      error: function (error) {
        console.error("Error al procesar el archivo CSV:", error);
      },
    });
  }
}
