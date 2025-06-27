let dataGlobal = [];
let listaFichas = [];

document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("username");
  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  document.getElementById("userName").textContent = user;

  const fichaInput = document.getElementById("fichaInput");
  const programaInput = document.getElementById("programaInput");
  const tbody = document.querySelector("#aprendicesTable tbody");
  const sugerencias = document.getElementById("sugerencias");

  fetch("https://raw.githubusercontent.com/CesarMCuellarCha/apis/refs/heads/main/SENA-CTPI.matriculados.json")
    .then((res) => res.json())
    .then((data) => {
      dataGlobal = data;
      listaFichas = [...new Set(data.map(a => String(a.FICHA).trim()))];

      fichaInput.addEventListener("input", () => {
        const fichaIngresada = fichaInput.value.trim();
        tbody.innerHTML = "";
        programaInput.value = "";
        sugerencias.innerHTML = "";

        if (fichaIngresada === "") return;

        // Mostrar coincidencias
        const coincidencias = listaFichas.filter(f => f.includes(fichaIngresada));
        coincidencias.slice(0, 10).forEach(ficha => {
          const li = document.createElement("li");
          li.textContent = ficha;
          li.classList.add("list-group-item", "list-group-item-action");
          li.addEventListener("click", () => {
            fichaInput.value = ficha;
            sugerencias.innerHTML = "";
            mostrarAprendices(ficha);
          });
          sugerencias.appendChild(li);
        });

        if (listaFichas.includes(fichaIngresada)) {
          mostrarAprendices(fichaIngresada);
        }
      });
    });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../index.html";
  });
});

// Función para mostrar aprendices
function mostrarAprendices(fichaIngresada) {
  const tbody = document.querySelector("#aprendicesTable tbody");
  const programaInput = document.getElementById("programaInput");

  const filtrados = dataGlobal.filter(a => String(a.FICHA).trim() === fichaIngresada);
  tbody.innerHTML = "";

  if (filtrados.length > 0) {
    const ficha = filtrados[0];
    programaInput.value = ficha.PROGRAMA;

    localStorage.setItem("ficha_codigo", ficha.FICHA);
    localStorage.setItem("ficha_programa", ficha.PROGRAMA);
    localStorage.setItem("ficha_nivel", ficha.NIVEL_DE_FORMACION);
    localStorage.setItem("ficha_estado", ficha.ESTADO_FICHA);

    filtrados.forEach(aprendiz => {
      const tr = document.createElement("tr");
      if (aprendiz.ESTADO_APRENDIZ === "Retiro Voluntario") {
        tr.classList.add("table-warning");
      }
      tr.innerHTML = `
        <td>${aprendiz.TIPO_DOCUMENTO}</td>
        <td>${aprendiz.NUMERO_DOCUMENTO}</td>
        <td>${aprendiz.NOMBRE}</td>
        <td>${aprendiz.PRIMER_APELLIDO}</td>
        <td>${aprendiz.SEGUNDO_APELLIDO}</td>
        <td>${aprendiz.ESTADO_APRENDIZ}</td>
      `;
      tbody.appendChild(tr);
    });
  } else {
    programaInput.value = "Ficha no encontrada";
  }
}
