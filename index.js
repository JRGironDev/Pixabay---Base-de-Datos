const registrosPorPagina = 64;
let paginaActual = 1;
let totalPaginas;
let imagenes;
let iterador;

const paginacion = document.querySelector(".paginacion");
const imagenPeque = document.querySelector(".imagen");
const btnGuardar = document.querySelector(".btn-guardar");
const btnConsultar = document.querySelector(".btn-consultar");
const fechaDiv = document.querySelector("#fechaDiv");

document.addEventListener("DOMContentLoaded", function () {
  const resultado = document.querySelector("#resultado");
  const formulario = document.querySelector("#formulario");
  const inputBuscar = document.querySelector("#buscar");
  const guardarBD = document.querySelector("#guardarBD");
  const consultarBD = document.querySelector("#consultarBD");

  inputBuscar.addEventListener("input", function (evento) {
    evento.preventDefault();
    buscarImagenes();
  });
});

guardarBD.addEventListener("click", function () {
  const queryBD = document.querySelector("#buscar").value;
  const fechaBD = obtenerFecha();

  window.comunicacion.nuevoRegistroTotalPaginas([
    totalPaginas,
    queryBD,
    fechaBD,
  ]);

  imagenes.forEach((imagen) => {
    const { previewURL, largeImageURL } = imagen;
    window.comunicacion.nuevoRegistroImagenes([
      previewURL,
      largeImageURL,
      queryBD,
    ]);
  });
});

window.comunicacion.resultTotalPaginas(
  "result-TotalPaginas",
  function (event, args) {
    totalPaginas = args[0];
    imprimirFecha(args[1]);
    imprimirPaginador();
  }
);

window.comunicacion.resultImagenes("result-Imagenes", function (event, args) {
  imagenes = args;
  imagenes.forEach((imagen) => {
    const { previewURL, largeImageURL } = imagen;
    resultado.innerHTML += `
      <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer"><img class="imagen" src="${previewURL}"></a>
    `;
  });
});

consultarBD.addEventListener("click", function () {
  totalPaginas = 0;
  imagenes = [];
  guardarBD.classList.add("opacidad");
  guardarBD.disabled = true;
  const queryBD = document.querySelector("#buscar").value;

  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }

  while (paginacion.firstChild) {
    paginacion.removeChild(paginacion.firstChild);
  }

  fechaDiv.innerHTML = "";
  resultado.innerHTML = "";

  spinner();

  setTimeout(() => {
    resultado.innerHTML = "";
    fechaDiv.innerHTML = "";
    window.comunicacion.queryImagenes([queryBD]);
    window.comunicacion.queryTotalPaginas([queryBD]);
  }, 2000);

  setTimeout(() => {
    if (imagenes.length == 0) {
      resultado.innerHTML =
        "No hay registros en la base de datos para la consulta realizada";
    }
  }, 2500);
});

function obtenerFecha() {
  let fechaActual = new Date();
  let dia = fechaActual.getDate();
  let mes = fechaActual.getMonth() + 1;
  let anio = fechaActual.getFullYear();
  let separador = "-";
  let fechaBD = dia + separador + mes + separador + anio;
  return fechaBD;
}

function imprimirFecha(fecha) {
  fechaDiv.innerHTML = `Fecha de guardado en Base de Datos: ${fecha}`;
}

function buscarImagenes() {
  const query = document.querySelector("#buscar").value;

  const key = "33571242-31fb89b76690561774b77ce79";
  const url = `https://pixabay.com/api/?key=${key}&q=${query}&per_page=${registrosPorPagina}&page=${paginaActual}`;

  guardarBD.classList.remove("opacidad");
  guardarBD.disabled = false;

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => {
      fechaDiv.innerHTML = "";
      totalPaginas = calcularPaginas(resultado.totalHits);
      imagenes = resultado.hits;
      mostrarImagenes(imagenes);
    });
}

function* crearPaginador(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

function mostrarImagenes(imagenes) {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }

  imagenes.forEach((imagen) => {
    const { previewURL, largeImageURL } = imagen;
    resultado.innerHTML += `
      <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer"><img class="imagen" src="${previewURL}"></a>
    `;
  });

  while (paginacion.firstChild) {
    paginacion.removeChild(paginacion.firstChild);
  }

  imprimirPaginador();
}

function imprimirPaginador() {
  const iterador = crearPaginador(totalPaginas);

  while (true) {
    const { value, done } = iterador.next();
    if (done) return;

    const boton = document.createElement("A");
    boton.href = "#";
    boton.dataset.pagina = value;
    boton.textContent = value;
    boton.classList.add("siguiente");

    boton.onclick = () => {
      paginaActual = value;

      buscarImagenes();
    };
    paginacion.appendChild(boton);
  }
}

function calcularPaginas(total) {
  return parseInt(Math.ceil(total / registrosPorPagina));
}

function spinner() {
  resultado.innerHTML = "";
  const divSpinner = document.createElement("DIV");
  divSpinner.classList.add("sk-cube-grid");

  divSpinner.innerHTML = `
      <div class="sk-cube sk-cube1"></div>
      <div class="sk-cube sk-cube2"></div>
      <div class="sk-cube sk-cube3"></div>
      <div class="sk-cube sk-cube4"></div>
      <div class="sk-cube sk-cube5"></div>
      <div class="sk-cube sk-cube6"></div>
      <div class="sk-cube sk-cube7"></div>
      <div class="sk-cube sk-cube8"></div>
      <div class="sk-cube sk-cube9"></div>
  `;

  resultado.appendChild(divSpinner);
}
