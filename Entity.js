export default class entity {
  constructor(id, name, health, attack, posX, posY) {
    this.id = id;
    this.name = name;
    this.health = health;
    this.attack = attack;
    this.posX = posX;
    this.posY = posY;
  }

  //set

  setHealth(health) {
    this.health = health;
  }

  setAttack(attack) {
    this.attack = attack;
  }

  setPosX(posX) {
    this.X = posX;
  }

  setPosY(posY) {
    this.Y = posY;
  }
}
