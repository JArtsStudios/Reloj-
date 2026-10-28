let selectedIndex = -1;
let editingIndex = -1;

document.addEventListener("DOMContentLoaded", () => {

loadTimers();
keyboardControls();
initTheme();

});

function toggleIframeInput() {
  const hasIframe = document.getElementById("timerHasIframe").checked;
  const urlInput = document.getElementById("timerIframeUrl");
  urlInput.style.display = hasIframe ? "block" : "none";
}

function toggleEditIframeInput() {
  const hasIframe = document.getElementById("editHasIframe").checked;
  const container = document.getElementById("editIframeContainer");
  container.style.display = hasIframe ? "block" : "none";
}

function loadTimers(){

const timerList = document.getElementById("timerList");

const timers = JSON.parse(localStorage.getItem("timers")) || [];

timerList.innerHTML = "";

timers.forEach((timer,index)=>{

const li = document.createElement("li");

if(index === selectedIndex){
li.classList.add("selected");
}

const span = document.createElement("span");

span.innerHTML = `
<i class="bi bi-clock"></i>
- 
${timer.name}
${timer.duration} min
${timer.hasIframe ? '<span class="badge-iframe"><i class="bi bi-tv-fill"></i></span>' : ''}
`;

const actions = document.createElement("div");
actions.className = "actions";

/* NUEVO BOTÓN DE INICIO */
const startButton = document.createElement("button");
startButton.innerHTML = `<i class="bi bi-play-fill"></i>`;
startButton.className = "start-btn";
startButton.title = "Iniciar temporizador";
startButton.onclick = (e) => {
  e.stopPropagation();
  startTimer(index);
};

const editButton = document.createElement("button");
editButton.innerHTML = `<i class="bi bi-pencil"></i>`;
editButton.className = "edit-btn";
editButton.title = "Editar temporizador";
editButton.onclick = (e) => {
  e.stopPropagation();
  openEditModal(index);
};

const deleteButton = document.createElement("button");
deleteButton.innerHTML = `<i class="bi bi-trash"></i>`;
deleteButton.className = "delete-btn";
deleteButton.title = "Eliminar temporizador";
deleteButton.onclick=(e)=>{
  e.stopPropagation();
  deleteTimer(index);
};

/* Agregamos el botón de inicio junto con editar y eliminar */
actions.appendChild(startButton);
actions.appendChild(editButton);
actions.appendChild(deleteButton);

li.onclick=()=>{

selectedIndex=index;
loadTimers();

}

li.appendChild(span);
li.appendChild(actions);

timerList.appendChild(li);

});

}

function addTimer(){

const name=document.getElementById("timerName").value;

const duration=parseInt(document.getElementById("timerDuration").value);

const hasIframe=document.getElementById("timerHasIframe").checked;

const iframeUrl=document.getElementById("timerIframeUrl").value.trim();

if(!name || isNaN(duration)){

alert("Completa los campos obligatorios");

return;

}

if(hasIframe && !iframeUrl){

alert("Por favor ingresa la URL del Iframe");

return;

}

const timers=JSON.parse(localStorage.getItem("timers"))||[];

if(timers.length>=20){

alert("Máximo 20 temporizadores");

return;

}

timers.push({
  name,
  duration,
  hasIframe: !!hasIframe,
  iframeUrl: hasIframe ? iframeUrl : ""
});

localStorage.setItem("timers",JSON.stringify(timers));

document.getElementById("timerName").value="";
document.getElementById("timerDuration").value="";
document.getElementById("timerHasIframe").checked=false;
document.getElementById("timerIframeUrl").value="";
toggleIframeInput();

loadTimers();

}

function quickAdd(minutes){

const timers=JSON.parse(localStorage.getItem("timers"))||[];

timers.push({
name:`Timer ${minutes} min`,
duration:minutes,
hasIframe: false,
iframeUrl: ""
});

localStorage.setItem("timers",JSON.stringify(timers));

loadTimers();

}

function deleteTimer(index){

const timers=JSON.parse(localStorage.getItem("timers"))||[];

timers.splice(index,1);

localStorage.setItem("timers",JSON.stringify(timers));

selectedIndex=-1;

loadTimers();

}

/* --- LÓGICA DE EDICIÓN --- */

function openEditModal(index) {
  const timers = JSON.parse(localStorage.getItem("timers")) || [];
  const timer = timers[index];
  if (!timer) return;

  editingIndex = index;

  document.getElementById("editTimerName").value = timer.name;
  document.getElementById("editTimerDuration").value = timer.duration;
  document.getElementById("editHasIframe").checked = !!timer.hasIframe;
  document.getElementById("editIframeUrl").value = timer.iframeUrl || "";

  toggleEditIframeInput();

  document.getElementById("editModal").style.display = "flex";
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
  editingIndex = -1;
}

function saveEditTimer() {
  if (editingIndex === -1) return;

  const timers = JSON.parse(localStorage.getItem("timers")) || [];
  const name = document.getElementById("editTimerName").value;
  const duration = parseInt(document.getElementById("editTimerDuration").value);
  const hasIframe = document.getElementById("editHasIframe").checked;
  const iframeUrl = document.getElementById("editIframeUrl").value.trim();

  if (!name || isNaN(duration)) {
    alert("Completa el nombre y la duración");
    return;
  }

  if (hasIframe && !iframeUrl) {
    alert("Proporciona una URL para el Iframe");
    return;
  }

  timers[editingIndex] = {
    name,
    duration,
    hasIframe,
    iframeUrl: hasIframe ? iframeUrl : ""
  };

  localStorage.setItem("timers", JSON.stringify(timers));

  closeEditModal();
  loadTimers();
}

function startTimer(index){

localStorage.setItem("currentTimer",index);

window.location.href="reloj.html";

}

function keyboardControls(){

document.addEventListener("keydown",(e)=>{

if(document.getElementById("editModal").style.display === "flex") return;

const timers=JSON.parse(localStorage.getItem("timers"))||[];

if(e.key==="Enter"){

const nameInput=document.getElementById("timerName");

if(document.activeElement===nameInput){

addTimer();
return;

}

if(selectedIndex>=0){

startTimer(selectedIndex);

}

}

if(e.key==="ArrowDown"){

selectedIndex++;

if(selectedIndex>=timers.length){
selectedIndex=timers.length-1;
}

loadTimers();

}

if(e.key==="ArrowUp"){

selectedIndex--;

if(selectedIndex<0){
selectedIndex=0;
}

loadTimers();

}

if(e.key==="Delete"){

if(selectedIndex>=0){
deleteTimer(selectedIndex);
}

}

});

}

function initTheme(){

const toggle=document.getElementById("themeToggle");

const saved=localStorage.getItem("theme");

if(saved==="light"){
document.body.classList.add("light");
toggle.innerHTML='<i class="bi bi-sun"></i>';
}

toggle.onclick=()=>{

document.body.classList.toggle("light");

if(document.body.classList.contains("light")){

localStorage.setItem("theme","light");
toggle.innerHTML='<i class="bi bi-sun"></i>';

}else{

localStorage.setItem("theme","dark");
toggle.innerHTML='<i class="bi bi-moon"></i>';

}

};

}