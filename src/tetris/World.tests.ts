import { Location, RotationOperation } from './Types';
import { WorldFactory } from './WorldFactory';

describe("World", () => {

    describe("Tick", () => {

        describe("clears completed rows", () => {

            it("Moves active tetromino down one row", () => {
                const sut = WorldFactory.fromState([
                    "   ss     ",
                    "  ss      ",
                    "          ",
                ], { x: 2, y: 2}, "S");
    
                sut.tick();
    
                expect(sut.toStringArray(true)).toStrictEqual([                   
                    "          ",
                    "   SS     ",
                    "  SS      ",
                ]);
            });      

            it("when there is a single complete row", () => {
                const sut = WorldFactory.fromState([
                    "     ",
                    "IIIII"
                ]);

                sut.tick();

                expect(sut.toStringArray()).toStrictEqual([
                    "     ",
                    "     "
                ]);

            });

            it("when there are multiple complete rows", () => {
                const sut = WorldFactory.fromState([
                    "     ",
                    "IIIII",
                    "IIIII"
                ]);

                sut.tick();

                expect(sut.toStringArray()).toStrictEqual([
                    "     ",
                    "     ",
                    "     "
                ]);
            });
        });

        describe("applies gravity to rows after clearing them", () => {

            it("contents fall downwards when clearing single row", () => {
                const sut = WorldFactory.fromState([
                    "S   ",
                    "IIII"
                ]);

                sut.tick();

                expect(sut.toStringArray()).toStrictEqual([
                    "    ",
                    "S   "
                ]);
            });

            it("contents fall downwards when clearing multiple rows", () => {
                const sut = WorldFactory.fromState([
                    "S   ",
                    "IIII",
                    "IIII"
                ]);
        
                sut.tick();
        
                expect(sut.toStringArray()).toStrictEqual([
                    "    ",
                    "    ",
                    "S   ",
                ]);
            });

            it("multiple rows of contents fall downwards when clearing multiple rows", () => {
                const sut = WorldFactory.fromState([
                    "S   ",
                    "S   ",
                    "IIII",
                    "IIII"
                ]);
        
                sut.tick();
        
                expect(sut.toStringArray()).toStrictEqual([
                    "    ",
                    "    ",
                    "S   ",
                    "S   ",
                ]);
            });
        });

    });

    describe("Move", () => {

        it("Can move horizontally", () => {
            const sut = WorldFactory.fromState([
                "   ss     ",
                "IIss      ",
            ], { x: 2, y: 1}, "S");

            sut.move({ deltaX: 1, deltaY: 0, rotation: RotationOperation.None });

            expect(sut.toStringArray(true)).toStrictEqual([
                "    SS    ",
                "II SS     ",
            ]);
        });        

        it("Won't let a tetromino move through a neighbour horizontally", () => {
            const sut = WorldFactory.fromState([
                "   ss     ",
                "IIss      ",
            ], { x: 2, y: 1}, "S");

            sut.move({ deltaX: -1, deltaY: 0, rotation: RotationOperation.None });

            expect(sut.toStringArray(true)).toStrictEqual([
                "   SS     ",
                "IISS      ",
            ]);
        });

        it("Won't let a tetromino move through the left wall", () => {
            const sut = WorldFactory.fromState([
                " ss     ",
                "ss      ",
            ], { x: 0, y: 1}, "S");

            sut.move({ deltaX: -1, deltaY: 0, rotation: RotationOperation.None });

            expect(sut.toStringArray(true)).toStrictEqual([
                " SS     ",
                "SS      ",
            ]);
        });

        it("Won't let a tetromino move through the right wall", () => {
            const sut = WorldFactory.fromState([
                "  ss",
                " ss ",
            ], { x: 1, y: 1}, "S");

            sut.move({ deltaX: 1, deltaY: 0, rotation: RotationOperation.None });

            expect(sut.toStringArray(true)).toStrictEqual([
                "  SS",
                " SS ",
            ]);
        });

        it("Won't let a tetromino move through the floor", () => {
            const sut = WorldFactory.fromState([
                " ss",
                "ss ",
            ], { x: 0, y: 1}, "S");

            sut.move({ deltaX: 0, deltaY: -1, rotation: RotationOperation.None });
            
            expect(sut.toStringArray(true)).toStrictEqual([
                " SS",
                "SS ",
            ]);
        });

        it("Won't let a tetromino move through a piece underneath it", () => {
            const sut = WorldFactory.fromState([
                " ss",
                "ss ",
                "III",
            ], { x: 0, y: 2}, "S");

            sut.move({ deltaX: 0, deltaY: -1, rotation: RotationOperation.None });

            expect(sut.toStringArray(true)).toStrictEqual([
                " SS",
                "SS ",
                "III",
            ]);
        });
        
        it("Supports rotation", () => {
            const sut = WorldFactory.fromState([
                " ss",
                "ss ",
                "   ",
            ], { x: 0, y: 1}, "S");

            sut.move({ deltaX: 0, deltaY: 0, rotation: RotationOperation.Right });

            expect(sut.toStringArray(true)).toStrictEqual([
                'S  ', 
                'SS ', 
                ' S ' 
            ]);
        });
    });
});