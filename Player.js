import entity from "./Entity";

export default class Player extends entity {
  constructor(id, name, health, attack, posX, posY) {
    super(id, name, health, attack, posX, posY);
  }
}
