let game;

function startAlchemy() {
  stopGame();
  game = new Alchemy();
}

function startSnake() {
  stopGame();
  game = new SnakeGame(SnakeGameType.SINGLEPLAYER);
}

function startLocal2PSnake() {
  stopGame();
  game = new SnakeGame(SnakeGameType.LOCAL_MULTIPLAYER);
}

function startOnline2PSnake() {
  stopGame();
  game = new SnakeGame(SnakeGameType.ONLINE_MULTIPLAYER);
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