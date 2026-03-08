# 🐍 Snake & Ladder Game 🪜

A fun, browser-based Snake & Ladder game where **you** play against the **CPU**. No installs, no setup — just open and play!

---

## 🎮 What Is This?

Snake & Ladder is a classic board game played on a 10×10 grid (100 squares).

- 🟥 **You** are the **Red** token
- 🟦 **CPU** is the **Blue** token
- Roll the dice, move your token, and race to **square 100** to win!

### Watch out for:
| Symbol | What it does |
|--------|-------------|
| 🐍 Snake (red line) | Sends you **down** — bad luck! |
| 🪜 Ladder (green line) | Sends you **up** — lucky you! |

---

## 🚀 How to Run (Super Simple!)

### Step 1 — Make sure you have Python installed
Open your **Terminal** (Mac/Linux) or **Command Prompt** (Windows) and type:
```bash
python3 --version
```
If you see something like `Python 3.x.x` — you're good! ✅

> **Don't have Python?** Download it free from 👉 https://www.python.org/downloads/

---

### Step 2 — Download the project
```bash
git clone https://github.com/riabiswas-source/snake-ladder-app.git
```
This copies the project to your computer.

---

### Step 3 — Go into the project folder
```bash
cd snake-ladder-app
```

---

### Step 4 — Start the server
```bash
python3 -m http.server 3000
```
You'll see something like:
```
Serving HTTP on :: port 3000 ...
```

---

### Step 5 — Open the game in your browser
Open your browser (Chrome, Safari, Firefox — any!) and go to:
```
http://localhost:3000
```

🎉 **That's it! The game will load and you can start playing!**

---

## 🕹️ How to Play

1. Click **"Roll Dice"** — your red token moves automatically
2. The **CPU rolls** on its own right after you
3. Watch out for 🐍 snakes and aim for 🪜 ladders
4. First one to reach **square 100** wins!
5. Click **"New Game"** anytime to start over

---

## 📁 Project Files

```
snake-ladder-app/
├── index.html   ← The game layout (what you see)
├── style.css    ← The colors and design
└── game.js      ← The game brain (all the logic)
```

---

## 🛠️ Tech Used

- **HTML** — Structure
- **CSS** — Styling & animations
- **JavaScript** — Game logic
- **Canvas API** — Drawing the board, snakes, and ladders

Zero dependencies. No frameworks. Just plain web tech! 🙌

---

## 📸 Preview

```
🟦 .  .  .  .  .  .  .  .  .
.  .  .  .  .  .  .  .  .  .
.  .  .  .  .  .  .  .  .  .
.  .  .  .  .  .  .  .  .  .
.  .  .  .  .  .  .  .  .  .
.  .  🔴 .  .  .  .  .  .  .
```

---

## 📜 License

Free to use for fun and learning! 🎓
