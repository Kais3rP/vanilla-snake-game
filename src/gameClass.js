
const moveAudio = document.getElementById("move");
const buttonStop = document.getElementById("stop");
const keysDiv = document.getElementById("keys");
const scoreDiv = document.getElementById("score");
const speedDiv = document.getElementById("speed");
const tableContainer = document.getElementById("table-container");
const loseDiv = document.getElementById("lose-div");
const speedInput = document.getElementById("speed-input");
//--------------------------------------------------------------------------------------
// Game CLASS --------------------------------------------------------------------------
export default class Game {
  constructor(rows, cols, time) {
    this.gameState = false;
    this.losingState = false;
    this.firstStart = true;
    this.score = 0;
    this.time = time;
    this.speed = 1;
    this.selfCollide = true;
    this.rows = rows;
    this.cols = cols;
    this.topEdgeIdxs = [];
    this.bottomEdgeIdxs = [];
    this.rightEdgeIdxs = [];
    this.leftEdgeIdxs = [];
    this.snakeInterval = {};
    this.foodInterval = {};
    this.allFoodsEmojs = `🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐽 🐸 🐵 🙈 🙉 🙊 🐒 🐔 🐧 🐦 🐤 🐣 🐥 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🐛 🦋 🐌 🐞 🐜 🦟 🦗 🕷 🕸 🦂 🐢 🐍 🦎 🦖 🦕 🐙 🦑 🦐 🦞 🦀 🐡 🐠 🐟 🐬 🐳 🐋 🦈 🐊 🐅 🐆 🦓 🦍 🦧 🐘 🦛 🦏 🐪 🐫 🦒 🦘 🐃 🐂 🐄 🐎 🐖 🐏 🐑 🦙 🐐 🦌 🐕 🐩 🦮 🐕‍🦺 🐈 🐓 🦃 🦚 🦜 🦢 🦩 🕊 🐇 🦝 🦨 🦡 🦦 🦥 🐁 🐀 🐿 🦔 🐾 🐉 🐲 🌵 🎄 🌲 🌳 🌴 🌱 🌿 ☘️ 🍀 🎍 🎋 🍃 🍂 🍁 🍄 🐚`.split(
      " "
    );
    this.foodIdxs = [];
    this.snake = [];
    this.snakeLength = 5;
    this.currentDir = 39;
    this.snakeIdxs = [0, 1, 2, 3, 4];
    this.headX = 0;
    this.headY = 0;
  }
  populateEdgeArrays() {
    const cols = this.cols;
    const rows = this.rows;
    for (let i = 0; i < cols; i++) this.topEdgeIdxs.push(i);
    for (let i = cols * (rows - 1); i < cols * rows; i++)
      this.bottomEdgeIdxs.push(i);
    for (let i = 0; i < cols * rows; i++) {
      if (i - (cols - 1) >= 0 && (i - (cols - 1)) % cols === 0)
        this.rightEdgeIdxs.push(i);
      if (i % cols === 0) this.leftEdgeIdxs.push(i);
    }
  }
  generateRandomFoodIdx() {
    return Math.ceil(Math.random() * this.allFoodsEmojs.length) - 1;
  }
  generateRandomCellIdx() {
    return Math.ceil(Math.random() * this.rows * this.cols) - 1;
  }
  populateTable() {
    const table = document.querySelector("table");
    for (let i = 0; i < this.rows; i++) {
      const tr = document.createElement("tr");
      table.appendChild(tr);
    }
    const rowsDom = document.querySelectorAll("tr");
    for (let row of rowsDom) {
      for (let i = 0; i < this.cols; i++) {
        let td = document.createElement("td");
        row.appendChild(td);
      }
    }
    this.cells = document.querySelectorAll("td");

  }
  createSnake() {
    for (let i = 0; i < this.snakeLength; i++) {
      const bodySnakePart = document.createElement("div");
      bodySnakePart.classList.add("snake");
      this.snake.push(bodySnakePart);
    }
    this.drawSnake();
  }
  drawSnake() {
    for (let i = this.snakeLength - 1; i >= 0; i--) {
      this.cells[this.snakeIdxs[i]].appendChild(this.snake[i]);
    }
  }
  createSnakeInterval() {
    this.snakeInterval = setInterval(() => {
      this.handleDirectionChange(this.currentDir);
    }, this.time);
  }

  handleDirectionChange(key) {
    const edge =
      key === 39
        ? this.rightEdgeIdxs
        : key === 37
          ? this.leftEdgeIdxs
          : key === 38
            ? this.topEdgeIdxs
            : key === 40
              ? this.bottomEdgeIdxs
              : null;
    const oppositeDir =
      key === 39
        ? 37
        : key === 37
          ? 39
          : key === 38
            ? 40
            : key === 40
              ? 38
              : null;
    if (this.currentDir === oppositeDir) return;
    else {
      //default moving sound
      moveAudio.currentTime = 0;
      moveAudio.play();
      this.currentDir = key;
      let previousIdx = 0;
      let previousIdxTemp = 0;
      for (let i = this.snakeLength - 1; i >= 0; i--) {
        if (i === this.snakeLength - 1) {
          //Checks if it's at the edge
          if (edge.includes(this.snakeIdxs[i])) {
            this.losingState = true;
            lose.currentTime = 0;
            lose.play();
            tableContainer.style.display = "none";
            loseDiv.style.display = "flex";
            buttonStop.dispatchEvent(new Event("click"));
            return;
          }
          //Checks if it self collides
          if (
            this.snakeIdxs
              .slice(0, this.snakeIdxs.length - 1)
              .includes(this.snakeIdxs[i]) &&
            this.selfCollide
          ) {
            this.losingState = true;
            lose.currentTime = 0;
            lose.play();
            tableContainer.style.display = "none";
            loseDiv.style.display = "flex";
            buttonStop.dispatchEvent(new Event("click"));
            return;
          }
          //Moves the first cell
          previousIdx = this.snakeIdxs[i];
          this.snakeIdxs[i] =
            key === 39
              ? this.snakeIdxs[i] + 1
              : key === 37
                ? this.snakeIdxs[i] - 1
                : key === 38
                  ? this.snakeIdxs[i] - this.cols
                  : key === 40
                    ? this.snakeIdxs[i] + this.cols
                    : null;
          //Recalculates the coordinates of the snake head
          this.headX = this.snake[this.snakeLength - 1].getBoundingClientRect().x;
          this.headY = this.snake[this.snakeLength - 1].getBoundingClientRect().y;
          //Checks if there's food to eat on cell
          if (this.foodIdxs.includes(this.snakeIdxs[i])) {
            this.playAnimalSound(this.cells[this.snakeIdxs[i]].innerText);
            this.score++;
            //Increase snake speed according to the score
            if (this.score % 10 === 0) {
              this.speed++;
              this.drawSpeed(this.speed);
              this.time -= 10;
              clearInterval(this.snakeInterval);
              this.createSnakeInterval();
            }
            this.foodIdxs.splice(this.foodIdxs.indexOf(this.snakeIdxs[i]), 1);
            this.cells[this.snakeIdxs[i]].innerText = "";
            //Increase snake length
            this.snakeLength++;
            const bodySnakePart = document.createElement("div");
            bodySnakePart.classList.add("snake");
            this.snake.unshift(bodySnakePart);
            this.snakeIdxs.unshift(this.snakeIdxs[0] - 1);
            this.cells[this.snakeIdxs[0]].appendChild(this.snake[0]);
            //Drawing food and score
            this.drawFoodToCells();
            this.drawScore(this.score);
          }
        } else {
          previousIdxTemp = this.snakeIdxs[i];
          this.snakeIdxs[i] = previousIdx;
          previousIdx = previousIdxTemp;
        }
      }
    }
    this.drawSnake();
  }
  keyUpHandler(ev) {
    const key = ev.keyCode;
    if (key !== 37 && key !== 38 && key !== 39 && key !== 40) return;
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
    keysDiv.innerText =
      key === 39
        ? "RIGHT"
        : key === 37
          ? "LEFT"
          : key === 38
            ? "UP"
            : key === 40
              ? "DOWN"
              : null;

    this.handleDirectionChange(key);
  }
  touchStartHandler(ev) {
    console.log(ev.touches[0].clientX, this.headX, ev.touches[0].clientY, this.headY)
    const key = (this.currentDir === 39 || this.currentDir === 37) ?
      ev.touches[0].clientY > this.headY ?
        40 :
        38 :
      ev.touches[0].clientX > this.headX ?
        39 :
        37
    console.log(key);
    this.handleDirectionChange(key);
  }
  createFoodInterval() {
    this.foodInterval = setInterval(() => {
      this.drawFoodToCells();
    }, 3000);
  }
  drawFoodToCells() {
    let newFoodIdx = this.generateRandomCellIdx();
    while (this.foodIdxs.includes(newFoodIdx))
      newFoodIdx = Math.ceil(Math.random() * this.rows * this.cols) - 1;
    this.foodIdxs.push(newFoodIdx);

    this.cells[
      this.foodIdxs[this.foodIdxs.length - 1]
    ].innerText = this.allFoodsEmojs[this.generateRandomFoodIdx()]; //Place a random emoj on last index of the foodidx array
  }
  playAnimalSound(emoj) {
    console.log("You just ate a:", emoj);
    let emojes = `🐷 🐽 🐸 🐵 🙈 🙉 🙊 🐒 🐔 🐧 🐦 🐤 🐣 🐥 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🐛 🦋 🐌 🐞 🐜 🦟 🦗 🕷 🕸 🦂 🐢 🐍 🦎 🦖 🦕 🐙 🦑 🦐 🦞 🦀 🐡 🐠 🐟 🐬 🐳 🐋 🦈 🐊 🐅 🐆 🦓 🦍 🦧 🐘 🦛 🦏 🐪 🐫 🦒 🦘 🐃 🐂 🐄 🐎 🐖 🐏 🐑 🦙 🐐 🦌 🐕 🐩`.split(
      " "
    );
    emojes.includes(emoj) ? pig.play() : cat.play();
  }
  drawScore(score) {
    scoreDiv.innerText = this.score;
  }
  drawSpeed(speed) {
    speedDiv.innerText = this.speed;
  }
  resetAll() {
    this.losingState = false;
    this.currentDir = 39;
    clearInterval(this.snakeInterval);
    clearInterval(this.foodInterval);
    //Remove all extra snake body parts from cells
    for (let i = 0; i < this.snake.length; i++) {
      this.cells[this.snakeIdxs[i]].removeChild(this.cells[this.snakeIdxs[i]].firstChild);
    }
    this.snake = []; //Reset the snake divs array
    this.snakeIdxs = [0, 1, 2, 3, 4]; // resets the snake indexes
    this.snakeLength = 5; // resets the snake length
    //Remove all foods left
    for (let cell of this.cells) cell.innerText = "";
    this.foodIdxs = []; //Resets food indexes
    this.time = 160 - speedInput.value;
    this.score = 0;
    this.speed = 1;
    this.drawScore(this.score);
    this.drawSpeed(this.speed);
  }
}


