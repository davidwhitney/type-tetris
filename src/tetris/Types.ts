export type ValidTetronimo = "I" | "J" | "L" | "S" | "T" | "Z" | "O" | "_" | "Empty";
export const ValidTetronimos: ValidTetronimo[] = [ "I", "J", "L",  "S",  "T",  "Z", "O" ];

export type Location = { x: number, y: number };

export type Mino = { x: number, y: number, relativeX?: number, relativeY?: number, shape: ValidTetronimo };
export type Move = { deltaX: number, deltaY: number, rotation: RotationOperation };
export type Cell = { x: number, y: number, occupied: boolean, origin: ValidTetronimo | null };

export enum RotationOperation { Left = -1, None = 0, Right = 1 };
export enum RotationState { L, O, R, TWO };

export interface IRotationSystem {
    rotate(direction: RotationOperation);
}