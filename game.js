// ─── Constants ────────────────────────────────────────────────
const BOARD_SIZE   = 10;
const CELL_COUNT   = 100;
const CANVAS_SIZE  = 540;
const CELL_SIZE    = CANVAS_SIZE / BOARD_SIZE;

// Standard Snake & Ladder positions { from: to }
const SNAKES = {
  99: 78, 95: 56, 87: 24, 64: 60, 62: 19, 54: 34, 17: 7
};

const LADDERS = {
  4: 25, 13: 46, 33: 49, 42: 63, 50: 69, 62: 81, 74: 92
};

// Wait — fix conflict: 62 appears in both. Let's use clean sets:
const SNAKES_MAP = {
  99: 78,
  95: 56,
  87: 24,
  64: 60,
  54: 34,
  17: 7
};

const LADDERS_MAP = {
  4:  25,
  13: 46,
  33: 49,
  42: 63,
  50: 69,
  74: 92
};

const DICE_FACES = ['🎲','⚀','⚁','⚂','⚃','⚄','⚅'];

// ─── State ────────────────────────────────────────────────────
let state = {
  positions: { player: 0, cpu: 0 },
  turn: 'player',      // 'player' | 'cpu'
  gameOver: false,
  rolling: false
};

// ─── DOM refs ─────────────────────────────────────────────────
const canvas   = document.getElementById('boardCanvas');
const ctx      = canvas.getContext('2d');
const rollBtn  = document.getElementById('rollBtn');
const resetBtn = document.getElementById('resetBtn');
const diceEl   = document.getElementById('dice');
const diceVal  = document.getElementById('dice-value');
const logEl    = document.getElementById('log');
const overlay  = document.getElementById('overlay');
const winnerTx = document.getElementById('winner-text');
const playAgainBtn = document.getElementById('playAgainBtn');

// ─── Board Drawing ─────────────────────────────────────────────

function cellToCoord(cell) {
  // cell: 1-100, returns canvas {x, y} top-left of the cell
  const idx  = cell - 1;                      // 0-based
  const row  = Math.floor(idx / BOARD_SIZE);  // 0 = bottom row in game
  const col  = idx % BOARD_SIZE;

  // Row 0 = bottom (displayed row 9), row 9 = top (displayed row 0)
  const displayRow = BOARD_SIZE - 1 - row;

  // Even rows (from bottom, 0-indexed) go left→right, odd rows right→left
  const displayCol = (row % 2 === 0) ? col : (BOARD_SIZE - 1 - col);

  return {
    x: displayCol * CELL_SIZE,
    y: displayRow * CELL_SIZE
  };
}

function cellCenter(cell) {
  const { x, y } = cellToCoord(cell);
  return { x: x + CELL_SIZE / 2, y: y + CELL_SIZE / 2 };
}

function drawBoard() {
  // Alternate cell colors
  const colors = ['#f0d9b5', '#b58863'];
  for (let cell = 1; cell <= CELL_COUNT; cell++) {
    const { x, y } = cellToCoord(cell);
    const row = Math.floor((cell - 1) / BOARD_SIZE);
    const col = (cell - 1) % BOARD_SIZE;
    ctx.fillStyle = (row + col) % 2 === 0 ? colors[0] : colors[1];
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

    // Cell number
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.font = `bold ${CELL_SIZE * 0.2}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(cell, x + 4, y + 3);
  }

  // Grid lines
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= BOARD_SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL_SIZE, 0);
    ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * CELL_SIZE);
    ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
    ctx.stroke();
  }
}

function drawSnakes() {
  for (const [from, to] of Object.entries(SNAKES_MAP)) {
    const f = cellCenter(Number(from));
    const t = cellCenter(Number(to));
    drawCurvedLine(f, t, '#c0392b', 5, true);
  }
}

function drawLadders() {
  for (const [from, to] of Object.entries(LADDERS_MAP)) {
    const f = cellCenter(Number(from));
    const t = cellCenter(Number(to));
    drawCurvedLine(f, t, '#27ae60', 5, false);
  }
}

function drawCurvedLine(from, to, color, lineWidth, isSnake) {
  const cx = (from.x + to.x) / 2 + (isSnake ? 30 : -30);
  const cy = (from.y + to.y) / 2;

  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.quadraticCurveTo(cx, cy, to.x, to.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Draw head/foot circles
  [from, to].forEach((pt, i) => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = i === 0 ? color : 'white';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Label emoji
  const label = isSnake ? '🐍' : '🪜';
  ctx.font = `${CELL_SIZE * 0.3}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, cx, cy);
}

function drawTokens() {
  const { player, cpu } = state.positions;

  // Draw CPU token (blue)
  if (cpu > 0) {
    const { x, y } = cellCenter(cpu);
    drawToken(x - 8, y, '#3498db', '🔵');
  }

  // Draw Player token (red) slightly offset if same cell
  if (player > 0) {
    const { x, y } = cellCenter(player);
    const offset = (player === cpu && cpu > 0) ? 8 : 0;
    drawToken(x + offset, y, '#e74c3c', '🔴');
  }
}

function drawToken(x, y, color, emoji) {
  ctx.font = `${CELL_SIZE * 0.42}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.fillText(emoji, x, y);
  ctx.shadowBlur = 0;
}

function render() {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  drawBoard();
  drawSnakes();
  drawLadders();
  drawTokens();
  updateUI();
}

// ─── UI Updates ───────────────────────────────────────────────

function updateUI() {
  const { positions, turn } = state;

  document.getElementById('pos-player').textContent =
    `Position: ${positions.player}`;
  document.getElementById('pos-cpu').textContent =
    `Position: ${positions.cpu}`;

  document.getElementById('card-player').classList.toggle('active', turn === 'player');
  document.getElementById('card-cpu').classList.toggle('active', turn === 'cpu');

  rollBtn.disabled = state.rolling || state.gameOver || turn !== 'player';
}

function addLog(message, type = '') {
  const div = document.createElement('div');
  div.className = `log-entry ${type}`;
  div.textContent = message;
  logEl.prepend(div);
}

// ─── Game Logic ───────────────────────────────────────────────

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function applyMove(who, roll) {
  let pos = state.positions[who];
  const oldPos = pos;
  pos += roll;

  if (pos > 100) {
    addLog(`${label(who)} rolled ${roll} but needs exact number to win! Stays at ${oldPos}.`);
    return false; // no win, stayed
  }

  state.positions[who] = pos;
  addLog(`${label(who)} rolled ${roll} → moved to ${pos}`);

  // Check snake
  if (SNAKES_MAP[pos] !== undefined) {
    const newPos = SNAKES_MAP[pos];
    addLog(`🐍 ${label(who)} hit a snake at ${pos}! Slides down to ${newPos}`, 'snake');
    state.positions[who] = newPos;
    return false;
  }

  // Check ladder
  if (LADDERS_MAP[pos] !== undefined) {
    const newPos = LADDERS_MAP[pos];
    addLog(`🪜 ${label(who)} climbed a ladder at ${pos}! Up to ${newPos}`, 'ladder');
    state.positions[who] = newPos;
    return false;
  }

  // Check win
  if (state.positions[who] === 100) {
    return true;
  }

  return false;
}

function label(who) {
  return who === 'player' ? '🔴 You' : '🔵 CPU';
}

function endGame(winner) {
  state.gameOver = true;
  const msg = winner === 'player' ? '🎉 You Win!' : '🤖 CPU Wins!';
  addLog(msg, 'win');
  winnerTx.textContent = msg;
  overlay.classList.remove('hidden');
  updateUI();
}

// ─── Dice Animation ───────────────────────────────────────────

function animateDice(finalValue, callback) {
  state.rolling = true;
  rollBtn.disabled = true;
  diceEl.classList.add('rolling');

  let count = 0;
  const interval = setInterval(() => {
    const rand = Math.floor(Math.random() * 6) + 1;
    diceEl.textContent = DICE_FACES[rand];
    count++;
    if (count >= 8) {
      clearInterval(interval);
      diceEl.textContent = DICE_FACES[finalValue];
      diceVal.textContent = finalValue;
      diceEl.classList.remove('rolling');
      state.rolling = false;
      callback();
    }
  }, 80);
}

// ─── Turn Management ──────────────────────────────────────────

function playerTurn() {
  const roll = rollDice();
  animateDice(roll, () => {
    const won = applyMove('player', roll);
    render();
    if (won) {
      endGame('player');
      return;
    }
    // Switch to CPU
    state.turn = 'cpu';
    updateUI();
    setTimeout(cpuTurn, 900);
  });
}

function cpuTurn() {
  const roll = rollDice();
  addLog(`🔵 CPU is rolling...`);
  animateDice(roll, () => {
    const won = applyMove('cpu', roll);
    render();
    if (won) {
      endGame('cpu');
      return;
    }
    state.turn = 'player';
    updateUI();
  });
}

// ─── Init & Events ────────────────────────────────────────────

function resetGame() {
  state = {
    positions: { player: 0, cpu: 0 },
    turn: 'player',
    gameOver: false,
    rolling: false
  };
  diceEl.textContent = '🎲';
  diceVal.textContent = '-';
  logEl.innerHTML = '';
  overlay.classList.add('hidden');
  addLog('🎮 New game started! Your turn first.');
  render();
}

rollBtn.addEventListener('click', () => {
  if (state.turn === 'player' && !state.gameOver && !state.rolling) {
    playerTurn();
  }
});

resetBtn.addEventListener('click', resetGame);
playAgainBtn.addEventListener('click', resetGame);

// Start
resetGame();
