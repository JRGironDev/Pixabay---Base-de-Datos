const { app, BrowserWindow, ipcMain, ipcRenderer } = require("electron");
const path = require("path");
const mysql = require("mysql2");

/**
 * Crear la conexión
 */
const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "pixabay",
});

let ventana;

function createWindow() {
  ventana = new BrowserWindow({
    width: 1300,
    height: 1300,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(app.getAppPath(), "preload.js"),
    },
  });
  ventana.loadFile("index.html");
}

app.whenReady().then(createWindow);

ipcMain.on("nuevoRegistroTotalPaginas", function (event, args) {
  conexion
    .promise()
    .execute(
      "INSERT INTO totalpaginas(totalPaginas, queryBD, fechaBD) values(?, ?, ?);",
      args
    )
    .catch((err) => console.log(err));
});

ipcMain.on("nuevoRegistroImagenes", function (event, args) {
  conexion
    .promise()
    .execute(
      "INSERT INTO imagenes(previewURL, largeImageURL, queryBD) values(?, ?, ?);",
      args
    )
    .catch((err) => console.log(err));
});

ipcMain.on("queryTotalPaginas", function (event, args) {
  conexion
    .promise()
    .execute("SELECT * FROM totalpaginas WHERE queryBD = ?", args)
    .then(([results, fields]) => {
      if (results.length > 0) {
        ventana.webContents.send("result-TotalPaginas", [
          results[0].totalPaginas,
          results[0].fechaBD,
        ]);
      }
    })
    .catch((err) => console.log(err));
});

ipcMain.on("queryImagenes", function (event, args) {
  conexion
    .promise()
    .execute(
      "SELECT previewURL, largeImageURL FROM imagenes WHERE queryBD = ?",
      args
    )
    .then(([results, fields]) => {
      if (results.length > 0) {
        ventana.webContents.send("result-Imagenes", results);
      }
    })
    .catch((err) => console.log(err));
});
