//Selectors-------------------------------
const buttonStop = document.getElementById("stop");
const buttonStart = document.getElementById("start");
const buttonRestart = document.getElementById("reset");
const keysDiv = document.getElementById("keys");
const scoreDiv = document.getElementById("score");
//-------------------------------
let score = 0;
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
//console.log(leftEdgeIdxs)
//---------------------------------------------------------------------
let snakeInterval;
let foodInterval;
//---------------------------------
//Food props
let allFoodsEmojs = `🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐽 🐸 🐵 🙈 🙉 🙊 🐒 🐔 🐧 🐦 🐤 🐣 🐥 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🐛 🦋 🐌 🐞 🐜 🦟 🦗 🕷 🕸 🦂 🐢 🐍 🦎 🦖 🦕 🐙 🦑 🦐 🦞 🦀 🐡 🐠 🐟 🐬 🐳 🐋 🦈 🐊 🐅 🐆 🦓 🦍 🦧 🐘 🦛 🦏 🐪 🐫 🦒 🦘 🐃 🐂 🐄 🐎 🐖 🐏 🐑 🦙 🐐 🦌 🐕 🐩 🦮 🐕‍🦺 🐈 🐓 🦃 🦚 🦜 🦢 🦩 🕊 🐇 🦝 🦨 🦡 🦦 🦥 🐁 🐀 🐿 🦔 🐾 🐉 🐲 🌵 🎄 🌲 🌳 🌴 🌱 🌿 ☘️ 🍀 🎍 🎋 🍃 🍂 🍁 🍄 🐚`;
allFoodsEmojs = allFoodsEmojs.split(" ");
const randomFoodIdx = () => Math.ceil(Math.random() * allFoodsEmojs.length) - 1;
let foodIdxs = []; // Array with cells indexes of foods
let foodEmojs = [];
//---------------------------------
//Snake props
let snake = []; //DOM elements
let snakeLength = 5;
let currentDir = 39;
let snakeIdxs = [0, 1, 2, 3, 4];
//------------------------------------
//stop:
buttonStop.onclick = () => {
  clearInterval(snakeInterval);
  clearInterval(foodInterval);
  window.removeEventListener("keyup", keyUpHandler);
};
//start:
buttonStart.onclick = () => {
  window.addEventListener("keyup", keyUpHandler);
  //Start to move the snake
  createSnakeInterval();
  createFoodInterval();
};
//Restart:
buttonRestart.onclick = () => {
  //counter = 0;
  clearInterval(snakeInterval);
  clearInterval(foodInterval);
  window.addEventListener("keyup", keyUpHandler);
  currentDir = 39;
  //Remove all extra snake body parts from cells
  for ( let i = 0; i < snake.length; i++){
    cells[snakeIdxs[i]].removeChild(cells[snakeIdxs[i]].firstChild)
  }
  snake = [];
  snakeIdxs = [0,1,2,3,4]; // resets the snake indexes
  snakeLength = 5; // resets the snake length
  createSnake(snakeLength);
  //Remove all foods left
  for (let cell of cells)
    cell.innerText = "";
  foodIdxs = []; //Resets food indexes
  moveSnake(); // redraws the snake
  //Start to move the snake
  createSnakeInterval();
  createFoodInterval();
  
};

//---------------------------------------------------------------------------------------
//Snake initialization and table creation
createTable(rows, cols, "");
createSnake(snakeLength);
drawScore(score);
//Append the snake to the default starting cells
const cells = document.querySelectorAll("td");
for (let i = 0; i < snake.length; i++) {
  cells[i].appendChild(snake[i]);
}

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
    switchIdxs(currentDir);
  }, 130);
}

//---------------------------------------------------------
//Food generation
function createFoodInterval() {
  foodInterval = setInterval(() => {
    drawFoodToCells();
  }, 3000);
}
//---------------------------------------------------------------

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
function createTable(rowsNum, colsNum, content) {
  const table = document.createElement("table");
  document.body.appendChild(table);
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

//---------------------------------------------------------------
//Main switch direction logic
function switchIdxs(key) {
  switch (key) {
    case 39:
      {
        if (currentDir === 37) return;
        else {
          currentDir = key;
          previousIdx = 0;
          previousIdxTemp = 0;
          for (let i = snakeLength - 1; i >= 0; i--) {
            if (i === snakeLength - 1) {
              //Checks if it's at the edge
              if (rightEdgeIdxs.includes(snakeIdxs[i])) {
                alert("You lost");
                buttonStop.dispatchEvent(new Event("click"));
                return;
              }
            
              previousIdx = snakeIdxs[i];
              snakeIdxs[i] += 1;
                //Checks if there's food to eat on cell
              if (foodIdxs.includes(snakeIdxs[i])) {
                score++;
                foodIdxs.splice(foodIdxs.indexOf(snakeIdxs[i]), 1);
                cells[snakeIdxs[i]].innerText = "";
                //Increase snake length
                snakeLength++;
                const bodySnakePart = document.createElement("div");
                bodySnakePart.classList.add("snake");
                snake.unshift(bodySnakePart);
                console.log("snakeIdxs before:",snakeIdxs)
                snakeIdxs.unshift(snakeIdxs[0]-1);
                cells[snakeIdxs[0]].appendChild(snake[0]);
                drawFoodToCells();
                drawScore(score);
                console.log("snakeIdxs after:",snakeIdxs)
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
      break;
    case 37:
      {
        if (currentDir === 39) return;
        else {
          currentDir = key;
          previousIdx = 0;
          previousIdxTemp = 0;
          for (let i = snakeLength - 1; i >= 0; i--) {
            if (i === snakeLength - 1) {
              //Checks if it's at the edge
              if (leftEdgeIdxs.includes(snakeIdxs[i])) {
                alert("You lost");
                buttonStop.dispatchEvent(new Event("click"));
                return;
              }
            
              previousIdx = snakeIdxs[i];
              snakeIdxs[i] -= 1;
                //Checks if there's food to eat on cell
              if (foodIdxs.includes(snakeIdxs[i])) {
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
                console.log("snake length:",snake.length)
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
      break;
    case 38:
      {
        if (currentDir === 40) return;
        else {
          currentDir = key;
          previousIdx = 0;
          previousIdxTemp = 0;
          for (let i = snakeLength - 1; i >= 0; i--) {
            if (i === snakeLength - 1) {
              //Checks if it's at the edge
              if (topEdgeIdxs.includes(snakeIdxs[i])) {
                alert("You lost");
                buttonStop.dispatchEvent(new Event("click"));
                return;
              }
             
              previousIdx = snakeIdxs[i];
              snakeIdxs[i] -= cols;
               //Checks if there's food to eat on cell
              if (foodIdxs.includes(snakeIdxs[i])) {
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
                console.log("snake length:",snake.length)
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
      break;
    case 40:
      {
        if (currentDir === 38) return;
        else {
          currentDir = key;
          previousIdx = 0;
          previousIdxTemp = 0;
          for (let i = snakeLength - 1; i >= 0; i--) {
            if (i === snakeLength - 1) {
              //Checks if it's at the edge
              if (bottomEdgeIdxs.includes(snakeIdxs[i])) {
                alert("You lost");
                buttonStop.dispatchEvent(new Event("click"));
                return;
              }
            
              previousIdx = snakeIdxs[i];
              snakeIdxs[i] += cols;
                //Checks if there's food to eat on cell
              if (foodIdxs.includes(snakeIdxs[i])) {
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
                console.log("snake length:",snake.length)
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
      break;
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
  switchIdxs(key);
}

function drawScore(score) {
  scoreDiv.innerText = score;
}
