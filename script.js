var pianoLigado = false;
var mostrandoMensagem = false;
var turn = document.getElementById("turnAround");
var isRecording = false;
var recordedData = [];
var notas = document.getElementsByClassName("notas");
let reproduzindo = false;
var podeMudar = false;
var podeTocar = true;
var ligado1 = document.getElementById("luzinha1");
function alternarPiano() {
  pianoLigado = !pianoLigado;
  var luz = document.getElementById("luz");
  luz.style.visibility = pianoLigado ? "visible" : "hidden";

  if (pianoLigado) {
    ligado1.style.backgroundColor = "greenyellow";
    mostrandoMensagem = true;
    display.textContent = "";
    index = 0; //

    mostrarMensagem();
  } else {
    desligarLuzes();
    podeMudar = false;
    pararTodosOsAudios();
    mostrandoMensagem = false;
    display.textContent = "";
    display.style.visibility = hidden;
  }
}

function pararTodosOsAudios() {
  var allAudioPlayers = document.querySelectorAll("audio");
  allAudioPlayers.forEach(function (audio) {
    audio.pause();
    audio.currentTime = 0;
  });
}

function tocarSom(idAudio) {
  if (pianoLigado) {
    var audioPlayer = document.getElementById(idAudio);
    audioPlayer.currentTime = 0;
    audioPlayer.play();

    if (isRecording) {
      var note = idAudio.replace("Audio", "");
      var time = new Date().getTime();
      recordedData.push({ note: note, time: time });
    }
  }
}

function toggleGravacao() {
  isRecording = !isRecording;
  if (isRecording) {
    recordedData = [];
    console.log("gravando.");
  }
}

function reproduzirGravacao() {
  if (recordedData.length === 0 && podeTocar) {
    display.innerText = "Nenhuma Gravacao";
    return;
  }
  reproduzindo = true;
  isRecording = false;

  recordedData.forEach(function (data, index) {
    setTimeout(function () {
      tocarSom(data.note + "Audio");
    }, data.time - recordedData[0].time);
  });
}

document
  .querySelectorAll(".teclasBrancas, .teclasPretas")
  .forEach(function (tecla) {
    tecla.addEventListener("mousedown", function () {
      var idAudio = this.id + "Audio";
      tocarSom(idAudio);
    });
  });

var display = document.getElementById("display");
var message = "Descubra a harmonia perfeita entre tradicao e inovacao.";
var index = 0;

function mostrarMensagem() {
  index = 0;
  exibirProximaLetra();
}

function exibirProximaLetra() {
  if (pianoLigado && index < message.length) {
    display.textContent += message[index];
    index++;

    setTimeout(exibirProximaLetra, 100);
  } else if (pianoLigado && index === message.length) {
    piscar();
  }
}

function piscar() {
  var count = 0;
  var interval = setInterval(function () {
    display.textContent = "PrestoMaestro Symphonic 8000";
    display.style.visibility = count % 2 === 0 ? "visible" : "hidden";
    count++;
    if (count === 9) {
      clearInterval(interval);
      display.textContent = "Tocar Total Eclipse of the Heart";
      podeMudar = true;
    }
  }, 600);
}

function playSound(audio) {
  audio.currentTime = 0;
  audio.play();
}

function playTurn() {
  if (pianoLigado) {
    playSound(turn);
  } else {
    pararTodosOsAudios();
  }
}

document.oncontextmenu = document.body.oncontextmenu = function () {
  return false;
};

var opcoes = [
  "Tocar Total Eclipse of the Heart",
  "Iniciar Gravacao",
  "Reproduzir Gravacao",
  "Mostrar Notas",
];
var indiceAtual = 0;

function mostrarOpcao() {
  var display = document.getElementById("display");
  display.innerText = opcoes[indiceAtual];
}

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
        display.innerText = "Ocultar Notas";
        ocultarNotas();
        break;
      default:
    }
  }
}
function moverParaCima() {
  if (indiceAtual > 0 && pianoLigado && podeMudar) {
    indiceAtual--;
    mostrarOpcao();
  }
}

function moverParaBaixo() {
  if (indiceAtual < opcoes.length - 1 && pianoLigado && podeMudar) {
    indiceAtual++;
    mostrarOpcao();
  }
}

function mostrarNotas() {
  var display = document.getElementById("display");
  display.innerText = "Ocultar Notas";
  var notas = document.querySelectorAll(".notas");
  for (var i = 0; i < notas.length; i++) {
    notas[i].style.visibility = "visible";
  }
  console.log("mostrando notas");
}

function ocultarNotas() {
  var display = document.getElementById("display");
  display.innerText = "Mostrar Notas";
  var notas = document.querySelectorAll(".notas");
  for (var i = 0; i < notas.length; i++) {
    notas[i].style.visibility = "hidden";
  }
  console.log("ocultando notas");
}

function pararReproducao() {
  pararTodosOsAudios();
  reproduzindo = false;
  podeTocar = true;
  console.log("Reprodução interrompida.");
}

function desligarLuzes() {
  var luzinha1 = document.getElementById("luzinha1");
  var luzinha2 = document.getElementById("luzinha2");
  var luzinha3 = document.getElementById("luzinha3");
  var luzinha4 = document.getElementById("luzinha4");

  var luzes = [luzinha1, luzinha2, luzinha3, luzinha4];

  for (var i = 0; i < luzes.length; i++) {
    luzes[i].style.backgroundColor = "black";
  }
}

function ligarLuzes(botao) {
  var todasAsLuzes = document.querySelectorAll("[id^='luzinha']");
  todasAsLuzes.forEach(function (luzinha) {
    luzinha.style.backgroundColor = "black";
  });

  var luzinha = botao.querySelector("[id^='luzinha']");
  luzinha.style.backgroundColor = "greenyellow";
}
