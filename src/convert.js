import _ from 'lodash'
import moment from 'moment'
import { createHash } from './helpers'

export const getNextNonce = (nonce) => {
    return nonce + 1
}

export const getNextHash = (originalHash, nonce) => {
    const splitNonce = nonce
        .toString()
        .split('')
        .map(n => Number(n))

    return [...originalHash, ...splitNonce]
}

export const hashToAscii = (hash) => {
    return hash
        .replace(/\s+/g, '')
        .split('')
        .map(char => isNaN(char) ? char.charCodeAt(0).toString() : char)
}

export const splitAsciiChars = (ascii) => {
    return _.flatten(ascii.map(char => char.split('')))
}

export const toMultipleOfTen = (array) => {
    if (array.length % 10 !== 0) {
        const diff = 10 - array.length % 10
        const filler = Array.from({ length: diff }, (_, i) => i.toString())

        return [...array, ...filler]
    }

    return array
}

export const arrayToChunks = (array) => {
    return _.chunk(array, 10)
}

export const arrayNumsToSingleDigit = (array) => {
    return array.map((num) => num % 10)
}

/*
 * arrayChunks = [ [0,1,2], [3,4,5] ]
 *
 * first run example
 * res = []
 * array = [0,1,2]
 *
 * second run example
 * res = [0,1,2]
 * array = [3,4,5]
 *
 * singleArray = [3,5,7]
 */
export const combineChunkArrayNumbers = (arrayChunks) => {
    // add up all numbers in array from same index
    const singleArray = arrayChunks.reduce((res, array) => {
        return array.map((num, i) => {
            // if result array index is empty, just add number from array to this index
            if (!res[i]) return Number(num)

            // add number from current array index to the one of the same index in result array
            return Number(res[i]) + Number(num)
        })
    }, [])

    return arrayNumsToSingleDigit(singleArray)
}

export const checkForMatch = (array, num, i) => {
    if (array[i] === undefined) {
        return false
    }

    if (num + array[i] === 10) {
        return i
    }

    return checkForMatch(array, num, i + 1)
}

export const shuffleArray = (array, i = 0) => {
    const num1 = array[i]

    // done!
    if (num1 === undefined) {
        return array
    }

    // do not temper with the original array by spreading the values into a new array
    let tempArray = [...array]

    const num2Index = checkForMatch(tempArray, num1, i + 1)

    if (num2Index) {
        const num2 = tempArray[num2Index]
        const binaryNums = num1 > num2 ? [1, 0] : [0, 1]

        const beyondNum2 = tempArray.splice(num2Index + 1)

        // delete matching number from array
        tempArray.splice(num2Index, 1)

        // splice all numbers beyond first number
        const tempSplice = tempArray.splice(i + 1)

        // remove first number and add binary numbers
        tempArray.splice(i, 1, binaryNums[0], binaryNums[1])

        // add spliced array back to array
        tempArray = [...tempArray, ...beyondNum2, ...tempSplice]

        return shuffleArray(tempArray, i + 2) // skip over second binary number
    }

    // no changes needed
    return shuffleArray(tempArray, i + 1)
}

export const isBinaryArray = (array) => {
    return !array.find(num => num > 1)
}

export const getValidHashArray = _.flow(
    toMultipleOfTen,
    arrayToChunks,
    combineChunkArrayNumbers,
)

export const findBinarySolution = (hashArray, nonce, originalArray = hashArray) => {
    const nextArray = getValidHashArray(hashArray)
    const newSolution = shuffleArray(nextArray)

    if (!isBinaryArray(newSolution)) {
        const nextNonce = getNextNonce(nonce)
        const nextHash = getNextHash(originalArray, nextNonce)

        return findBinarySolution(nextHash, nextNonce, originalArray)
    }

    return {
        solution: createHash(newSolution),
        nonce,
    }
}

export const hashToAsciiChars = _.flow(
    hashToAscii,
    splitAsciiChars,
)

export const convert = (hash) => {
    let nonce = -1

    console.time('Solved in')

    const originalArray = hashToAsciiChars(hash)
    const solution = findBinarySolution(originalArray, nonce)

    console.timeEnd('Solved in')

    return solution
}

export default convert
