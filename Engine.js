export default class Engine {
  static RAYCAST = {
    up: 0,
    right: 1,
    bottom: 2,
    left: 3,

    INF: 99999,
  };

  static RayCast(matrice, start = { x: 0, y: 0 }, RaySize, direction) {
    if (direction == Engine.RAYCAST.up) {
      for (let x = 1; x <= RaySize; x++) {
        if (matrice[start.y - x] != undefined) {
          if (matrice[start.y - x][start.x] != 1)
            return {
              start,
              position: { x: start.x, y: start.y - x },
              size: x,
              col: true,
            };
        }
      }
    } else if (direction == Engine.RAYCAST.right) {
      for (let x = 1; x < RaySize; x++) {
        if (matrice[start.y][start.x + x] != undefined) {
          if (matrice[start.y][start.x + x] != 1)
            return {
              start,
              position: { x: start.x + x, y: start.y },
              size: x,
              col: true,
            };
        }
      }
    } else if (direction == Engine.RAYCAST.left) {
      for (let x = 1; x < RaySize; x++) {
        if (matrice[start.y][start.x - x] != undefined) {
          if (matrice[start.y][start.x - x] != 1)
            return {
              start,
              position: { x: start.x - x, y: start.y },
              size: x,
              col: true,
            };
        }
      }
    } else if (direction == Engine.RAYCAST.bottom) {
      for (let x = 1; x < RaySize; x++) {
        if (matrice[start.y + x][start.x] != undefined) {
          if (matrice[start.y + x][start.x] != 1)
            return {
              start,
              position: { x: start.x, y: start.y + x },
              size: x,
              col: true,
            };
        }
      }
    }

    return { start, position: { x: start.x, y: start.y }, size: 0, col: false };
  }
}
