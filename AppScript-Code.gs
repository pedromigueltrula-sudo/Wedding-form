function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var parsedData = JSON.parse(e.postData.contents);
  
  // Insertar fila en Google Sheets
  // Asegúrate de que las cabeceras en tu hoja sean: Timestamp, Nombre, Teléfono, Alergias/Dietas, Bus, Tipo Alojamiento, Específico, Acompañantes, Estado Reserva
  sheet.appendRow([
    new Date(), 
    parsedData.name,
    parsedData.email,
    parsedData.phone,
    parsedData.allergies, 
    parsedData.bus, 
    parsedData.accommodationType, 
    parsedData.accommodationSpecific, 
    parsedData.accommodationCompanions, 
    parsedData.accommodationStatus
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({"status": "success"})).setMimeType(ContentService.MimeType.JSON);
}

// Para permitir CORS (preflight options request) si fuera necesario en el futuro
function doOptions(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
}
