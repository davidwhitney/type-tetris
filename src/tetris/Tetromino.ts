import { Location, ValidTetronimo, Mino, Move } from './Types';
import { AllLayouts } from './TetrominoLayouts';
import { RotationState } from './RotationState';
import { RotationOperation } from './RotationOperation';

export type TetronimoLayout = { label: RotationState, layout: string[][] };

const valid: ValidTetronimo[] = ["I", "J", "L",  "S",  "T",  "Z", "O" ];

export class Tetromino 
{
    public shape: ValidTetronimo;
    public orientation: RotationState;
    public allLayouts: TetronimoLayout[];
    public layout: string[][];
    public locked: boolean;

    get height() { return this.layout.length }

    public location: Location;

    private constructor(shape: ValidTetronimo, allLayouts: TetronimoLayout[], defaultState: RotationState = RotationState.O) {
        this.shape = shape;
        this.allLayouts = allLayouts;
        this.orientation = defaultState;
        this.layout = this.layoutFor(defaultState);
        this.locked = false;
        this.location = { x: -1, y: -1 };
    }

    public rotate(direction: RotationOperation) {
        const rotationMap = [
            RotationState.O,
            RotationState.R,
            RotationState.TWO,
            RotationState.L,
        ];

        const currentIndex = rotationMap.indexOf(this.orientation);
        let nextState = currentIndex + direction;
        
        nextState = nextState >= rotationMap.length ? 0 : nextState;
        nextState = nextState < 0 ? rotationMap.length - 1 : nextState;
        this.orientation = rotationMap[nextState];

        this.layout = this.layoutFor(this.orientation);
    }

    public occupies(worldLocation: Location): boolean {      
      for (let mino of this.minos()) {
        if (mino.x === worldLocation.x && mino.y === worldLocation.y) {
            return true;
        } 
      }
      
      return false;
    }

    public minoFor(worldLocation: Location): Mino | null {  
      const allMinos = [...this.minos()];
      console.log(allMinos);
      const filtered = allMinos.filter(m => m.x === worldLocation.x && m.y === worldLocation.y);

      if (filtered.length > 0) {
        return filtered[0];
      }
      return null;
    }

    public *minos(): IterableIterator<Mino> {
      for (let minoY in this.layout) {
        const relativeY = parseInt(minoY);
        
        for (let minoX in this.layout) {
          const relativeX = parseInt(minoX);

          const cellValue = this.layout[relativeY][relativeX];
          if (cellValue === ' ') { 
            continue;
          }
          
          const x = this.location.x + relativeX;
          const y = this.location.y - relativeY;
          const shape = this.shape;
          
          yield { x, y, relativeX, relativeY, shape };
        }
      }
    }

    private layoutFor(state: RotationState) {        
        return this.allLayouts.filter(l => l.label == state)[0].layout;
    }

    public static create(shape: ValidTetronimo): Tetromino {
        return new Tetromino(shape, AllLayouts[shape]);
    }
    
    public static I(): Tetromino { return this.create("I") }
    public static J(): Tetromino { return this.create("J") }
    public static L(): Tetromino { return this.create("L") }
    public static S(): Tetromino { return this.create("S") }
    public static T(): Tetromino { return this.create("T") }
    public static Z(): Tetromino { return this.create("Z") }
    public static O(): Tetromino { return this.create("O") }
    public static Empty(): Tetromino { return this.create("Empty") }

    public static random(): Tetromino {
      let shuffled = valid
                    .map((a) => ({sort: Math.random(), value: a}))
                    .sort((a, b) => a.sort - b.sort)
                    .map((a) => a.value);
      
      return Tetromino.create(shuffled[0]);
    }
}