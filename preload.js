const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("comunicacion", {
  nuevoRegistroTotalPaginas: (datos) =>
    ipcRenderer.send("nuevoRegistroTotalPaginas", datos),
  nuevoRegistroImagenes: (imagenes) =>
    ipcRenderer.send("nuevoRegistroImagenes", imagenes),
  queryTotalPaginas: (query) => ipcRenderer.send("queryTotalPaginas", query),
  resultTotalPaginas: (canal, callback) =>
    ipcRenderer.on("result-TotalPaginas", callback),
  queryImagenes: (query) => ipcRenderer.send("queryImagenes", query),
  resultImagenes: (canal, callback) =>
    ipcRenderer.on("result-Imagenes", callback),
});
