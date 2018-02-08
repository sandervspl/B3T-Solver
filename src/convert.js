import _ from 'lodash';
import block from './block.json';

let originalArray;
let nonce = -1;

const addNonceToOriginalArray = () => {
    // for testing
    if (block.nonce) {
        nonce = block.nonce;
    } else {
        nonce = Number(nonce) + 1;
    }

    console.log('New nonce:', nonce);

    const splitNonce = nonce.toString().split('');
    originalArray = [...originalArray, ...splitNonce];

    console.log('New original array:', originalArray);

    return originalArray;
};

    const hashToAscii = (hash) => {
    console.log('Turn hash into ASCII...');
    return hash
        .replace(/\s+/g, '')
        .split('')
        .map(char => isNaN(char) ? char.charCodeAt(0).toString() : char);
};

const splitAsciiChars = (ascii) => {
    console.log('Split ASCII characters to singles...');
    originalArray = _.flatten(ascii.map(char => char.split('')));

    return originalArray;
};

const toMultipleOfTen = (array) => {
    console.log('Check if array is multiple of 10...');
    const newArray = array;

    console.log('cur length:', newArray.length);

    if (newArray.length % 10 !== 0) {
        const diff = 10 - newArray.length % 10;
        let i = 0;

        _.times(
            diff,
            () => newArray.push((i++).toString())
        );

        console.log('Added numbers. New length:', newArray.length);
    } else {
        console.log('Array is multiple of 10!');
    }

    // return newArray;
    return shrinkToTen(newArray);
};

// FIXME: name???
const shrinkToTen = (array) => {
    const chunks = _.chunk(array, 10);

    console.log('Turn array into chunks of 10...');
    console.log(chunks);

    const addedArray = chunks.reduce((res, array) => {
        return array.map((char, i) => {
            if (!res[i]) return Number(char);
            return Number(res[i]) + Number(char);
        });
    }, []);

    const modulatedArray = addedArray.map((num) => num % 10);

    console.log('After adding all array numbers:', modulatedArray);

    // return modulatedArray;
    return toBinary(modulatedArray);
};

const toBinary = (array) => {
    console.log('Looking for matches of 10 in array...');
    let result = array;
    let binarySecondNumIndex = -1;

    for (let i = 0; i < result.length; i += 1) {
        const num1 = result[i];
        let matched = false;

        // skip second binary number's index from a previous number match
        if (binarySecondNumIndex === i) {
            binarySecondNumIndex = -1;
            continue;
        }

        for (let j = i; j < result.length; j +=1) {
            if (i === j) continue;

            if (matched) break;

            const num2 = result[j];

            if (num1 + num2 === 10) {
                matched = true;
                console.log(`${num1} (index ${i}) and ${num2} (index ${j}) add to 10.`);

                // grab all numbers beyond matching number
                const beyondNum2 = result.splice(j + 1, result.length);
                console.log(`Cut and save numbers beyond ${num2}:`, beyondNum2);

                // delete matching number from array
                console.log(`Delete number ${num2} from array...`);
                result.splice(j, 1);

                // set first number
                result[i] = num1 > num2 ? 1 : 0;

                // splice all numbers beyond first number
                const tempSlice = result.splice(i + 1, result.length);
                console.log(`Cut and save numbers beyond ${num1}:`, tempSlice);

                // add 0 or 1 after first number
                result.push(num1 > num2 ? 0 : 1);

                console.log('Shuffling...');

                // add spliced array back to array
                result = [...result, ...beyondNum2, ...tempSlice];

                // save this index so we skip it next iteration
                binarySecondNumIndex = i + 1;

                console.log('Array after shuffle:', result);
            }
        }

        if (!matched) {
            console.log(`No match found. Keep ${num1} in Result array.`);
            // result.push(num1);
        }
    }

    console.log('Done! Result:', result);

    return result;
};

const convert = (hash) => {
    let result;

    result = hashToAscii(hash);
    result = splitAsciiChars(result);
    result = toMultipleOfTen(result);

    while(result.find(num => num > 1)) {
        console.log(`Array is not binary yet.`);
        console.log('Starting over with Nonce...');
        result = toMultipleOfTen(addNonceToOriginalArray());
    }

    console.log('Array is binary!');
    console.log('Nonce is:', nonce);
    return result;
};

export default convert;
