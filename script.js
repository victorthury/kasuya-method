function getVolumeEtapa1(sabor) {
  if (sabor === "mais-doce") return [20, 40]; // Base para 10g
  if (sabor === "doce") return [25, 35]; // Base para 10g
  if (sabor === "equilibrado") return [30, 30]; // Base para 10g
  if (sabor === "acido") return [35, 25]; // Base para 10g
  if (sabor === "mais-acido") return [40, 20]; // Base para 10g
  return [];
}

function getVolumeEtapa2(intensidade) {
  if (intensidade === "intenso") return [30, 30, 30]; // Base para 10g
  if (intensidade === "medio") return [45, 45]; // Base para 10g
  if (intensidade === "leve") return [90]; // Base para 10g
  return [];
}

function getVolume(sabor, intensidade, fator, acumulativo) {
  let volumes = getVolumeEtapa1(sabor)
    .concat(getVolumeEtapa2(intensidade))
    .map((v) => v * fator);

  if (acumulativo) {
    for (let i = 1; i < volumes.length; i++) {
      volumes[i] += volumes[i - 1];
    }
  }

  return volumes;
}

function getMomentos(despejos) {
  let momentos = [];
  let tempoInicial = 0;

  for (let i = 0; i < despejos; i++) {
    momentos.push(
      `${Math.floor(tempoInicial / 60)}:${(tempoInicial % 60)
        .toString()
        .padStart(2, "0")}`
    );
    tempoInicial += i === despejos - 2 ? 30 : 45; // Penúltimo despejo tem +30s
  }

  return momentos;
}

function montarTabela(volumes, momentos) {
  const tabelaResult = document.getElementById("tabelaResult");
  tabelaResult.innerHTML = ""; // Limpa a tabela antes de montar

  const despejos = volumes.length;
  for (let i = 0; i < despejos; i++) {
    tabelaResult.innerHTML += `
            <tr>
                <td><span class="numero">${i + 1}</span> Despejo</td>
                <td><span class="tag is-light is-medium">${volumes[i]} ml</span></td>
                <td class="tempo">${momentos[i]}</td>
            </tr>
        `;
  }

  tabelaResult.innerHTML += `
            <tr class="linha-fim">
                <td>🏁 Fim</td>
                <td>—</td>
                <td class="tempo">3:30</td>
            </tr>
        `;

  document.getElementById("resultado").style.display = "block";
}

function mostrarCronometro() {
  document.getElementById("cronometroContainer").style.display = "block";
}

function gerarTabela() {
  const sabor = document.getElementById("saborSelect").value;
  const intensidade = document.getElementById("intensidadeSelect").value;
  const acumulativo = document.getElementById("modoAcumulativo").checked;
  const gramasCafe = parseInt(document.getElementById("cafeSelect").value);

  const fator = gramasCafe / 10; // Ajuste proporcional
  let volumes = getVolume(sabor, intensidade, fator, acumulativo);
  let momentos = getMomentos(volumes.length);

  montarTabela(volumes, momentos);
  mostrarCronometro();
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .then(() => console.log("Service Worker registrado!"))
    .catch((err) => console.error("Erro ao registrar Service Worker:", err));
}

let tempoInicio = null;
let intervaloCronometro = null;
let tempoPausado = 0;

function formatarTempoMs(ms) {
  const totalSegundos = Math.floor(ms / 1000);
  const minutos = Math.floor(totalSegundos / 60)
    .toString()
    .padStart(2, "0");
  const segundos = (totalSegundos % 60).toString().padStart(2, "0");
  const milissegundos = (ms % 1000).toString().padStart(3, "0");
  return `${minutos}:${segundos}:${milissegundos}`;
}

function atualizarDisplay() {
  const agora = Date.now();
  const tempoDecorrido = agora - tempoInicio + tempoPausado;
  document.getElementById("displayCronometro").innerText =
    formatarTempoMs(tempoDecorrido);
}

function iniciarCronometro() {
  if (!intervaloCronometro) {
    tempoInicio = Date.now();
    intervaloCronometro = setInterval(atualizarDisplay, 50);
  }
}

function pausarCronometro() {
  if (intervaloCronometro) {
    clearInterval(intervaloCronometro);
    intervaloCronometro = null;
    tempoPausado += Date.now() - tempoInicio;
  }
}

function reiniciarCronometro() {
  clearInterval(intervaloCronometro);
  intervaloCronometro = null;
  tempoInicio = null;
  tempoPausado = 0;
  document.getElementById("displayCronometro").innerText = "00:00:000";
}
