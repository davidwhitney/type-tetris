import { Move, Mino, Cell, RotationOperation, IRotationSystem } from './Types';
import { SuperRotationSystem } from './SuperRotationSystem';
import { Tetromino } from "./Tetromino";

type Row = Cell[];
type MoveResult = { canMove: boolean, lock: boolean };

export class World {

  public playerId: string;
  public width: number;
  public height: number;

  public occupiedLocations: Mino[];
  public tetromino: Tetromino;

  public rotationSystem: IRotationSystem;
  public gameOver: boolean = false;
  public score: number = 0;

  public constructor(playerId: string, width: number = 10, height: number = 22) {
    this.rotationSystem = new SuperRotationSystem(this);
    this.playerId = playerId;
    this.width = width;
    this.height = height;
    this.occupiedLocations = [];
    this.tetromino = Tetromino.Empty();
  }

  public tick(): void {
    if (this.gameOver) {
      return;
    }
    
    if (this.tetromino.shape === "Empty") {
      this.spawnNewPiece();      
      this.checkForGameOver();   
    }
        
    this.move({ deltaX: 0, deltaY: -1, rotation: RotationOperation.None });
    this.lineClear();
  }

  public move(move: Move) {

    if (move.rotation != RotationOperation.None) {      
      this.rotationSystem.rotate(move.rotation);
    }

    const moveCheck = this.canMove(move);
    
    if (moveCheck.canMove) {      
      this.tetromino.location.x = this.tetromino.location.x + move.deltaX;
      this.tetromino.location.y = this.tetromino.location.y + move.deltaY;
    } 
    
    if (moveCheck.lock) {
      this.lockTetromino();
      this.tetromino = Tetromino.Empty();
    }
  }

  private canMove(move: Move): MoveResult {
    for (const mino of this.tetromino.minos()) {

      const nextX = mino.x + move.deltaX;
      const nextY = mino.y + move.deltaY;

      if (nextY < 0) { 
        return { canMove: false, lock: true }; 
      }
      
      if (nextX < 0 || nextX >= this.width) {
        return { canMove: false, lock: false };
      }
      
      const wouldCollide = this.occupiedLocations.filter(loc => loc.x == nextX && loc.y == nextY).length;

      if (wouldCollide && move.deltaY != 0) {
        return { canMove: false, lock: true };
      }

      if (wouldCollide && move.deltaX != 0) {
          return { canMove: false, lock: false };
      }

    }
    return { canMove: true, lock: false };
  }
  
  private lockTetromino(): void {
    for (const mino of this.tetromino.minos()) {
      this.occupiedLocations.push(mino);
    }   
  }
  
  private spawnNewPiece() {
    this.tetromino = Tetromino.random();
    this.tetromino.location = { x: 3, y: this.height + 2 }; 
  }

  private checkForGameOver(){
    const gameOverCheck = this.canMove({ deltaX: 0, deltaY: -1, rotation: RotationOperation.None });
      
    if (!gameOverCheck.canMove) {
      console.log("❌ Game over! " + this.score);
      this.gameOver = true;
    } 
  }

  private lineClear() {    
    const allRows = [...this.rows(false)];
        
    const clearedRows: number[] = [];
    for (var row of allRows) {
      const rowY = row[0].y;
      
      if (row.every(cell => cell.occupied)) {
        this.occupiedLocations = this.occupiedLocations.filter(cell => cell.y != rowY);
        clearedRows.push(rowY);
      }      
    }
     
    for (const rowNumber of clearedRows) {  // Shift all rows down      
      this.occupiedLocations = this.occupiedLocations.map(cell => {
        cell.y = cell.y > rowNumber ? cell.y - 1: cell.y;
        return cell;
      });
    }   
    
    switch (clearedRows.length) {
      case 1: this.score += 40;
      case 2: this.score += 100;
      case 3: this.score += 300;
      case 4: this.score += 1200;
      default: this.score += 0;
    }
  }

  public *cells(): IterableIterator<Cell> {
    for (let row of this.rows()) {
      for (let cell of row) {
        yield cell;
      }    
    }
  }

  public *rows(includeActiveTetromino: boolean = true): IterableIterator<Row> {    
    for (let yLoop = 0; yLoop < this.height; yLoop++) {
      const y: number = (this.height -1 ) - yLoop;    
      const row: Row = [];
      
      for (let x = 0; x < this.width; x++) {
        let anyMinos: Mino[] = this.occupiedLocations.filter(l => l.x === x && l.y === y);        
        let occupied: boolean = anyMinos.length > 0;
        let origin = occupied ? anyMinos[0].shape : null;        
  
        if (includeActiveTetromino) {
          if (this.tetromino != null && this.tetromino.occupies({ x, y })) {
            occupied = true;
            origin = this.tetromino.shape;
          }
        }
        
        row.push({ x, y, occupied, origin }); 
      }    
      
      yield row;
    }
  }  
  
  public toStringArray(includeActiveTetromino: boolean = false): string[] {
    const lines: string[] = [];
    for (const row of this.rows(includeActiveTetromino)) {
      var line = "";
      for (const cell of row) {
        if(cell.occupied) {
          line += cell.origin;
        } else {
          line += " ";
        }
      }
      lines.push(line);
    }
    return lines;
  }    
}

