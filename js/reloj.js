let timers = JSON.parse(localStorage.getItem("timers")) || [];
let currentTimerIndex = parseInt(localStorage.getItem("currentTimer")) || 0;

if (!timers.length) {
  timers = [{ name: "Timer", duration: 25, hasIframe: false, iframeUrl: "" }];
}

let timer = timers[currentTimerIndex] || timers[0];

let totalTime = timer.duration * 60;
let timeRemaining = totalTime;

let timerInterval;
let iframeRefreshInterval;

document.addEventListener("DOMContentLoaded", () => {

  setupIframeMode();
  document.getElementById("timerTitle").textContent = timer.name;

  updateDisplay();
  updateProgress();

});

function setupIframeMode() {
  const iframeContainer = document.getElementById("iframeContainer");
  const iframe = document.getElementById("timerIframe");

  if (timer.hasIframe && timer.iframeUrl) {
    document.body.classList.add("has-iframe");
    iframeContainer.style.display = "flex";
    
    // Carga inicial
    loadIframeSource(iframe, timer.iframeUrl);

    // Auto-actualización periódica del Iframe cada 5 minutos (300,000 ms) para evitar congelamientos
    if (iframeRefreshInterval) clearInterval(iframeRefreshInterval);
    iframeRefreshInterval = setInterval(() => {
      loadIframeSource(iframe, timer.iframeUrl);
    }, 300000);

  } else {
    document.body.classList.remove("has-iframe");
    iframeContainer.style.display = "none";
    iframe.src = "";
    if (iframeRefreshInterval) clearInterval(iframeRefreshInterval);
  }
}

function loadIframeSource(iframeElement, url) {
  // Se le añade un timestamp para evitar cache congelado
  const connector = url.includes("?") ? "&" : "?";
  iframeElement.src = url + connector + "_refresh=" + new Date().getTime();
}

function startTimer() {

  if (timerInterval) return;

  document.querySelector("#startBtn i").className = "bi bi-hourglass-split";

  timerInterval = setInterval(() => {

    timeRemaining--;

    updateDisplay();
    updateProgress();

    if (timeRemaining <= 0) {

      clearInterval(timerInterval);
      timerInterval = null;

      document.querySelector("#startBtn i").className = "bi bi-play-fill";

    }

  }, 1000);

}

function pauseTimer() {

  clearInterval(timerInterval);
  timerInterval = null;

  document.querySelector("#startBtn i").className = "bi bi-play-fill";

}

function nextTimer() {
  changeTimer(1);
}

function previousTimer() {
  changeTimer(-1);
}

function exitTimer() {
  window.location.href = "menu.html";
}

function changeTimer(direction) {

  currentTimerIndex =
    (currentTimerIndex + direction + timers.length) % timers.length;

  timer = timers[currentTimerIndex];

  totalTime = timer.duration * 60;

  timeRemaining = totalTime;

  document.getElementById("timerTitle").textContent = timer.name;

  pauseTimer();
  setupIframeMode();

  updateDisplay();
  updateProgress();
}

function updateDisplay() {

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const display =
    `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  const timerDisplay = document.getElementById("timerDisplay");

  timerDisplay.textContent = display;

  if ((timer.duration >= 15 && timeRemaining <= 9 * 60) ||
      (timer.duration < 15 && timeRemaining <= 2 * 60)) {

    timerDisplay.classList.add("warning");

  } else {

    timerDisplay.classList.remove("warning");

  }

}

function updateProgress(){

let percent = ((totalTime - timeRemaining) / totalTime) * 100;

document.getElementById("progressBar").style.width = percent + "%";

}

function addFiveMinutes() {

  timeRemaining += 300;
  totalTime += 300;

  updateDisplay();
  updateProgress();

}

function subtractFiveMinutes() {

  timeRemaining = Math.max(0, timeRemaining - 300);

  updateDisplay();
  updateProgress();

}


/* teclado */

document.addEventListener("keydown",(e)=>{

switch(e.key){

case " ":
e.preventDefault()

if(timerInterval){
pauseTimer()
}else{
startTimer()
}

break

case "ArrowRight":
nextTimer()
break

case "ArrowLeft":
previousTimer()
break

case "+":
addFiveMinutes()
break

case "-":
subtractFiveMinutes()
break

case "Escape":
exitTimer()
break

}

})


function updateClock() {

const clockElement = document.getElementById('clock');

const now = new Date();

const options = {
timeZone: 'America/Tegucigalpa',
hour: '2-digit',
minute: '2-digit',
second: '2-digit',
hour12: true
};

const timeString = now.toLocaleTimeString('en-US', options);

clockElement.textContent = timeString;

}

setInterval(updateClock,1000);
updateClock();