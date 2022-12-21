import entity from "./Entity"

export default new (class Player extends entity
{
    constructor(id, name, health, attack, posX, posY) {
        super(id, name, health, attack, posX, posY);
        window.PLAYER = this;
      }
      
})(window.PLAYER.id,window.PLAYER.name,window.PLAYER.health,window.PLAYER.attack,0,0)