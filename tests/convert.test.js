import {
    hashToAscii,
    splitAsciiChars,
    toMultipleOfTen,
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
});
