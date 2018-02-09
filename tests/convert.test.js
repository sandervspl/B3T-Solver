import {
    hashToAscii,
    splitAsciiChars,
} from '../src/convert';

describe('convert', () => {
    let hash = 'text';
    let nonce = 2067;

    describe('hashToAscii()', () => {
        let hashAscii;

        beforeEach(() => {
            hashAscii = ['116', '101', '120', '116'];
        });

        const compareArrays = (a1, a2) => {
            a1.forEach((num, i) => {
                expect(num).toEqual(a2[i]);
            });
        };

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
    });
});
