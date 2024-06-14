// Variáveis globais
let isRecording = false;
let recordedData = [];
let reproduzindo = false;
let audioAtual = null;
let timeouts = [];
let som1 = true;
let som2 = false;
let som3 = false;
let som4 = false;
const turn = document.getElementById("turnAround");
let audioPlayers = {};

const audioFiles = [
  "./assets/do.mp3",
  "./assets/do2.mp3",
  "./assets/re.mp3",
  "./assets/re2.mp3",
  "./assets/mi.mp3",
  "./assets/mi2.mp3",
  "./assets/fa.mp3",
  "./assets/fa2.mp3",
  "./assets/sol.mp3",
  "./assets/sol2.mp3",
  "./assets/la.mp3",
  "./assets/la2.mp3",
  "./assets/si.mp3",
  "./assets/si2.mp3",
  "./assets/do3.mp3",
  "./assets/dosus2.mp3",
  "./assets/dosus.mp3",
  "./assets/resus2.mp3",
  "./assets/resus.mp3",
  "./assets/fasus2.mp3",
  "./assets/fasus.mp3",
  "./assets/solsus2.mp3",
  "./assets/solsus.mp3",
  "./assets/lasus.mp3",
  "./assets/lasus2.mp3",
];

let loadedCount = 0;
const totalAudios = audioFiles.length;

function preloadAudio(url) {
  return new Promise((resolve, reject) => {
    let audio = new Audio();
    audio.addEventListener("canplaythrough", () => {
      console.log(`Áudio carregado: ${url}`);
      resolve();
    });
    audio.src = url;
    audio.load();
  });
}

function preloadAllAudios() {
  const promises = audioFiles.map((url) => preloadAudio(url));
  return Promise.all(promises);
}

function updateLoadingProgress() {
  const progress = (loadedCount + 1) / totalAudios; // Incrementa loadedCount antes de exibir
  const progressBar = document.getElementById("loading-progress");
  progressBar.style.width = `${progress * 100}%`;

  const loadingText = document.getElementById("loading-text");
  loadingText.innerText = `Carregando ${audioFiles[loadedCount]}`;

  loadedCount++; // Incrementa após atualizar o texto de carregamento
}

function init() {
  preloadAllAudios().then(() => {
    document.getElementById("loading-overlay").style.display = "none";
    console.log("Todos os áudios foram carregados.");
  });
}

document.addEventListener("DOMContentLoaded", init);

// Função para parar todos os áudios
function pararTodosOsAudios() {
  let allAudioPlayers = document.querySelectorAll("audio");
  allAudioPlayers.forEach(function (audio) {
    audio.pause();
    audio.currentTime = 0;
  });
}

// Função para tocar uma nota no piano
function tocarSomPiano(idNota) {
  if (pianoLigado && som1) {
    som2 = false;
    som3 = false;
    som4 = false;
    let audio = new Audio(`./assets/${idNota}.mp3`);
    audio.currentTime = 0;
    audio.play();

    if (isRecording) {
      let time = new Date().getTime();
      recordedData.push({ note: idNota, time: time });
    }
  }

  if (pianoLigado && som2) {
    som1 = false;
    som3 = false;
    som4 = false;
    if (audioAtual && !audioAtual.paused && !audioAtual.error) {
      // Parar a reprodução do áudio anterior
      audioAtual.pause();
      audioAtual.currentTime = 0;

      // Aguardar até que o áudio seja pausado antes de continuar
      audioAtual.onpause = function () {
        // Criar um novo elemento de áudio para a nota atual
        let audio = new Audio(`./assets/ocarina/${idNota}.mp3`);
        audio.currentTime = 0;
        audio.play();
        audioAtual = audio;

        if (isRecording) {
          let time = new Date().getTime();
          recordedData.push({ note: idNota, time: time });
        }
      };
    } else {
      // Se o áudio anterior não estiver definido, pausado ou estiver com erro, apenas toque o próximo áudio
      let audio = new Audio(`./assets/ocarina/${idNota}.mp3`);
      audio.currentTime = 0;
      audio.play();
      audioAtual = audio;

      if (isRecording) {
        let time = new Date().getTime();
        recordedData.push({ note: idNota, time: time });
      }
    }
  }
}

function excluirGravacao() {
  recordedData = [];
}

// Função para reproduzir um som específico
function playSound(audio) {
  audio.currentTime = 0;
  audio.play();
}

// Função para tocar o som de turno
function playTurn() {
  if (pianoLigado) {
    playSound(turn);
  } else {
    pararTodosOsAudios();
  }
}

// Opções disponíveis no display
let opcoes = [
  "Tocar Total Eclipse of the Heart",
  "Iniciar Gravacao",
  "Reproduzir Gravacao",
  "Excluir Gravacao",
  "Mostrar Notas",
];
let indiceAtual = 0;

// Função para mostrar a opção atual no display
function mostrarOpcao() {
  let display = document.getElementById("display");
  display.innerText = opcoes[indiceAtual];
}

// Função para selecionar uma opção no display
function selecionarOpcao() {
  if (pianoLigado) {
    let display = document.getElementById("display");
    let opcaoSelecionada = display.innerText;
    switch (opcaoSelecionada) {
      case "Tocar Total Eclipse of the Heart":
        playTurn();
        opcoes[0] = "Parar Total Eclipse of the Heart";
        display.innerText = "Parar Total Eclipse of the Heart";
        break;
      case "Parar Total Eclipse of the Heart":
        pararTodosOsAudios();
        opcoes[0] = "Tocar Total Eclipse of the Heart";
        display.innerText = "Tocar Total Eclipse of the Heart";
        break;
      case "Iniciar Gravacao":
        display.innerText = "Parar Gravacao";
        toggleGravacao();

        break;
      case "Parar Gravacao":
        toggleGravacao();

        display.innerText = opcoes[2];
        break;
      case "Reproduzir Gravacao":
        if (recordedData.length === 0) {
          display.innerText = "Nenhuma Gravacao Para Reproduzir";
        } else {
          reproduzirGravacao();
          display.innerText = "Parar Reproducao";
        }
        break;
      case "Parar Reproducao":
        pararReproducao();

        display.innerText = "Reproduzir Gravacao";
        break;

      case "Excluir Gravacao":
        if (recordedData.length === 0) {
          display.innerText = "Nenhuma Gravacao Para Excluir";
        } else {
          excluirGravacao();
          display.innerText = "Gravacao Excluida";
        }
        break;

      case "Mostrar Notas":
        opcoes[4] = "Ocultar Notas";
        display.innerText = "Ocultar Notas";
        mostrarNotas();

        break;
      case "Ocultar Notas":
        opcoes[4] = "Mostrar Notas";
        display.innerText = "Mostrar Notas";
        ocultarNotas();

        break;
      default:
        break;
    }
  }
}

// Função para mover a seleção para cima no display
function moverParaCima() {
  if (indiceAtual > 0 && pianoLigado && podeMudar) {
    indiceAtual--;
    mostrarOpcao();
  }
}

// Função para mover a seleção para baixo no display
function moverParaBaixo() {
  if (indiceAtual < opcoes.length - 1 && pianoLigado && podeMudar) {
    indiceAtual++;
    mostrarOpcao();
  }
}
// Funções para mostrar e ocultar notas no display
function mostrarNotas() {
  opcoes[4] = "Ocultar Notas";
  let display = document.getElementById("display");
  display.innerText = "Ocultar Notas";
  let notas = document.querySelectorAll(".notas");
  for (let i = 0; i < notas.length; i++) {
    notas[i].style.visibility = "visible";
  }
  console.log("Mostrando notas");
}

function ocultarNotas() {
  opcoes[4] = "Mostrar Notas";
  let display = document.getElementById("display");
  display.innerText = "Mostrar Notas";
  let notas = document.querySelectorAll(".notas");
  for (let i = 0; i < notas.length; i++) {
    notas[i].style.visibility = "hidden";
  }
  console.log("Ocultando notas");
}
