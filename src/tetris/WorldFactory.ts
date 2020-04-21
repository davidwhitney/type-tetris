
import { ValidTetronimo, ValidTetronimos, Location, Mino } from './Types';
import { World } from "./World";
import { Tetromino } from './Tetromino';

export class WorldFactory {  

    public static fromState(worldLayout: string[], activeTetronimoTopLeft?: Location, shape?: ValidTetronimo): World {
      worldLayout = worldLayout.reverse();
      var width = worldLayout[0].length;
      var height = worldLayout.length;
  
      var world = new World("player1", width, height);
  
      for (const _y in worldLayout) {
        const y = parseInt(_y);  
        const line = worldLayout[y]
        const cells = line.split('');
        
        for (const _x in cells) {  
          const x = parseInt(_x);          
          const cell: string = cells[x];

          if (cell != ' ' && ValidTetronimos.indexOf(cell as any) != -1) {
            const mino: Mino = {x, y, shape: cell as any as ValidTetronimo };
            world.occupiedLocations.push(mino);
          }
        }
      }

      if (activeTetronimoTopLeft) {       
        const type = shape || "_";
        world.tetromino = Tetromino.create(type);
        world.tetromino.location.x = activeTetronimoTopLeft.x;
        world.tetromino.location.y = activeTetronimoTopLeft.y;
      }
  
      return world;
    }    
}