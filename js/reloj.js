let timers = JSON.parse(localStorage.getItem("timers")) || [];
let currentTimerIndex = parseInt(localStorage.getItem("currentTimer"));
let timer = timers[currentTimerIndex];
let timeRemaining = timer.duration * 60;
let timerInterval;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("timerTitle").textContent = timer.name;
  updateDisplay();
});

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateDisplay();

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      alert("¡Tiempo terminado!");
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
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
  currentTimerIndex = (currentTimerIndex + direction + timers.length) % timers.length;
  timer = timers[currentTimerIndex];
  timeRemaining = timer.duration * 60;
  document.getElementById("timerTitle").textContent = timer.name;
  updateDisplay();
}

function updateDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const display = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  const timerDisplay = document.getElementById("timerDisplay");

  timerDisplay.textContent = display;

  if ((timer.duration >= 15 && timeRemaining <= 9 * 60) || (timer.duration < 15 && timeRemaining <= 2 * 60)) {
    timerDisplay.classList.add("warning");
  } else {
    timerDisplay.classList.remove("warning");
  }
}
