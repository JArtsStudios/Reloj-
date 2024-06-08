document.addEventListener("DOMContentLoaded", () => {
    loadTimers();
  });
  
  function loadTimers() {
    const timerList = document.getElementById("timerList");
    const timers = JSON.parse(localStorage.getItem("timers")) || [];
    timerList.innerHTML = "";
  
    timers.forEach((timer, index) => {
      const li = document.createElement("li");
      
      const span = document.createElement("span");
      span.textContent = `${timer.name} - ${timer.duration} min`;
      span.onclick = () => startTimer(index);
      
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";
      deleteButton.className = "delete-btn";
      deleteButton.onclick = (e) => {
        e.stopPropagation();
        deleteTimer(index);
      };
      
      li.appendChild(span);
      li.appendChild(deleteButton);
      timerList.appendChild(li);
    });
  }
  
  function addTimer() {
    const name = document.getElementById("timerName").value;
    const duration = parseInt(document.getElementById("timerDuration").value);
  
    if (!name || isNaN(duration)) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }
  
    const timers = JSON.parse(localStorage.getItem("timers")) || [];
    if (timers.length >= 20) {
      alert("No puedes agregar más de 20 temporizadores.");
      return;
    }
  
    timers.push({ name, duration });
    localStorage.setItem("timers", JSON.stringify(timers));
    loadTimers();
  }
  
  function deleteTimer(index) {
    const timers = JSON.parse(localStorage.getItem("timers")) || [];
    timers.splice(index, 1);
    localStorage.setItem("timers", JSON.stringify(timers));
    loadTimers();
  }
  
  function startTimer(index) {
    localStorage.setItem("currentTimer", index);
    window.location.href = "reloj.html";
  }
  