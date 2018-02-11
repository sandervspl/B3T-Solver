import _ from 'lodash';
import moment from 'moment';

export const getNextNonce = (nonce) => {
    return Number(nonce) + 1;
};

export const getNextHash = (originalHash, nonce) => {
    return originalHash + nonce;
};

export const hashToAscii = (hash) => {
    //console.log('Turn hash into ASCII...');
    return hash
        .replace(/\s+/g, '')
        .split('')
        .map(char => isNaN(char) ? char.charCodeAt(0).toString() : char);
};

export const splitAsciiChars = (ascii) => {
    //console.log('Split ASCII characters to singles...');
    return _.flatten(ascii.map(char => char.split('')));
};

export const toMultipleOfTen = (array) => {
    //console.log('Check if array is multiple of 10...');

    if (array.length % 10 !== 0) {
        const diff = 10 - array.length % 10;
        const filler = Array.from({ length: diff }, (_, i) => i.toString());
        const newArray = [...array, ...filler];

        // console.log('Added numbers. New length:', newArray.length);
        return newArray;
    }

    return array;
};

export const arrayToChunks = (array) => {
    return _.chunk(array, 10);
};

export const arrayNumsToSingleDigit = (array) => {
    return array.map((num) => num % 10);
};

export const fixArray = (arrayChunks) => {
    // add up all numbers in array from same index
    const singleArray = arrayChunks.reduce((res, array) => {
        return array.map((char, i) => {
            if (!res[i]) return Number(char);
            return Number(res[i]) + Number(char);
        });
    }, []);

    //console.log('After adding all array numbers:', singleArray);
    return arrayNumsToSingleDigit(singleArray);
};

export const checkForMatch = (array, num, i) => {
    if (array[i] === undefined) {
        // console.log('No match found. Returning', num);
        return false;
    }

    // console.log(`Matching ${num} and ${array[i]}...`);
    if (num + array[i] === 10) {
        // console.log('Found match', i);
        return i;
    }

    // console.log('Check again');
    return checkForMatch(array, num, i + 1);
};

export const shuffleArray = (array, i) => {
    const num1 = array[i];

    // done!
    if (num1 === undefined) return array;

    let tempArray = array;

    // console.log('Match numbers from array', tempArray);
    const num2Index = checkForMatch(tempArray, num1, i + 1);

    if (num2Index) {
        const num2 = tempArray[num2Index];
        const binaryNums = num1 > num2 ? [1, 0] : [0, 1];

        // grab all numbers beyond matching number
        const beyondNum2 = tempArray.splice(num2Index + 1);
        // console.log(`Cut and save numbers beyond ${num2}:`, beyondNum2);

        // delete matching number from array
        // console.log(`Delete number ${num2} from array...`);
        tempArray.splice(num2Index, 1);

        // splice all numbers beyond first number
        const tempSlice = tempArray.splice(i + 1);
        // console.log(`Cut and save numbers beyond ${num1}:`, tempSlice);

        // remove first number and add binary numbers
        tempArray.splice(i, 1, binaryNums[0], binaryNums[1]);

        // add spliced array back to array
        // console.log('Shuffling...');
        tempArray = [...tempArray, ...beyondNum2, ...tempSlice];
        // console.log('Array after shuffle:', tempArray);

        return shuffleArray(tempArray, i + 2); // skip over second binary number
    }

    // no changes needed
    return shuffleArray(tempArray, i + 1);
};

export const isBinaryArray = (array) => {
    return !array.find(num => num > 1);
};

export const getSolutionFromHash = (hash) => {
    let result = hash;

    result = hashToAscii(result);
    result = splitAsciiChars(result);
    result = toMultipleOfTen(result);
    result = arrayToChunks(result);
    result = fixArray(result);

    return shuffleArray(result, 0);
};

export const findBinarySolution = (hash, nonce, originalHash) => {
    const newSolution = getSolutionFromHash(hash);

    if (!isBinaryArray(newSolution)) {
        const nextNonce = getNextNonce(nonce);
        const nextHash = getNextHash(originalHash, nextNonce);

        return findBinarySolution(nextHash, nextNonce, originalHash);
    }

    return {
        solution: newSolution.reduce((str, val) => (str += val), ''),
        nonce,
    };
};

export const convert = (hash) => {
    const originalHash = hash;
    let nonce = -1;

    const mStartTime = moment();

    const solution = findBinarySolution(originalHash, nonce, originalHash);

    // console.log('Array is binary! We found the nonce!');
    const mSolveTime = moment.duration(moment().diff(mStartTime));
    console.log(`Solved in ${mSolveTime.milliseconds()}ms.`);

    return solution;
};

export default convert;
