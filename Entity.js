export default class entity
{
    constructor(id, name, health, attack, posX, posY) {
        this.id = id;
        this.name = name;
        this.health = health;
        this.attack = attack;
        this.X = posX;
        this.Y = posY;
        this.Spawned = false
        this.entity = true
      }

      async on_collider_2D(EntityCollided)
      {
        EntityCollided = EntityCollided.entity ? EntityCollided : null
        console.log(" COLLIDER_2D ")
      }
    
      // get
      getId() {
        return this.id;
      }
    
      getName() {
        return this.name;
      }
    
      getHealth() {
        return this.health;
      }
    
      getAttack() {
        return this.attack;
      }
    
      getPosX() {
        return this.X;
      }
    
      getPosY() {
        return this.Y;
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