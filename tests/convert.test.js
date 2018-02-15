import {
    hashToAscii,
    splitAsciiChars,
    toMultipleOfTen,
    arrayToChunks,
    arrayNumsToSingleDigit,
    combineChunkArrayNumbers,
    checkForMatch,
    shuffleArray,
    isBinaryArray,
    hashToAsciiChars,
    getValidHashArray,
    findBinarySolution,
    convert,
    getNextHash,
    getNextNonce,
} from '../src/convert'

describe('convert', () => {
    let hash
    let originalHashArray

    const compareArrays = (a1, a2) => {
        a1.forEach((num, i) => {
            expect(num).toEqual(a2[i])
        })
    }

    beforeEach(() => {
        hash = 'text'
        originalHashArray = [1, 1, 6, 1, 0, 1, 1, 2, 0, 1, 1, 6]
    })

    describe('hashToAscii()', () => {
        let hashAscii

        beforeEach(() => {
            hashAscii = ['116', '101', '120', '116']
        })

        it('Returns an array of strings', () => {
            const asciiArray = hashToAscii(hash)

            asciiArray.forEach((num) => {
                expect(typeof num).toEqual('string')
            })
        })

        it('Should turn text to an array of ASCII codes', () => {
            compareArrays(hashToAscii(hash), hashAscii)
        })

        it('Should not convert numbers to ASCII codes', () => {
            hash = 'text1'
            hashAscii = [...hashAscii, '1']

            compareArrays(hashToAscii(hash), hashAscii)
        })
    })

    describe('splitAsciiChars()', () => {
        let asciiArray
        let splitArray

        beforeEach(() => {
            asciiArray = hashToAscii(hash)
            splitArray = splitAsciiChars(asciiArray)
        })

        it('Returns an array of strings', () => {
            splitArray.forEach((str) => {
                expect(typeof str).toEqual('string')
            })
        })

        it('Should contain numbers as strings', () => {
            splitArray.forEach((str) => {
                expect(isNaN(str)).toBe(false)
            })
        })

        it('Returns an array of single characters', () => {
            splitArray.forEach((str) => {
                expect(str.length).toEqual(1)
            })
        })

        it('Correctly splits an array of ASCII codes', () => {
            const answer = ['1', '1', '6', '1', '0', '1', '1', '2', '0', '1', '1', '6']
            compareArrays(splitArray, answer)
        })
    })

    describe('toMultipleOfTen()', () => {
        let array

        beforeEach(() => {
            array = ['0', '1', '2', '3']
        })

        it('Adds digits to an array until it is a multiple of 10', () => {
            expect(toMultipleOfTen(array).length % 10).toEqual(0)
        })

        it('Adds numbers 0 to 9 to the array', () => {
            const offset = array.length % 10
            const newArray = toMultipleOfTen(array)

            newArray.forEach((num, i) => {
                if (i < offset) return
                const j = (i - offset) + ''
                expect(num).toEqual(j)
            })
        })

        it('Returns the original array if it is already a multiple of 10', () => {
            array = Array.from({ length: 10 }, (_, i) => i.toString())
            expect(toMultipleOfTen(array)).toEqual(array)
        })
    })

    describe('arrayToChunks()', () => {
        let array

        beforeEach(() => {
            array = Array.from({length: 20}, (_, i) => i)
        })

        it('Makes two chunks of arrays with length 10 from an array of length 20', () => {
            expect(arrayToChunks(array).length).toEqual(2)
        })
    })

    describe('arrayNumsToSingleDigit()', () => {
        let array

        beforeEach(() => {
            array = ['10', '1', '20', '5']
        })

        it('Correctly transforms multi digits in an array to single digit numbers', () => {
            expect(!!arrayNumsToSingleDigit(array).find(num => num >= 10)).toBe(false)
        })

        it('Turns the digits to type number in the array', () => {
            expect(arrayNumsToSingleDigit(array).forEach((num) => {
                expect(typeof num).toEqual('number')
            }))
        })
    })

    describe('combineChunkArrayNumbers()', () => {
        const expectedArray = [2, 7, 6, 2, 2, 4, 5, 7, 6, 8]
        let array

        beforeEach(() => {
            array = [
                [1, 1, 6, 1, 0, 1, 1, 2, 0, 1],
                [1, 6, 0, 1, 2, 3, 4, 5, 6, 7],
            ]
        })

        it('Adds all numbers per index and performs modulus 10 on them', () => {
            expect(combineChunkArrayNumbers(array)).toEqual(expectedArray)
        })
    })

    describe('checkForMatch()', () => {
        let array

        beforeEach(() => {
            array = Array.from({ length: 20 }, (_, i) => i)
        })

        it('Returns false on empty array', () => {
            array = []
            expect(checkForMatch(array, 0, 0)).toBe(false)
        })

        it('Finds a matching number to equal 10', () => {
            expect(checkForMatch(array, array[1], 2)).toEqual(9)
        })

        it('Does not find a match for the number 5', () => {
            expect(checkForMatch(array, array[5], 6)).toBe(false)
        })
    })

    describe('shuffleArray()', () => {
        let array
        const expectedArray = [0, 1, 7, 1, 0, 5, 7, 6, 2, 2]

        beforeEach(() => {
            array = [2, 7, 6, 2, 2, 4, 5, 7, 6, 8]
        })

        it('Shuffles the array according to the algorithm', () => {
            expect(shuffleArray(array, 0)).toEqual(expectedArray)
        })
    })

    describe('isBinaryArray()', () => {
        let array

        it('Returns false if not all numbers in an array are 0 or 1', () => {
            array = [0, 1, 7, 1, 0, 5, 7, 6, 2, 2]
            expect(isBinaryArray(array)).toBe(false)
        })

        it('Returns true if all numbers in an array are 0 or 1', () => {
            array = [0, 1, 1, 1, 0, 0, 1, 1, 0, 0]
            expect(isBinaryArray(array)).toBe(true)
        })
    })

    describe('findBinarySolution()', () => {
        it('Returns the correct binary and nonce from hash "text"', () => {
            const { nonce, solution } = findBinarySolution(originalHashArray, -1)

            expect(nonce).toEqual(2067)
            expect(solution).toEqual('0111010011')
        })
    })

    describe('convert()', () => {
        it('Returns the correct binary and nonce from hash "text"', () => {
            const { nonce, solution } = convert(hash)

            expect(nonce).toEqual(2067)
            expect(solution).toEqual('0111010011')
        })
    })

    describe('getNextHash()', () => {
        it('Adds nonce number to hash string', () => {
            const nonce = 2067
            const nextHash = [1, 1, 6, 1, 0, 1, 1, 2, 0, 1, 1, 6, 2, 0, 6, 7];
            expect(getNextHash(originalHashArray, nonce)).toEqual(nextHash)
        })
    })

    describe('getNextNonce()', () => {
        it('Adds up nonce number by one', () => {
            const nonce = 0
            expect(getNextNonce(nonce)).toEqual(1)
        })
    })

    describe('hashToAsciiChars()', () => {
        it('Returns the correct ascii chars in an array from a string', () => {
            const expectedValue = originalHashArray.map(n => n.toString())
            expect(hashToAsciiChars(hash)).toEqual(expectedValue)
        })
    })

    describe('getValidHashArray()', () => {
        it('Returns a valid hash array', () => {
            const asciiArray = originalHashArray.map(n => n.toString())
            expect(getValidHashArray(asciiArray)).toEqual([2, 7, 6, 2, 2, 4, 5, 7, 6, 8])
        })
    })
})
