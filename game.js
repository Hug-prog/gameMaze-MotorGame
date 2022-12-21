
import Engine from "./Engine.js";
import Player from "./Player.js"
import Bots from "./Bot.js";
import entity from "./Entity.js";


const sleep = (ms) =>  new Promise(resolve => setTimeout(resolve, ms));

export default new class Party
{
    #render  = false
    #bot_run = false
    #bots    = []

    #frame_rate = (50000/1000)
    #frame_bot_rate = (100000/1000)

    #CONTROL = {
      up: "z",
      left: "q",
      right: "d",
      bottom: "s",

      attack : 
      {
          up     :  "ArrowUp",
          right  :  "ArrowRight",
          bottom :  "ArrowDown",
          left   :  "ArrowLeft"

      }


    };
    


    #maze = new Array()
    #end_game = {}

    #width  = 0;
    #height = 0


    SetFrameRate(fps)
    {
        this.#frame_rate = (fps/1000)
    }

    GetFrameRate()
    {
        return this.#frame_rate;
    }

    GetWidth()
    {
        return this.#width
    }

    GetHeight()
    {
        return this.#height
    }


    SetMaze(matrice)
    {
        this.#maze = matrice

        return this;
    }

    GetEndGame()
    {
      return this.#end_game
    }

    GetMaze()
    {
        return this.#maze
    }

    #Draw()
    {
        this.#maze.forEach(vh =>
            {
                var ligne = "<tr>";
          
                vh.forEach(vw =>
                {
                    if (vw == 1) {
                        ligne += "<td></td>";
                      } else if (vw == "p") {
                        ligne += '<td bgcolor="orange" alt=""></td>';
                      } else if (vw == "b") {
                        ligne += '<td bgcolor="red" alt=""></td>';
                      } else {
                        ligne += '<td bgcolor="black" alt=""></td>';
                      }
                })
          
                document
                .getElementById("monLabyrinthe")
                .insertAdjacentHTML("beforeEnd", ligne);
        })
    }

    #Clear()
    {
        Object.values(document.getElementById("monLabyrinthe").getElementsByTagName("tr")).forEach(v=>v.remove())
    }

    #Render()
    {
        return (async ()=> {
            do
            {
                this.#Draw();
                await sleep(this.#frame_rate)
                this.#Clear()

                Engine.check_collider_2D(this.#maze,Player)


            }  while(this.#render);

            this.#Draw();

            
          })()
         
    }

    StartRender()
    {
      if(this.#maze.length==0)
            return 0

       this.#render = true

       this.#Render();

       return this;

    }

    StopRender()
    {
       this.#render = false

       return this;
    }

    BuildRandomMaze(w,h)
    {
        this.#width = w;
        this.#height = h

        const _m = {};
        _m.matrice  = new Array

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
            if (iw > 0 && ih > 0 && iw < _m.matrice[0].length - 2 && ih < _m.matrice.length - 2) {
              // Verifie si c'est de "2 en 2"
              if (ih % 2 || iw % 2) {
                // Si c'est la cas alors c'est un carré blanc (vide)
                _m.matrice[ih][iw] = 1;
              }
            }
      
            // Pour eliminer la surcouche des bord
            if (iw == _m.matrice[0].length - 1 || ih == _m.matrice.length - 1) _m.matrice[ih][iw] = 1;
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
            if (iw > 0 && ih > 0 && iw < (_m.matrice[0].length - 2) && ih < (_m.matrice.length - 2)) {

                if(ih >= Player.Y && iw >= Player.X && !Player.Spawned  && ((ih % 2) && (iw % 2)))
                {
                    Player.Y = ih
                    Player.X = iw
                    _m.matrice[ih][iw] = "p"
                    Player.Spawned = true
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

        for(let ih in _m.matrice)
        {
          for(let iw in  _m.matrice[ih])
          {
            if(!this.#end_game.spawned && iw == (_m.matrice[0].length - 2) && ih < (_m.matrice.length - 2) && ih > 0 )
            {
              window.ENGINE = Engine
              if(Engine.RayCast(_m.matrice,{x:iw-1,y:ih},4,Engine.RAYCAST.left).col == false)
              {
                _m.matrice[ih][iw] = "b" 
                this.#end_game.spawned = true
                this.#end_game.position = {x:parseInt(iw),y:parseInt(ih)}
              }
            }
          }
        }

        this.#maze = _m.matrice

        console.log(" this.#maze = ",this.#maze)
      
        return _m;

    }

    #RunBots()
    {

      return (async ()=> {
        let direction = ["up", "down", "left", "right"];
        do
        {
          
            for(let bot of Bots.bots)
            { 
              Engine.check_collider_2D(this.#maze,bot)
              bot.attack = RandomNumber(10,50)
            }

            await sleep(this.#frame_bot_rate)
            


        }  while(this.#bot_run);

        this.#Draw();

        
      })()
     
    }

    StartBots()
    {
      this.#bot_run = true
      this.#RunBots();

    }

    StopBots()
    {
      this.#bot_run = false
    }

    SpawnBot(n=null)
    {
        if(this.#maze.length==0)
            return 0
        
        if(n!=null)
          Bots.NumberOfBots = n
          
        else
          n = Bots.NumberOfBots


        for(let x = 0;x <= Bots.NumberOfBots;x++)
        {
           let TempBotPos = {x: RandomNumber(1,this.#width-2), y: RandomNumber(1,this.#height-2)}
           
           console.log(" TempBotPos = ",TempBotPos)

          this.#maze.forEach((_eh, ih) => {
            // Parcour les ligne
            _eh.forEach((_ew, iw) => {
              // Check si il est plus grand que 0  et plus petit que la taille de la matrice (pour les bord)
              if (iw > 0 && ih > 0 && iw < this.#maze[0].length - 2 && ih < this.#maze.length - 2) {

                if(TempBotPos==null)
                    return
                // Verifie si c'est de "2 en 2"
                if (_ew == 1 && (ih >= TempBotPos.y && iw >= TempBotPos.x)) {

                      TempBotPos.x = iw;
                      TempBotPos.y = ih;

                      Bots.bots.push(new Bots(null,x,"Bob",100,-10,TempBotPos.x,TempBotPos.y))
                      Engine.GameEntity.push(Bots.bots[Bots.bots.length-1])
                  // Si c'est la cas alors c'est un carré blanc (vide)
                      this.#maze[ih][iw] = "b";
                      TempBotPos = null
                }
              }
    
            });
          });
        }

        return this
    }

    #FireLaser(direction)
    {
 
      let NextCol = null;

      if(direction == Engine.RAYCAST.up)
      {
          NextCol = Engine.RayCast(this.#maze,{x:Player.X,y:Player.Y},Engine.RAYCAST.INF,Engine.RAYCAST.up)
    
          for(let x=1; x < NextCol.size;x++)
          {
            this.#maze[Player.Y-x][Player.X] ="b"
          }
    }

      console.log(NextCol)
    }

    RunGame()
    {

      if(this.#maze.length==0)
            return 0
        
      console.log("BOTS = ",this.SpawnBot())
      document.addEventListener("keydown", event => {

         
      console.log("event = ",event)
       
        if (event.key.toLowerCase() == this.#CONTROL.up && this.#maze[Player.Y - 1][Player.X] == 1) {
            this.#maze[Player.Y][Player.X] = 1;
            Player.Y -= 1
            this.#maze[Player.Y][Player.X] = "p";
        }
    
        // back
        if (event.key.toLowerCase() == this.#CONTROL.bottom && this.#maze[Player.Y + 1][Player.X] == 1) {
          this.#maze[Player.Y][Player.X] = 1;
          Player.Y += +1
            this.#maze[Player.Y][Player.X] = "p";
        }
    
        // left
        if (event.key.toLowerCase() == this.#CONTROL.left && this.#maze[Player.Y][Player.X  - 1] == 1) {
          this.#maze[Player.Y][Player.X] = 1;
          Player.X -= 1
            this.#maze[Player.Y][Player.X] = "p";
        }
    
        // right
        if (event.key.toLowerCase() == this.#CONTROL.right && this.#maze[Player.Y][Player.X + 1] == 1) {
          this.#maze[Player.Y][Player.X] = 1;
          Player.X += 1
          this.#maze[Player.Y][Player.X] = "p";
        }

        if (event.key == this.#CONTROL.attack.right)
                    this.#FireLaser(Engine.RAYCAST.up)
                    


      });

      this.StartBots();
      this.StartRender();
    }
}

