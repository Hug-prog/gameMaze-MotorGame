import Player from "./Player.js";
import Bot from "./Bot.js";
import entity from "./Entity.js";
import Arrow from "./Arrow.js";
import Engine from "./Engine.js";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export default new (class Party {
  #render = false;
  #bot_run = false;
  #bots = [];

  #frame_rate = 120000 / 1000;

  #CONTROL = {
    up: "z",
    left: "q",
    right: "d",
    bottom: "s",
  };

  #objMaze = {
    killBots: false,
  };

  #maze = [];

  #width = 0;
  #height = 0;

  //player
  player = new Player(
    window.PLAYER.id,
    window.PLAYER.name,
    window.PLAYER.health,
    window.PLAYER.attack,
    1,
    1
  );

  // Arrow
  arrow = new Arrow(this.player.posX, this.player.posY);

  SetFrameRate(fps) {
    this.#frame_rate = fps / 1000;
  }

  GetFrameRate() {
    return this.#frame_rate;
  }

  GetWidth() {
    return this.#width;
  }

  GetHeight() {
    return this.#height;
  }

  SetMaze(matrice) {
    this.#maze = matrice;

    return this;
  }

  GetMaze() {
    return this.#maze;
  }

  #Draw() {
    this.#maze.forEach(vh => {
      var ligne = "<tr>";

      vh.forEach(vw => {
        if (vw == 1) {
          ligne += "<td></td>";
        } else if (vw == "p") {
          ligne += '<td name="td" alt=""></td>';
        } else if (vw == "b") {
          ligne += '<td name="tdMobs" alt=""></td>';
        } else if (vw == "arr") {
          ligne += '<td name="arr" bgcolor="red" class="arr" alt=""></td>';
        } else {
          ligne += '<td bgcolor="black" alt=""></td>';
        }
      });

      document
        .getElementById("monLabyrinthe")
        .insertAdjacentHTML("beforeEnd", ligne);
    });
  }

  #Clear() {
    Object.values(
      document.getElementById("monLabyrinthe").getElementsByTagName("tr")
    ).forEach(v => v.remove());
  }

  // create and render in maze an obj for player
  #renderObjMaze(maze, Object) {
    this.X = RandomNumber(this.GetWidth(), this.GetHeight());
    this.Y = RandomNumber(this.GetWidth(), this.GetHeight());
    maze[this.X][this.Y] = Object;
  }

  // create and render wall player
  #renderArrow(maze, wall, arrow, arrowDirection, player) {
    arrow.setPosX(player.posX);
    arrow.setPosY(player.posY);
    for (let i = 0; i <= wall - 2; i++) {
      if (arrowDirection == "up") {
        //
        maze[arrow.posY - 1][arrow.posX] = "arr";
        arrow.setPosY(arrow.posY - 1);
        arrow.setPosX(this.player.posX);
        //
      } else if (arrowDirection == "down") {
        //
        maze[arrow.posY + 1][arrow.posX] = "arr";
        arrow.setPosY(arrow.posY + 1);
        arrow.setPosX(this.player.posX);
        //
      } else if (arrowDirection == "left") {
        //
        maze[arrow.posY][arrow.posX - 1] = "arr";
        arrow.setPosX(arrow.posX - 1);
        arrow.setPosY(this.player.posY);
        //
      } else if (arrowDirection == "right") {
        //
        maze[arrow.posY][arrow.posX + 1] = "arr";
        arrow.setPosX(arrow.posX + 1);
        arrow.setPosY(this.player.posY);
        //
      }
    }
  }

  #Render() {
    return (async () => {
      do {
        this.#Draw();
        await sleep(this.#frame_rate);
        this.#Clear();
      } while (this.#render);

      this.#Draw();
    })();
  }

  StartRender() {
    this.#render = true;
    this.#Render();

    return this;
  }

  StopRender() {
    this.#render = false;

    return this;
  }

  StartRenderObj(obj) {
    this.#objMaze.obj = true;
    return this;
  }

  StopRenderObj(obj) {
    this.#objMaze.obj = false;
    return this;
  }

  BuildRandomMaze(w, h) {
    this.#width = w;
    this.#height = h;

    const _m = {};
    _m.matrice = [];

    for (let _h = 0; _h < h; _h++) {
      _m.matrice[_h] = [];

      _m.matrice[_h].push(0);

      for (let _w = 0; _w < w; _w++) {
        if (_h == 0 || _w == w - 1 || _h == h - 1) {
          _m.matrice[_h].push(0);
        } else _m.matrice[_h].push(0);
      }
    }

    // Parcour les colonne
    _m.matrice.forEach((_eh, ih) => {
      // Parcour les ligne
      _eh.forEach((_ew, iw) => {
        // Check si il est plus grand que 0  et plus petit que la taille de la matrice (pour les bord)
        if (
          iw > 0 &&
          ih > 0 &&
          iw < _m.matrice[0].length - 2 &&
          ih < _m.matrice.length - 2
        ) {
          // Verifie si c'est de "2 en 2"
          if (ih % 2 || iw % 2) {
            // Si c'est la cas alors c'est un carré blanc (vide)
            _m.matrice[ih][iw] = 1;
          }
        }

        // Pour eliminer la surcouche des bord
        if (iw == _m.matrice[0].length - 1 || ih == _m.matrice.length - 1)
          _m.matrice[ih][iw] = 1;
      });
    });

    // J'ai essayé de concatener ce qui suit dans la première iteration mais j'y arrive pas

    // Parcour les colonne
    _m.matrice.forEach((_eh, ih) => {
      // Parcour les ligne
      _eh.forEach((_ew, iw) => {
        // Random Position (pour plus tard)
        let CRandom = RandomNumber(0, 3);

        // Check si il est plus grand que 0  et plus petit que la taille de la matrice (pour les bord)
        if (
          iw > 0 &&
          ih > 0 &&
          iw < _m.matrice[0].length - 2 &&
          ih < _m.matrice.length - 2
        ) {
          if (
            ih >= this.player.posY &&
            iw >= this.player.posX &&
            !this.player.Spawned &&
            ih % 2 &&
            iw % 2
          ) {
            this.player.posY = ih;
            this.player.posX = iw;
            _m.matrice[ih][iw] = "p";
            this.player.Spawned = true;
          }

          // Verifie si ce n'est de "2 en 2" (pour être sur les carré noir)
          if (!(ih % 2) && !(iw % 2)) {
            // Si CRandom est egal 0 alors il y a un carré noir au dessus de celui actuellement
            if (CRandom == 0) {
              _m.matrice[ih - 1][iw] = 0;

              // Si CRandom est egal 1 alors il y a un carré noir juste a droite de celui actuellement
            } else if (CRandom == 1) {
              _m.matrice[ih][iw + 1] = 0;

              // Si CRandom est egal 2 alors il y a un carré noir en dessous de celui actuellement
            } else if (CRandom == 2) {
              _m.matrice[ih + 1][iw] = 0;

              // Si CRandom est egal 2 alors il y a un carré noir juste a gauche de celui actuellement
            } else if (CRandom == 3) {
              _m.matrice[ih][iw - 1] = 0;
            }
          }
        }
      });
    });

    this.#maze = _m.matrice;

    return _m;
  }

  // get direction of mobs
  #MoveBots(bot) {
    let direction = ["up", "down", "left", "right"];
    let random = direction[Math.floor(Math.random() * direction.length)];

    // move Up
    if (random == "up") {
      if (
        this.#maze[bot.posY - 1][bot.posX] == 1 ||
        this.#maze[bot.posY - 1][bot.posX] == "p"
      ) {
        if (this.#maze[bot.posY - 1][bot.posX] == "p") {
          this.player.setHealth(this.player.health - 3);
        } else {
          this.#maze[bot.posY][bot.posX] = 1;
          bot.posY -= 1;
          this.#maze[bot.posY][bot.posX] = "b";
        }
      }
    }
    // move Down
    else if (random == "down") {
      if (
        this.#maze[bot.posY + 1][bot.posX] == 1 ||
        this.#maze[bot.posY + 1][bot.posX] == "p"
      ) {
        if (this.#maze[bot.posY + 1][bot.posX] == "p") {
          this.player.setHealth(this.player.health - 3);
        } else {
          this.#maze[bot.posY][bot.posX] = 1;
          bot.posY += 1;
          this.#maze[bot.posY][bot.posX] = "b";
        }
      }
    }
    // move left
    else if (random == "left") {
      if (
        this.#maze[bot.posY][bot.posX - 1] == 1 ||
        this.#maze[bot.posY][bot.posX - 1] == "p"
      ) {
        if (this.#maze[bot.posY][bot.posX - 1] == "p") {
          this.player.setHealth(this.player.health - 3);
        } else {
          this.#maze[bot.posY][bot.posX] = 1;
          bot.posX -= 1;
          this.#maze[bot.posY][bot.posX] = "b";
        }
      }
    }
    // move right
    else if (random == "right") {
      if (
        this.#maze[bot.posY][bot.posX + 1] == 1 ||
        this.#maze[bot.posY][bot.posX + 1] == "p"
      ) {
        if (this.#maze[bot.posY][bot.posX + 1] == "p") {
          this.player.setHealth(this.player.health - 3);
        } else {
          this.#maze[bot.posY][bot.posX] = 1;
          bot.posX += 1;
          this.#maze[bot.posY][bot.posX] = "b";
        }
      }
    }
  }

  #RunBots() {
    return (async () => {
      while (this.#bot_run) {
        for (let bot of this.#bots) {
          this.#MoveBots(bot);
          this.pushHealth(this.player.health);
        }
        await sleep(this.#frame_rate);
      }
    })();
  }

  StartBots() {
    this.#bot_run = true;
    this.#RunBots();
  }

  StopBots() {
    this.#bot_run = false;
  }

  SpawnBot(n = null) {
    if (this.#maze.length == 0) return 0;

    if (n != null) Bot.NumberOfBots = n;
    else n = Bot.NumberOfBots;

    for (let x = 0; x <= Bot.NumberOfBots; x++) {
      let TempBotPos = {
        x: RandomNumber(1, this.#width - 2),
        y: RandomNumber(1, this.#height - 2),
      };

      this.#maze.forEach((_eh, ih) => {
        // Parcour les ligne
        _eh.forEach((_ew, iw) => {
          // Check si il est plus grand que 0  et plus petit que la taille de la matrice (pour les bord)
          if (
            iw > 0 &&
            ih > 0 &&
            iw < this.#maze[0].length - 2 &&
            ih < this.#maze.length - 2
          ) {
            if (TempBotPos == null) return;
            // Verifie si c'est de "2 en 2"
            if (_ew == 1 && ih >= TempBotPos.y && iw >= TempBotPos.x) {
              TempBotPos.x = iw;
              TempBotPos.y = ih;

              this.#bots.push(
                new Bot(null, x, "Bob", 100, -10, TempBotPos.x, TempBotPos.y)
              );
              // Si c'est la cas alors c'est un carré blanc (vide)
              this.#maze[ih][iw] = "b";
              TempBotPos = null;
            }
          }
        });
      });
    }

    return this;
  }

  //push health
  pushHealth(health) {
    document.querySelector(".health").innerHTML = `health = ${health}`;
  }

  RunGame() {
    this.SpawnBot();

    this.#renderObjMaze(this.#maze, this.#objMaze.killBots);

    document.addEventListener("keydown", event => {
      if (
        (event.key.toLowerCase() == this.#CONTROL.up &&
          this.#maze[this.player.posY - 1][this.player.posX] == 1) ||
        this.#maze[this.player.posY - 1][this.player.posX] == "b" ||
        this.#maze[this.player.posY - 1][this.player.posX] == "arr"
      ) {
        if (this.#maze[this.player.posY - 1][this.player.posX] == "b") {
          this.player.setHealth(this.player.health - 3);
        } else {
          this.#maze[this.player.posY][this.player.posX] = 1;
          this.player.posY -= 1;
          this.#maze[this.player.posY][this.player.posX] = "p";
        }
      }

      // back
      if (
        (event.key.toLowerCase() == this.#CONTROL.bottom &&
          this.#maze[this.player.posY + 1][this.player.posX] == 1) ||
        this.#maze[this.player.posY + 1][this.player.posX] == "b" ||
        this.#maze[this.player.posY + 1][this.player.posX] == "arr"
      ) {
        if (this.#maze[this.player.posY + 1][this.player.posX] == "b") {
          this.player.setHealth(this.player.health - 3);
        } else {
          this.#maze[this.player.posY][this.player.posX] = 1;
          this.player.posY += 1;
          this.#maze[this.player.posY][this.player.posX] = "p";
        }
      }

      // left
      if (
        (event.key.toLowerCase() == this.#CONTROL.left &&
          this.#maze[this.player.posY][this.player.posX - 1] == 1) ||
        this.#maze[this.player.posY][this.player.posX - 1] == "b" ||
        this.#maze[this.player.posY][this.player.posX - 1] == "arr"
      ) {
        if (this.#maze[this.player.posY][this.player.posX - 1] == "b") {
          this.player.setHealth(this.player.health - 3);
        } else {
          this.#maze[this.player.posY][this.player.posX] = 1;
          this.player.posX -= 1;
          this.#maze[this.player.posY][this.player.posX] = "p";
        }
      }

      // right
      if (
        (event.key.toLowerCase() == this.#CONTROL.right &&
          this.#maze[this.player.posY][this.player.posX + 1] == 1) ||
        this.#maze[this.player.posY][this.player.posX + 1] == "b" ||
        this.#maze[this.player.posY][this.player.posX + 1] == "arr"
      ) {
        if (this.#maze[this.player.posY][this.player.posX + 1] == "b") {
          this.player.setHealth(this.player.health - 3);
        } else {
          this.#maze[this.player.posY][this.player.posX] = 1;
          this.player.posX += 1;
          this.#maze[this.player.posY][this.player.posX] = "p";
        }
      }

      // arrow up
      if (event.key == "ArrowUp") {
        this.coli = Engine.RayCast(
          this.#maze,
          { x: this.player.posX, y: this.player.posY },
          this.#width,
          Engine.RAYCAST.up
        );
        console.log(this.coli);
        this.#renderArrow(
          this.#maze,
          this.coli.size,
          this.arrow,
          "up",
          this.player
        );
      }

      // arrow down
      if (event.key == "ArrowDown") {
        this.coli = Engine.RayCast(
          this.#maze,
          { x: this.player.posX, y: this.player.posY },
          this.#width,
          Engine.RAYCAST.bottom
        );
        //console.log(this.coli);
        this.#renderArrow(
          this.#maze,
          this.coli.size,
          this.arrow,
          "down",
          this.player
        );
      }

      // arrow left
      if (event.key == "ArrowLeft") {
        this.coli = Engine.RayCast(
          this.#maze,
          { x: this.player.posX, y: this.player.posY },
          this.#width,
          Engine.RAYCAST.left
        );
        //console.log(this.coli);
        this.#renderArrow(
          this.#maze,
          this.coli.size,
          this.arrow,
          "left",
          this.player
        );
      }

      // arrow right
      if (event.key == "ArrowRight") {
        console.log("x:", this.player.posX, "y:", this.player.posY);
        this.coli = Engine.RayCast(
          this.#maze,
          { x: this.player.posX, y: this.player.posY },
          this.#width,
          Engine.RAYCAST.right
        );
        //console.log(this.coli);
        this.#renderArrow(
          this.#maze,
          this.coli.size,
          this.arrow,
          "right",
          this.player
        );
      }

      this.pushHealth(this.player.health);
    });

    this.StartBots();
    this.StartRender();
  }
})();
