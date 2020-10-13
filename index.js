//Selectors-------------------------------
const buttonStop = document.getElementById("stop");
const buttonStart = document.getElementById("start");
const buttonRestart = document.getElementById("reset");
const keysDiv = document.getElementById("keys");
const scoreDiv = document.getElementById("score");
const speedDiv = document.getElementById("speed");
const tableContainer = document.getElementById("table-container");
const table = document.querySelector("table");
const loseDiv = document.getElementById("lose-div");
const music = document.getElementById("music");
const loseAudio = document.getElementById("lose");
const pigAudio = document.getElementById("pig");
const catAudio = document.getElementById("cat");
const moveAudio = document.getElementById("move");
//-------------------------------

let gameState = false;
let losingState = false;
let score = 0;
let scoresAchieved = [];
let time = 150; //Snake redraw time interval in ms
const rows = 14;
const cols = 25;
const randomCellIdx = () => Math.ceil(Math.random() * rows * cols) - 1;
//Creating the edges
//---------------------------------------------------------------------
const topEdgeIdxs = [];
const bottomEdgeIdxs = [];
const rightEdgeIdxs = [];
const leftEdgeIdxs = [];
for (let i = 0; i < cols; i++) topEdgeIdxs.push(i);
for (let i = cols * (rows - 1); i < cols * rows; i++) bottomEdgeIdxs.push(i);
for (let i = 0; i < cols * rows; i++) {
  if (i - (cols - 1) >= 0 && (i - (cols - 1)) % cols === 0)
    rightEdgeIdxs.push(i);
  if (i % cols === 0) leftEdgeIdxs.push(i);
}
//---------------------------------------------------------------------
//Intializing global intervals
let snakeInterval;
let foodInterval;
//---------------------------------
//Food props
let allFoodsEmojs = `🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐽 🐸 🐵 🙈 🙉 🙊 🐒 🐔 🐧 🐦 🐤 🐣 🐥 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🐛 🦋 🐌 🐞 🐜 🦟 🦗 🕷 🕸 🦂 🐢 🐍 🦎 🦖 🦕 🐙 🦑 🦐 🦞 🦀 🐡 🐠 🐟 🐬 🐳 🐋 🦈 🐊 🐅 🐆 🦓 🦍 🦧 🐘 🦛 🦏 🐪 🐫 🦒 🦘 🐃 🐂 🐄 🐎 🐖 🐏 🐑 🦙 🐐 🦌 🐕 🐩 🦮 🐕‍🦺 🐈 🐓 🦃 🦚 🦜 🦢 🦩 🕊 🐇 🦝 🦨 🦡 🦦 🦥 🐁 🐀 🐿 🦔 🐾 🐉 🐲 🌵 🎄 🌲 🌳 🌴 🌱 🌿 ☘️ 🍀 🎍 🎋 🍃 🍂 🍁 🍄 🐚`;
allFoodsEmojs = allFoodsEmojs.split(" ");
const randomFoodIdx = () => Math.ceil(Math.random() * allFoodsEmojs.length) - 1;
let foodIdxs = []; // Array with cells indexes of foods
//---------------------------------
//Snake props
let snake = []; //DOM elements
let snakeLength = 5;
let currentDir = 39;
let snakeIdxs = [0, 1, 2, 3, 4];

//---------------------------------------------------------------------------------------
//Table creation
populateTable(table, rows, cols, "");
const cells = document.querySelectorAll("td");

//Showing the right buttons
//------------------------------------ 
//document.addEventListeners()
//Event listeners buttons:
//.....stop:
buttonStop.onclick = () => {
  if (!gameState) return;
  gameState = false;
  music.pause();
  window.removeEventListener("keyup", keyUpHandler);
  clearInterval(snakeInterval);
  clearInterval(foodInterval);
};
//.....start:
buttonStart.onclick = () => {
  
  if (gameState || losingState) return;
  gameState=true;
  music.play();
  window.addEventListener("keyup", keyUpHandler);
  createSnake(snakeLength); //Draw the snake on start
  //Append the snake to the default starting cells
for (let i = 0; i < snake.length; i++) {
  cells[i].appendChild(snake[i]);
}
  //Start to move the snake
  createSnakeInterval();
  createFoodInterval();
};
//.....Restart:
buttonRestart.onclick = () => {
  loseDiv.style.display="none";
  table.style.display="block";
  losingState = false;
  gameState = true;
  music.currentTime = 0;
  music.play();
  clearInterval(snakeInterval);
  clearInterval(foodInterval);
  window.addEventListener("keyup", keyUpHandler);
  currentDir = 39;//Reinitialize the default direction
  //Remove all extra snake body parts from cells
  for ( let i = 0; i < snake.length; i++){
    cells[snakeIdxs[i]].removeChild(cells[snakeIdxs[i]].firstChild)
  }
  snake = []; //Reset the snake divs array
  snakeIdxs = [0,1,2,3,4]; // resets the snake indexes
  snakeLength = 5; // resets the snake length
  createSnake(snakeLength);
  //Remove all foods left
  for (let cell of cells)
    cell.innerText = "";
  foodIdxs = []; //Resets food indexes
  time = 150;
  score = 0;
  moveSnake(); // redraws the snake
  //Start to move the snake
  createSnakeInterval(); //Start snake auto move
  createFoodInterval();  //Start food generation
};


//...................Functions.....................
// Redrawing the snake logic
//----------------------------------------------
const moveSnake = (function () {
  return function () {
    for (let i = snakeLength - 1; i >= 0; i--) {
      cells[snakeIdxs[i]].appendChild(snake[i]);
    }
  };
})();

//Automatic snake movement
//---------------------------------------------------------
function createSnakeInterval() {
  snakeInterval = setInterval(() => {
    switchCase(currentDir);
  },time);
}

//---------------------------------------------------------
//Food generation
function createFoodInterval() {
  foodInterval = setInterval(() => {
    drawFoodToCells();
  }, 3000);
}
//---------------------------------------------------------------
//Food drawing
function drawFoodToCells() {
  let newFoodIdx = Math.ceil(Math.random() * rows * cols) - 1;
  while (foodIdxs.includes(newFoodIdx))
    newFoodIdx = Math.ceil(Math.random() * rows * cols) - 1;
  foodIdxs.push(newFoodIdx);

  cells[foodIdxs[foodIdxs.length - 1]].innerText =
    allFoodsEmojs[randomFoodIdx()]; //Place a random emoj on last index of the foodidx array
}

//---------------------------------------------------------
// Table generation
function populateTable(table, rowsNum, colsNum, content) {
  for (let i = 0; i < rowsNum; i++) {
    const tr = document.createElement("tr");
    table.appendChild(tr);
  }
  const rows = document.querySelectorAll("tr");
  for (let row of rows) {
    for (let i = 0; i < colsNum; i++) {
      let td = document.createElement("td");
      td.innerText = content;
      row.appendChild(td);
    }
  }
}

//-----------------------------------------------------------
//Snake generation
function createSnake(length) {
  for (let i = 0; i < length; i++) {
    const bodySnakePart = document.createElement("div");
    bodySnakePart.classList.add("snake");
    snake.push(bodySnakePart);
  }
}

//---------------------------------------------------------------------------------------
//Keyboard event handler

function keyUpHandler(ev) {
  const key = ev.keyCode;
  console.log(
    "Key pressed:",
    key === 39
      ? "RIGHT"
      : key === 37
      ? "LEFT"
      : key === 38
      ? "UP"
      : key === 40
      ? "DOWN"
      : null
  );
  keys.innerText =
    key === 39
      ? "RIGHT"
      : key === 37
      ? "LEFT"
      : key === 38
      ? "UP"
      : key === 40
      ? "DOWN"
      : null;
  switchCase(key);
}

//------------------------------------------------------
//Main snake moving logic
function switchCase(key){
const edge = key === 39 ? rightEdgeIdxs :
             key === 37 ? leftEdgeIdxs :
             key === 38 ? topEdgeIdxs :
             key === 40 ? bottomEdgeIdxs :
             null
const oppositeDir = key === 39 ? 37 :
             key === 37 ? 39 :
             key === 38 ? 40 :
             key === 40 ? 38 :
             null
 if (currentDir === oppositeDir) return;
        else {
            //default moving sound
            moveAudio.currentTime = 0;
            moveAudio.play();
          //Increase snake speed according to the score
          if (score > 0 && score%10===0 && !scoresAchieved.includes(score)) {
            scoresAchieved.push(score);
            console.log(score,time)
            time-=10;
            clearInterval(snakeInterval);
            createSnakeInterval();
            drawSpeed(time);
          }
          currentDir = key;
          previousIdx = 0;
          previousIdxTemp = 0;
          for (let i = snakeLength - 1; i >= 0; i--) {
            if (i === snakeLength - 1) {
              //Checks if it's at the edge
              if (edge.includes(snakeIdxs[i])) {
                losingState = true;
                lose.play();
               table.style.display="none";
                loseDiv.style.display="block";
                buttonStop.dispatchEvent(new Event("click"));
                return;
              }
            //Moves the first cell
              previousIdx = snakeIdxs[i];
              snakeIdxs[i] = key === 39 ? snakeIdxs[i]+1 :
             key === 37 ? snakeIdxs[i] - 1 :
             key === 38 ? snakeIdxs[i] - cols :
             key === 40 ? snakeIdxs[i] + cols :
             null;
                //Checks if there's food to eat on cell
              if (foodIdxs.includes(snakeIdxs[i])) {
                playAnimalSound(cells[snakeIdxs[i]].innerText);
                score++;
                foodIdxs.splice(foodIdxs.indexOf(snakeIdxs[i]), 1);
                cells[snakeIdxs[i]].innerText = "";
                //Increase snake length
                snakeLength++;
                const bodySnakePart = document.createElement("div");
                bodySnakePart.classList.add("snake");
                snake.unshift(bodySnakePart);
                snakeIdxs.unshift(snakeIdxs[0]-1);
                cells[snakeIdxs[0]].appendChild(snake[0]);
                drawFoodToCells();
                drawScore(score);
              }
            } else {
              previousIdxTemp = snakeIdxs[i];
              snakeIdxs[i] = previousIdx;
              previousIdx = previousIdxTemp;
            }
          }
        }
        moveSnake();
}
//UI info function
//--------------------------------------------------------
function drawScore(score) {
  scoreDiv.innerText = score;
}
//----------------------------------------------------------
function drawSpeed(time){
  
  const speed = ((time-150)*(-1)) -4;
  speedDiv.innerText = speed;
}
//------------------------------------------------------------
function playAnimalSound(emoj){
  console.log(emoj)
 let emojes =  `🐷 🐽 🐸 🐵 🙈 🙉 🙊 🐒 🐔 🐧 🐦 🐤 🐣 🐥 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🐛 🦋 🐌 🐞 🐜 🦟 🦗 🕷 🕸 🦂 🐢 🐍 🦎 🦖 🦕 🐙 🦑 🦐 🦞 🦀 🐡 🐠 🐟 🐬 🐳 🐋 🦈 🐊 🐅 🐆 🦓 🦍 🦧 🐘 🦛 🦏 🐪 🐫 🦒 🦘 🐃 🐂 🐄 🐎 🐖 🐏 🐑 🦙 🐐 🦌 🐕 🐩`.split(' ');
  emojes.includes(emoj) ? pig.play()
  : cat.play()
}