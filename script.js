let currentPlayer = "X";
let board = Array(9).fill("");
let mode = "pvp";
let score = { X: 0, O: 0, Draw: 0 };

const grid = document.getElementById("grid");
const winnerText = document.getElementById("winner");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const scoreDraw = document.getElementById("scoreDraw");
const gameModeSelect = document.getElementById("gameMode");
const restartBtn = document.getElementById("restartBtn");

gameModeSelect.addEventListener("change", () => {
  mode = gameModeSelect.value;
  resetGame();
});

restartBtn.addEventListener("click", resetGame);

function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return board.includes("") ? null : "Draw";
}

function aiMove() {
  const emptyIndices = board
    .map((val, idx) => (val === "" ? idx : null))
    .filter(val => val !== null);

  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  if (randomIndex !== undefined) {
    board[randomIndex] = "O";
  }
}

function handleClick(index) {
  if (board[index] || winnerText.textContent) return;

  board[index] = currentPlayer;
  renderBoard();

  const result = checkWinner();
  if (result) {
    endGame(result);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (mode === "ai" && currentPlayer === "O") {
    setTimeout(() => {
      aiMove();
      renderBoard();
      const result = checkWinner();
      if (result) {
        endGame(result);
        return;
      }
      currentPlayer = "X";
    }, 500);
  }
}

function renderBoard() {
  grid.innerHTML = board
    .map((cell, index) => `<div class="cell" onclick="handleClick(${index})">${cell}</div>`)
    .join("");
}

function endGame(result) {
  if (result === "Draw") {
    score.Draw++;
    winnerText.textContent = "It's a Draw!";
  } else {
    score[result]++;
    winnerText.textContent = `Player ${result} Wins! 🎉`;
    startConfetti();
  }
  updateScore();
}

function updateScore() {
  scoreX.textContent = score.X;
  scoreO.textContent = score.O;
  scoreDraw.textContent = score.Draw;
}

function resetGame() {
  board = Array(9).fill("");
  winnerText.textContent = "";
  currentPlayer = "X";
  renderBoard();
  stopConfetti();
}

renderBoard();


// === 🎊 CONFETTI CELEBRATION ===
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let confetti = [];
let animation;

function startConfetti() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  confetti = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    r: Math.random() * 6 + 4,
    d: Math.random() * 100 + 20,
    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    tilt: Math.random() * 10 - 10,
    tiltAngle: 0,
    speed: Math.random() + 1
  }));

  animation = requestAnimationFrame(drawConfetti);
}

function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confetti.forEach(c => {
    c.y += c.speed;
    c.tiltAngle += 0.05;
    c.x += Math.sin(c.tiltAngle);
    ctx.beginPath();
    ctx.fillStyle = c.color;
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();
  });
  animation = requestAnimationFrame(drawConfetti);
}

function stopConfetti() {
  cancelAnimationFrame(animation);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
