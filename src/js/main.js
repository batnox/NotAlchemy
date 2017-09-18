let game;

function startAlchemy() {
  stopGame();
  game = new Alchemy();
}

function startSnake() {
  stopGame();
  game = new SnakeGame();
}

function stopGame() {
  if (game) {
    game.stop();
    game = null;
  }
}