import _ from 'lodash';
import moment from 'moment';

const getNextHashAndNonce = (hash, nonce) => {
    const nextNonce = Number(nonce) + 1;
    //console.log('New nonce:', nextNonce);

    const nextHash = hash + nextNonce;
    //console.log('New hash:', nextHash);

    return { nextHash, nextNonce };
};

const hashToAscii = (hash) => {
    //console.log('Turn hash into ASCII...');
    return hash
        .replace(/\s+/g, '')
        .split('')
        .map(char => isNaN(char) ? char.charCodeAt(0).toString() : char);
};

const splitAsciiChars = (ascii) => {
    //console.log('Split ASCII characters to singles...');
    return _.flatten(ascii.map(char => char.split('')));
};

const toMultipleOfTen = (array) => {
    //console.log('Check if array is multiple of 10...');
    const newArray = array;

    //console.log('Cur length:', newArray.length);

    if (newArray.length % 10 !== 0) {
        const diff = 10 - newArray.length % 10;
        let i = 0;

        _.times(
            diff,
            () => newArray.push((i++).toString())
        );

        //console.log('Added numbers. New length:', newArray.length);
    } else {
        //console.log('Array is multiple of 10!');
    }

    return newArray;
};

const arrayToChunks = (array) => {
    return _.chunk(array, 10);
};

const arrayNumsToSingleDigit = (array) => {
    return array.map((num) => num % 10);
};

const fixArray = (arrayChunks) => {
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

const checkForMatch = (array, num, i) => {
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

const shuffleArray = (array, i) => {
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

const toBinary = (array) => {
    return shuffleArray(array, 0);
};

const hasher = (hash) => {
    let result = hash;

    result = hashToAscii(result);
    result = splitAsciiChars(result);
    result = toMultipleOfTen(result);
    result = arrayToChunks(result);
    result = fixArray(result);

    return toBinary(result);
};

const convert = (hash) => {
    const originalHash = hash; // immutable! Do not change this var because we add a new nonce to the OG every try
    let binaryArray;
    let nonce = -1;

    const mStartTime = moment();

    // try to get binary result
    binaryArray = hasher(originalHash);

    // keep trying
    while(binaryArray.find(num => num > 1)) {
        // console.log(`Array is not binary yet.`);
        const { nextHash, nextNonce } = getNextHashAndNonce(originalHash, nonce);
        nonce = nextNonce;

        // console.log(`Starting over with Nonce ${nonce}.`);
        binaryArray = hasher(nextHash);
    }

    // console.log('Array is binary! We found the nonce!');
    const mSolveTime = moment.duration(moment().diff(mStartTime));
    console.log(`Solved in ${mSolveTime.milliseconds()}ms.`);

    return {
        solution: binaryArray.reduce((str, val) => (str += val), ''),
        nonce,
    };
};

export default convert;
