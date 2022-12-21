import entity from "./Entity"

function RandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

export default class Bots extends entity
{
   static NumberOfBots = 0;

    static bots = new Array()

    constructor(NBots=null,id, name, health, attack, posX, posY) {
        super(id, name, health, attack, posX, posY);

        this.X = posX
        this.Y = posY

        if(NBots != null)
        {
          this.NumberOfBots = NBots

        }else
        {
          Bots.NumberOfBots = RandomNumber(2,5)
        }
      }
}