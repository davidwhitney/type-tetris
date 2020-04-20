import { Location, ValidTetronimo, Move, Mino, Cell, RotationOperation, IRotationSystem } from './Types';
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

  constructor(playerId: string, width: number = 10, height: number = 22) {
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

  public canMove(move: Move): MoveResult {
    for (const mino of this.tetromino.minos()) {

      const nextX = mino.x + move.deltaX;
      const nextY = mino.y + move.deltaY;

      if (nextY <= 0) { 
        return { canMove: false, lock: true }; 
      }
      
      if (nextX < 0 || nextX >= this.width) {
        return { canMove: false, lock: false };
      }

      const wouldCollideWithOccupied = this.occupiedLocations.filter(loc => loc.x == nextX && loc.y == nextY).length;
      if (wouldCollideWithOccupied) {
        return { canMove: false, lock: true };
      }

    }
    return { canMove: true, lock: false };
  }
  
  public rotate(direction: RotationOperation) {
    this.rotationSystem.rotate(direction);
  }

  public lockTetromino(): void {
    for (const mino of this.tetromino.minos()) {
      this.occupiedLocations.push(mino);
    }   
  }

  public *cells(): IterableIterator<Cell> {
    for (let row of this.rows()) {
      for (let cell of row) {
        yield cell;
      }    
    }
  }

  public *rows(onlyLocked: boolean = false): IterableIterator<Row> {    
    for (let yLoop = 0; yLoop < this.height; yLoop++) {
      const y: number = this.height - yLoop;
      
      const row: Row = [];
      
      for (let x = 0; x < this.width; x++) {
        let anyMinos: Mino[] = this.occupiedLocations.filter(l => l.x === x && l.y === y);
        let occupied: boolean = anyMinos.length > 0;
        let origin = occupied ? anyMinos[0].shape : null;        
  
        if (!onlyLocked) {
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
    let completedRows: Row[] = [];

    for (let row of this.rows(true)) {
      if(row.every(cell => cell.occupied)) {
        completedRows.push(row);
      }
    }

    completedRows = completedRows.reverse(); // Bottom first thanks!

    for (let row of completedRows) {
      const y = row[0].y;
      const rowAbove = y + 1;

      this.occupiedLocations = this.occupiedLocations.filter(cell => cell.y != y);
      this.occupiedLocations = this.occupiedLocations.map(cell => {
        if (cell.y == rowAbove) {
          cell.y = y;
        }
        return cell;
      });
    }
    
    switch(completedRows.length) {
      case 1: this.score += 40;
      case 2: this.score += 100;
      case 3: this.score += 300;
      case 4: this.score += 1200;
      default: this.score += 0;
    }

    console.log("Current score", this.score);
  }  
    
}