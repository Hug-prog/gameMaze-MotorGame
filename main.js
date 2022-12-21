import Party from "./game.js";
import Engine from "./Engine.js";

console.log(Party.BuildRandomMaze(35, 20));

Party.RunGame();

window.PARTY = Party;
