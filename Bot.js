import entity from "./Entity";

function RandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

export default class Bot extends entity {
  static NumberOfBots = 0;

  constructor(NBots = null, id, name, health, attack, posX, posY) {
    super(id, name, health, attack, posX, posY);

    if (NBots != null) {
      this.NumberOfBots = NBots;
    } else {
      Bot.NumberOfBots = RandomNumber(2, 5);
    }
  }
}
