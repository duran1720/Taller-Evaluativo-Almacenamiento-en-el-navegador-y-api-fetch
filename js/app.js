let dataGlobal = [];

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

  fetch("https://raw.githubusercontent.com/CesarMCuellarCha/apis/refs/heads/main/SENA-CTPI.matriculados.json")
    .then((res) => res.json())
    .then((data) => {
      dataGlobal = data;

      fichaInput.addEventListener("input", () => {
        const fichaIngresada = fichaInput.value.trim();
        tbody.innerHTML = "";
        programaInput.value = "";

        if (fichaIngresada === "") return;

        // Comparación correcta con propiedad 'FICHA' en mayúsculas
        const filtrados = dataGlobal.filter(a => String(a.FICHA).trim() === fichaIngresada);

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
      });
    });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../index.html";
  });
});
