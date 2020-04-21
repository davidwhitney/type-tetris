import { Location, ValidTetronimo, ValidTetronimos, Mino, Move, RotationOperation, RotationState } from './Types';
import { AllLayouts } from './TetrominoLayouts';

type TetronimoLayout = { label: RotationState, layout: string[][] };

export class Tetromino {
  
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

    public setOrientation(state: RotationState): Tetromino {      
      this.orientation = state;
      this.layout = this.layoutFor(state);
      return this;
    }

    public rotate(direction: RotationOperation): Tetromino {
        const clockwiseRotationMap = [
            RotationState.O,
            RotationState.R,
            RotationState.TWO,
            RotationState.L,
        ];

        const currentIndex = clockwiseRotationMap.indexOf(this.orientation);
      
        let nextState = currentIndex + direction;        
        nextState = nextState >= clockwiseRotationMap.length ? 0 : nextState;
        nextState = nextState < 0 ? clockwiseRotationMap.length - 1 : nextState;
        
        const nextOrientation = clockwiseRotationMap[nextState];
        this.setOrientation(nextOrientation);
        return this;
    }
    
    public previewRotation(direction: RotationOperation): Tetromino {
      return this.clone().rotate(direction); // ☜(ﾟヮﾟ☜) YOLO
    }

    public occupies(worldLocation: Location): boolean {
      const all = [...this.minos()];
      const thatMatch = all.filter(m => m.x === worldLocation.x && m.y === worldLocation.y);
      return thatMatch.length > 0;
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

    public clone() {
      const clone = new Tetromino(this.shape, this.allLayouts, this.orientation);
      clone.location.x = this.location.x;
      clone.location.y = this.location.y;
      return clone;
    }

    public static create(shape: ValidTetronimo): Tetromino {
        return new Tetromino(shape, AllLayouts[shape]);
    }

    public static Empty(): Tetromino { return this.create("Empty") }

    public static random(): Tetromino {
      let shuffled = ValidTetronimos
                    .map((a) => ({sort: Math.random(), value: a}))
                    .sort((a, b) => a.sort - b.sort)
                    .map((a) => a.value);
      
      return Tetromino.create(shuffled[0]);
    }
}