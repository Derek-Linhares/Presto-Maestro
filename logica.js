// Variáveis globais
var isRecording = false;
var recordedData = [];
var reproduzindo = false;
var audioAtual = null;
var timeouts = [];
var som1 = true;
var som2 = false;
var som3 = false;
var som4 = false;
const turn = document.getElementById("turnAround");
var audioPlayers = {};

// Função para parar todos os áudios
function pararTodosOsAudios() {
  var allAudioPlayers = document.querySelectorAll("audio");
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
    var audio = new Audio(`./assets/${idNota}.mp3`);
    audio.currentTime = 0;
    audio.play();

    if (isRecording) {
      var time = new Date().getTime();
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
        var audio = new Audio(`./assets/ocarina/${idNota}.mp3`);
        audio.currentTime = 0;
        audio.play();
        audioAtual = audio;

        if (isRecording) {
          var time = new Date().getTime();
          recordedData.push({ note: idNota, time: time });
        }
      };
    } else {
      // Se o áudio anterior não estiver definido, pausado ou estiver com erro, apenas toque o próximo áudio
      var audio = new Audio(`./assets/ocarina/${idNota}.mp3`);
      audio.currentTime = 0;
      audio.play();
      audioAtual = audio;

      if (isRecording) {
        var time = new Date().getTime();
        recordedData.push({ note: idNota, time: time });
      }
    }
  }
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
var opcoes = [
  "Tocar Total Eclipse of the Heart",
  "Iniciar Gravacao",
  "Reproduzir Gravacao",
  "Mostrar Notas",
];
var indiceAtual = 0;

// Função para mostrar a opção atual no display
function mostrarOpcao() {
  var display = document.getElementById("display");
  display.innerText = opcoes[indiceAtual];
}

// Função para selecionar uma opção no display
function selecionarOpcao() {
  if (pianoLigado) {
    var display = document.getElementById("display");
    var opcaoSelecionada = display.innerText;
    switch (opcaoSelecionada) {
      case "Tocar Total Eclipse of the Heart":
        playTurn();
        display.innerText = "Parar Total Eclipse of the Heart";
        break;
      case "Parar Total Eclipse of the Heart":
        pararTodosOsAudios();
        display.innerText = "Tocar Total Eclipse of the Heart";
        break;
      case "Iniciar Gravacao":
        display.innerText = "Parar Gravacao";
        toggleGravacao();
        break;
      case "Parar Gravacao":
        toggleGravacao();
        display.innerText = "Reproduzir Gravacao";
        break;
      case "Reproduzir Gravacao":
        if (recordedData.length === 0) {
          display.innerText = "Nenhuma Gravacao";
        } else reproduzirGravacao();
        display.innerText = "Parar Reproducao";
        break;
      case "Parar Reproducao":
        pararReproducao();
        display.innerText = "Reproduzir Gravacao";
        break;
      case "Mostrar Notas":
        display.innerText = "Ocultar Notas";
        mostrarNotas();
        break;
      case "Ocultar Notas":
        display.innerText = "Mostrar Notas";
        ocultarNotas();
        break;
      default:
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

// Função para mostrar as notas visuais do piano
function mostrarNotas() {
  var display = document.getElementById("display");
  display.innerText = "Ocultar Notas";
  var notas = document.querySelectorAll(".notas");
  for (var i = 0; i < notas.length; i++) {
    notas[i].style.visibility = "visible";
  }
  console.log("Mostrando notas");
}

// Função para ocultar as notas visuais do piano
function ocultarNotas() {
  var display = document.getElementById("display");
  display.innerText = "Mostrar Notas";
  var notas = document.querySelectorAll(".notas");
  for (var i = 0; i < notas.length; i++) {
    notas[i].style.visibility = "hidden";
  }
  console.log("Ocultando notas");
}
