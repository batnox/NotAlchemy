const socket = io();
let game;

function startAlchemy() {
  stopGame();
  game = new Alchemy();
}

function startSnake() {
  stopGame();
  game = new SnakeGame();
}

function startBubbleShooter() {
  stopGame();
  game = new BubbleGame();
}

function stopGame() {
  if (game) {
    game.stop();
    game = null;
  }
}