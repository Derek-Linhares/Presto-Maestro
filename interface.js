// Variáveis de controle do piano
let pianoLigado = false;
let mostrandoMensagem = false;
let podeMudar = false;
let podeTocar = true;
let desligado = true;

// Elementos do DOM
let display = document.getElementById("display");
let displayBox = document.getElementById("displaybox");

// Controle de animação
let piscarInterval = null;
let animationTimeouts = []; // Array para armazenar os timeouts da animação

// Função para alternar o estado do piano (ligado/desligado)
function alternarPiano() {
  pianoLigado = !pianoLigado;
  let luz = document.getElementById("luz");
  luz.style.visibility = pianoLigado ? "visible" : "hidden";

  if (pianoLigado) {
    animacaoBoasVindas();
    desligado = false;
    mostrandoMensagem = true;
    display.textContent = "";
    display.style.visibility = "visible";
    displayBox.style.backgroundColor = "aqua";
    podeMostrar = true;

    mostrarMensagem();
  } else {
    desligarLuzes();
    ocultarNotas()
    podeMudar = false;
    pararTodosOsAudios();
    podeMostrar = false;
    clearInterval(piscarInterval);
    piscarInterval = null;
    desligado = true;
    display.textContent = "";
    mostrandoMensagem = false;
    display.style.visibility = "hidden";
    displayBox.style.backgroundColor = "black";

    // Limpar todos os timeouts da animação de boas-vindas
    animationTimeouts.forEach(function (timeout) {
      clearTimeout(timeout);
    });
    animationTimeouts = [];
  }
}

// Impedir o menu de contexto padrão no documento
document.oncontextmenu = document.body.oncontextmenu = function () {
  return false;
};

// Função para alternar o estado de gravação
function toggleGravacao() {
  isRecording = !isRecording;
  if (isRecording) {
    recordedData = [];
    console.log("Gravando.");
  }
}

// Função para reproduzir a gravação
function reproduzirGravacao() {
  if (recordedData.length === 0 && podeTocar) {
    display.innerText = "Nenhuma Gravação";
    return;
  }

  reproduzindo = true;
  isRecording = false;

  recordedData.forEach(function (data, index) {
    let timeout = setTimeout(function () {
      tocarSomPiano(data.note);
    }, data.time - recordedData[0].time);

    timeouts.push(timeout);
  });
}

// Função para parar a reprodução
function pararReproducao() {
  timeouts.forEach(function (timeout) {
    clearTimeout(timeout);
  });

  pararTodosOsAudios();
  reproduzindo = false;
  podeTocar = true;
  console.log("Reprodução interrompida.");
}

// Adicionar eventos de clique às teclas do piano
document
  .querySelectorAll(".teclasBrancas, .teclasPretas")
  .forEach(function (tecla) {
    tecla.addEventListener("mousedown", tocarNota);
    tecla.addEventListener("touchstart", tocarNota);
    function tocarNota(event) {
      event.preventDefault();
      let idNota = this.id;
      tocarSomPiano(idNota);
    }
  });

// Mensagem a ser exibida no display
let message = "Descubra a harmonia perfeita entre tradicao e inovacao.";
let index = 0;

// Função para mostrar a mensagem letra por letra
function mostrarMensagem() {
  index = 0;
  exibirProximaLetra();
}

// Função recursiva para exibir a próxima letra da mensagem
function exibirProximaLetra() {
  if (pianoLigado && index < message.length) {
    display.textContent += message[index];
    index++;

    setTimeout(exibirProximaLetra, 100);
  } else if (pianoLigado && index === message.length) {
    piscar();
  }
}

// Função para fazer o display piscar após exibir a mensagem
function piscar() {
  if (podeMostrar) {
    let count = 0;
    piscarInterval = setInterval(function () {
      display.textContent = "PrestoMaestro Symphonic 8000";
      display.style.visibility = count % 2 === 0 ? "visible" : "hidden";
      count++;
      if (count === 9) {
        clearInterval(piscarInterval);
        piscarInterval = null;
        display.textContent = "Tocar Total Eclipse of the Heart";
        podeMudar = true;
      }
    }, 600);
  }
}

// Funções para mostrar e ocultar notas no display
function mostrarNotas() {
  let display = document.getElementById("display");
  display.innerText = "Ocultar Notas";
  let notas = document.querySelectorAll(".notas");
  for (let i = 0; i < notas.length; i++) {
    notas[i].style.visibility = "visible";
  }
  console.log("Mostrando notas");
}

function ocultarNotas() {
  let display = document.getElementById("display");
  display.innerText = "Mostrar Notas";
  let notas = document.querySelectorAll(".notas");
  for (let i = 0; i < notas.length; i++) {
    notas[i].style.visibility = "hidden";
  }
  console.log("Ocultando notas");
}

// Função para desligar todas as luzes do piano
function desligarLuzes() {
  let luzinha1 = document.getElementById("luzinha1");
  let luzinha2 = document.getElementById("luzinha2");
  let luzinha3 = document.getElementById("luzinha3");
  let luzinha4 = document.getElementById("luzinha4");

  let luzes = [luzinha1, luzinha2, luzinha3, luzinha4];

  for (let i = 0; i < luzes.length; i++) {
    luzes[i].style.backgroundColor = "black";
  }
}

// Função para ligar as luzes correspondentes ao botão pressionado
function ligarLuzes(botao) {
  if (!desligado) {
    let todasAsLuzes = document.querySelectorAll("[id^='luzinha']");
    todasAsLuzes.forEach(function (luzinha) {
      luzinha.style.backgroundColor = "black";
    });

    let luzinhaId = botao.id.replace("som", "luzinha");
    let luzinha = document.getElementById(luzinhaId);
    if (luzinha) {
      luzinha.style.backgroundColor = "greenyellow";
    }

    switch (luzinha.id) {
      case "luzinha1":
        som1 = true;
        som2 = false;
        som3 = false;
        som4 = false;
        break;
      case "luzinha2":
        som1 = false;
        som2 = true;
        som3 = false;
        som4 = false;
        break;
      case "luzinha3":
        som1 = false;
        som2 = false;
        som3 = true;
        som4 = false;
        break;
      case "luzinha4":
        som1 = false;
        som2 = false;
        som3 = false;
        som4 = true;
        break;
      default:
        break;
    }
  }
}

// Função para animação de boas-vindas ao ligar o piano
function animacaoBoasVindas() {
  let luzes = [
    document.getElementById("luzinha1"),
    document.getElementById("luzinha2"),
    document.getElementById("luzinha3"),
    document.getElementById("luzinha4"),
  ];

  let delay = 480; // Tempo de delay entre cada ação (em milissegundos)

  // Função para ligar e desligar as luzes sequencialmente
  luzes.forEach((luz, index) => {
    let timeout1 = setTimeout(() => {
      if (!pianoLigado) return;
      luz.style.backgroundColor = "red";
    }, delay * index * 2);

    let timeout2 = setTimeout(() => {
      if (!pianoLigado) return;
      luz.style.backgroundColor = "black";
    }, delay * (index * 2 + 1));

    animationTimeouts.push(timeout1, timeout2);
  });

  // Função para piscar todas as luzes juntas 4 vezes
  for (let i = 0; i < 8; i++) {
    let timeout3 = setTimeout(() => {
      if (!pianoLigado) return;
      luzes.forEach((luz) => {
        luz.style.backgroundColor = "red";
      });
    }, delay * (8 + i * 2));

    let timeout4 = setTimeout(() => {
      if (!pianoLigado) return;
      luzes.forEach((luz) => {
        luz.style.backgroundColor = "black";
      });
    }, delay * (9 + i * 2));

    animationTimeouts.push(timeout3, timeout4);
  }

  let timeout5 = setTimeout(() => {
    if (!pianoLigado) return;
    luzes[0].style.backgroundColor = "greenyellow";
  }, delay * 24);

  animationTimeouts.push(timeout5);
}
