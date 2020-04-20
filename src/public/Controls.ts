import { Move, RotationOperation } from "../tetris/Types";
import { Tetris } from "../tetris/Tetris";

export class Controls {
  
  public game: Tetris;
  
  public constructor(game: Tetris) {
    this.game = game;
  }
  
  public processInput(keyPressed: any) {
    const key = keyPressed.key.toLowerCase();
    const movement = toMove(key);
    
    if (movement.rotation != RotationOperation.None) {      
      this.game.world.rotate(movement.rotation);
    } else {    
      this.game.world.move(movement);
    }
  }

  
  public connect() {
    window.addEventListener("keypress", (args) => {
      this.processInput(args);
    }, false);
  }
}


const toMove = (key: string): Move => {
  switch(key) {
    case "a": return { deltaX: -1, deltaY: 0, rotation: RotationOperation.None };
    case "s": return { deltaX: 0, deltaY: -1, rotation: RotationOperation.None };
    case "d": return { deltaX: 1, deltaY: 0, rotation: RotationOperation.None };
    case "q": return { deltaX: 0, deltaY: 0, rotation: RotationOperation.Left };
    case "w": return { deltaX: 0, deltaY: 0, rotation: RotationOperation.Right };
    case "e": return { deltaX: 0, deltaY: 0, rotation: RotationOperation.Right };
    default: return { deltaX: 0, deltaY: 0, rotation: RotationOperation.None };
  }    
}