import Game from "./gameClass.js";

//Selectors---------------------------------------------------------
const buttonStop = document.getElementById("stop");
const buttonStart = document.getElementById("start");
const buttonRestart = document.getElementById("reset");
const keysDiv = document.getElementById("keys");
const scoreDiv = document.getElementById("score");
const speedDiv = document.getElementById("speed");
const infoDiv = document.getElementById("info");
const hamburgerDiv = document.getElementById("hamburger");
const optionsInfoDiv = document.getElementById("options-info-container");
const tableContainer = document.getElementById("table-container");
const table = document.querySelector("table");
const loseDiv = document.getElementById("lose-div");
const music = document.getElementById("music");
const audioArray = document.querySelectorAll("audio");
//Options Selectors
const selfCollideInput = document.getElementById("self-collide");
const soundInput = document.getElementById("sound");
const volumeInput = document.getElementById("volume");
const speedInput = document.getElementById("speed-input");
//-------------------------------------------------------------------
//Responsive behaviour
const desktopInfo = `Use Keyboard arrows to move: &larr;&rarr;&uarr;&darr;`;
const mobileInfo = `Tap on the board to move the snake`;
let isHamburgerOpen = false;

info.innerHTML = checkMedia() ? desktopInfo : mobileInfo;
window.onresize = () => {
  console.log("resizing");
  info.innerHTML = checkMedia() ? desktopInfo : mobileInfo;
};
function checkMedia() {
  return window.matchMedia(`(min-width:700px)`).matches;
}
hamburgerDiv.onclick = () => {
  optionsInfoDiv.style.top = isHamburgerOpen ? "-500px" : "50%";
  isHamburgerOpen = !isHamburgerOpen;
};

//Event listeners options input
//------------------------------------
selfCollideInput.onchange = (ev) => {
    game.selfCollide = ev.target.checked;
  };
  
  soundInput.onchange = (ev) => {
    for (let audio of audioArray) audio.muted = !ev.target.checked;
  };
  
  volumeInput.onchange = (ev) => {
    for (let audio of audioArray) audio.volume = ev.target.value;
  };
  
  speedInput.onchange = (ev) => {
    game.time = 160 - ev.target.value;
    if (game.gameState) {
      clearInterval(game.snakeInterval);
      game.createSnakeInterval();
    }
  };

  //--------------------------------------------
//Game init:
const rows = checkMedia() ? 14 : 12;
const cols = checkMedia() ? 25 : 12;
const game = new Game(rows, cols, 150); //Rows, Cols, Time interval(ms)
const keyUpHandler = game.keyUpHandler.bind(game);
const touchStartHandler = game.touchStartHandler.bind(game);
game.populateTable();
game.populateEdgeArrays();
//---------------------------------------------
//Event listeners buttons:
//.....stop:
buttonStop.onclick = () => {
  if (!game.gameState) return;
  game.gameState = false;
  music.pause();
  window.removeEventListener("keyup", keyUpHandler);
  clearInterval(game.snakeInterval);
  clearInterval(game.foodInterval);
};
//.....start:
buttonStart.onclick = () => {
  if (game.gameState || game.losingState) return;
  window.addEventListener("keyup", keyUpHandler);
  table.addEventListener("touchstart", touchStartHandler);
  game.gameState = true;
  music.play();
  if (game.firstStart) {
    game.firstStart = false;
    game.createSnake(game.snakeLength); //Draw the snake on start
  }
  //Start to move the snake
  game.createSnakeInterval();
  game.createFoodInterval();
};
//.....Restart:
buttonRestart.onclick = () => {
  window.addEventListener("keyup", keyUpHandler);
  loseDiv.style.display = "none";
  tableContainer.style.display = "block";
  music.currentTime = 0;
  game.resetAll();
  //Restart
  game.gameState = true;
  music.play();
  game.createSnake(game.snakeLength);
  //Start to move the snake
  game.createSnakeInterval();
  game.createFoodInterval();
};
