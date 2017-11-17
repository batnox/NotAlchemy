const ClientState = require('./client-state');

class Client {
  constructor(id, socket, worm) {
    this.id = id;
    this.socket = socket;
    this.worm = worm;
    this.state = ClientState.SELECTING;
  }
}
module.exports = Client;