import {
    hashToAscii,
    splitAsciiChars,
    toMultipleOfTen,
    arrayToChunks,
    arrayNumsToSingleDigit,
    fixArray,
    checkForMatch,
    shuffleArray,
    isBinaryArray,
    getSolutionFromHash,
    findBinarySolution,
    convert,
    getNextHash,
    getNextNonce,
} from '../src/convert';

describe('convert', () => {
    let hash;

    const compareArrays = (a1, a2) => {
        a1.forEach((num, i) => {
            expect(num).toEqual(a2[i]);
        });
    };

    beforeEach(() => {
        hash = 'text';
    });

    describe('hashToAscii()', () => {
        let hashAscii;

        beforeEach(() => {
            hashAscii = ['116', '101', '120', '116'];
        });

        it('Returns an array of strings', () => {
            const asciiArray = hashToAscii(hash);

            asciiArray.forEach((num) => {
                expect(typeof num === 'string').toBe(true);
            });
        });

        it('Should turn text to an array of ASCII codes', () => {
            compareArrays(hashToAscii(hash), hashAscii);
        });

        it('Should not convert numbers to ASCII codes', () => {
            hash = 'text1';
            hashAscii = [...hashAscii, '1'];

            compareArrays(hashToAscii(hash), hashAscii);
        });
    });

    describe('splitAsciiChars()', () => {
        let asciiArray;
        let splitArray;

        beforeEach(() => {
            asciiArray = hashToAscii(hash);
            splitArray = splitAsciiChars(asciiArray);
        });

        it('Returns an array of strings', () => {
            splitArray.forEach((str) => {
                expect(typeof str === 'string').toBe(true);
            });
        });

        it('Should contain numbers as strings', () => {
            splitArray.forEach((str) => {
                expect(isNaN(str)).toBe(false);
            });
        });

        it('Returns an array of single characters', () => {
            splitArray.forEach((str) => {
                expect(str.length).toEqual(1);
            });
        });

        it('Correctly splits an array of ASCII codes', () => {
            const answer = ['1', '1', '6', '1', '0', '1', '1', '2', '0', '1', '1', '6'];
            compareArrays(splitArray, answer);
        });
    });

    describe('toMultipleOfTen()', () => {
        let array;

        beforeEach(() => {
            array = ['0', '1', '2', '3'];
        });

        it('Adds digits to an array until it is a multiple of ten', () => {
            expect(toMultipleOfTen(array).length % 10).toEqual(0);
        });

        it('Adds numbers 0 to 9 to the array', () => {
            const offset = array.length % 10;
            const newArray = toMultipleOfTen(array);

            newArray.forEach((num, i) => {
                if (i < offset) return;
                const j = (i - offset) + '';
                expect(num).toEqual(j);
            });
        });
    });

    describe('arrayToChunks()', () => {
        let array;

        beforeEach(() => {
            array = Array.from({length: 20}, (_, i) => i);
        });

        it('Makes two chunks of 10 arrays from an array of length 20', () => {
            expect(arrayToChunks(array).length).toEqual(2);
        });
    });

    describe('arrayNumsToSingleDigit()', () => {
        let array;

        beforeEach(() => {
            array = ['10', '1', '20', '5'];
        });

        it('Correctly transforms non-single digits in an array to single digit numbers', () => {
            expect(!!arrayNumsToSingleDigit(array).find(num => num >= 10)).toBe(false);
        });

        it('Turns the digits to numbers in the array', () => {
            expect(arrayNumsToSingleDigit(array).forEach((num) => {
                expect(typeof num === 'number').toBe(true);
            }))
        });
    });

    describe('fixArray()', () => {
        const expectedArray = [2, 7, 6, 2, 2, 4, 5, 7, 6, 8];
        let array;

        beforeEach(() => {
            array = [
                [1, 1, 6, 1, 0, 1, 1, 2, 0, 1],
                [1, 6, 0, 1, 2, 3, 4, 5, 6, 7],
            ];
        });

        it('Adds all numbers per index and performs modules 10 on them', () => {
            expect(fixArray(array)).toEqual(expectedArray);
        });
    });

    describe('checkForMatch()', () => {
        let array;

        beforeEach(() => {
            array = Array.from({ length: 20 }, (_, i) => i);
        });

        it('Returns false on empty array', () => {
            array = [];
            expect(checkForMatch(array, 0, 0)).toBe(false);
        });

        it('Finds the correct match for number 1 to equal 10', () => {
            expect(checkForMatch(array, array[1], 2)).toEqual(9);
        });

        it('Does not find a match for the number 5', () => {
            expect(checkForMatch(array, array[5], 6)).toBe(false);
        });
    });

    describe('shuffleArray()', () => {
        let array;
        const expectedArray = [0, 1, 7, 1, 0, 5, 7, 6, 2, 2];

        beforeEach(() => {
            array = [2, 7, 6, 2, 2, 4, 5, 7, 6, 8];
        });

        it('Correctly shuffles the array for hash "text"', () => {
            expect(shuffleArray(array, 0)).toEqual(expectedArray);
        });
    });

    describe('isBinaryArray()', () => {
        let array;

        it('Returns false if not all numbers in an array are 0 or 1', () => {
            array = [0, 1, 7, 1, 0, 5, 7, 6, 2, 2];
            expect(isBinaryArray(array)).toBe(false);
        });

        it('Returns true if all numbers in an array are 0 or 1', () => {
            array = [0, 1, 1, 1, 0, 0, 1, 1, 0, 0];
            expect(isBinaryArray(array)).toBe(true);
        });
    });

    describe('getSolutionFromHash()', () => {
        it('Returns the correct array from hash "text"', () => {
            const expectedArray = [0, 1, 7, 1, 0, 5, 7, 6, 2, 2];
            expect(getSolutionFromHash(hash)).toEqual(expectedArray);
        });
    });

    describe('findBinarySolution()', () => {
        it('Returns the correct binary and nonce from hash "text"', () => {
            const { nonce, solution } = findBinarySolution(hash, -1, hash);

            expect(nonce).toEqual(2067);
            expect(solution).toEqual('0111010011');
        });
    });

    describe('convert()', () => {
        it('Returns the correct binary and nonce from hash "text"', () => {
            const { nonce, solution } = convert(hash);

            expect(nonce).toEqual(2067);
            expect(solution).toEqual('0111010011');
        });
    });

    describe('getNextHash()', () => {
        it('Adds nonce number to hash string', () => {
            const nonce = 2067;
            expect(getNextHash(hash, nonce)).toEqual('text2067');
        });
    });

    describe('getNextNonce()', () => {
        it('Adds up nonce by one', () => {
            const nonce = 0;
            expect(getNextNonce(nonce)).toEqual(1);
        });
    });
});
