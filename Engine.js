import Player from "./Player.js"
import Bots from "./Bot.js";


export default class Engine
{    
    static GameEntity = new Array()

    static RAYCAST = 
    {
        up: 0,
        right: 1,
        bottom: 2,
        left: 3,

        INF : 99999
    };


    static GetEntityByPosition(x,y)
    {
      for(let _entity of Engine.GameEntity)
      {
          if(_entity.X == x && _entity.Y == y)
          {
            return _entity
          }
      }

      return {entity:false,X:(x || 0),Y: (y || 0),on_cllider_2D:async ()=> 0}

    }

    static async check_collider_2D(maze,_entity)
    {
      // top
      let centity
      if(maze[_entity.Y-1][_entity.X] != 1 && (centity = Engine.GetEntityByPosition(_entity.X,_entity.Y-1)).entity)
          _entity.on_collider_2D(centity)

      // right
      if(maze[_entity.Y][_entity.X+1] != 1 && (centity = Engine.GetEntityByPosition(_entity.X+1,_entity.Y)).entity)
          _entity.on_collider_2D(centity)

      // bottom
      if(maze[_entity.Y+1][_entity.X] != 1 && (centity = Engine.GetEntityByPosition(_entity.X,_entity.Y+1)).entity)
          _entity.on_collider_2D(centity)

      // left
      if(maze[_entity.Y][_entity.X-1] != 1 && (centity = Engine.GetEntityByPosition(_entity.X-1,_entity.Y)).entity)
          _entity.on_collider_2D(centity)

    }



    static RayCast(matrice, start = { x: 0, y: 0 }, RaySize, direction) {
        if (direction == Engine.RAYCAST.up) {
          for (let x = 1; x <= RaySize; x++) {
            if (matrice[start.y - x] != undefined) {
              if (matrice[start.y - x][start.x] != 1)
                return {start, position: { x: start.x, y: (start.y - x) },size:x, col: true };
            }
          }

        } else if (direction == Engine.RAYCAST.right) {
          for (let x = 1; x < RaySize; x++) {
            if (matrice[start.y][start.x + x] != undefined) {
              if (matrice[start.y][start.x + x] != 1)
                return {start, position: { x: (start.x + x), y: start.y },size:x, col: true };
            }
          }

        }else if (direction == Engine.RAYCAST.left) {
            for (let x = 1; x < RaySize; x++) {
              if (matrice[start.y][start.x - x] != undefined) {
                if (matrice[start.y][start.x - x] != 1)
                  return {start, position: { x: (start.x - x), y: start.y },size:x, col: true };
              }
            }

          }else if (direction == Engine.RAYCAST.bottom) {
            for (let x = 1; x < RaySize; x++) {
              if (matrice[start.y+x][start.x] != undefined) {
                if (matrice[start.y+x][start.x] != 1)
                  return { start, position: { x: start.x, y: (start.y + x) },size:x, col: true };
              }
            }
          }

        return {start, position: { x: start.x, y: start.y }, size: 0, col: false };
      }

}

Engine.GameEntity.push(Player)