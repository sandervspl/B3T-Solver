import _ from 'lodash';

const hashToAscii = (hash) => {
    return hash
        .split('')
        .map(char => isNaN(char) ? char.charCodeAt(0).toString() : char);
};

const splitAsciiChars = (ascii) => {
    return _.flatten(ascii.map(char => char.split('')));
};

const toMultipleOfTen = (array) => {
    const newArray = array;

    console.log('cur length:', newArray.length);

    if (newArray.length % 10 !== 0) {
        const diff = 10 - newArray.length % 10;
        let i = 0;

        _.times(
            diff,
            () => newArray.push((i++).toString())
        );

        console.log('new length:', newArray.length);
    }

    // return newArray;
    shrinkToTen(newArray);
};

// FIXME: name???
const shrinkToTen = (array) => {
    const chunks = _.chunk(array, 10);

    console.log('Array in chunks of 10');
    console.log(chunks);

    const addedArray = chunks.reduce((res, array) => {
        return array.map((num, i) => {
            if (!res[i]) return num;
            return Number(res[i]) + Number(num);
        });
    }, []);

    const modulatedArray = addedArray.map((num) => num % 10);

    console.log('Final array:', modulatedArray);

    // return modulatedArray;
    toBinary(modulatedArray);
};

const toBinary = (array) => {
    const result = [];

    array.forEach((num1, i) => {
        let matched = false; // FIXME: expensive iterations because we dont break them

        console.log('Match array', result);

        array.forEach((num2, j) => {
            if (matched || i === j) return;

            if (num1 + num2 === 10) {
                console.log(`${num1} (index ${i}) and ${num2} (index ${j}) add to 10`);
                matched = true;

                // result.concat(num1 > num2 ? [1,0] : [0,1]); // FIXME: why doesnt this work
                if (num1 > num2) {
                    result.push(1);
                    result.push(0);
                } else {
                    result.push(0);
                    result.push(1);
                }
            }
        });

        if (!matched) {
            result.push(num1);
        }
    });

    console.log('Done! Result:', result);

    if (result.length % 10 !== 0) {
        toMultipleOfTen(result);
    } else {
        // TODO: Check if result is complete binary
        // TODO: If not, add more numbers
        return result;
    }
};

const convert = (hash) => {
    let result;
    result = hashToAscii(hash);
    result = splitAsciiChars(result);
    result = toMultipleOfTen(result);
    // result = shrinkToTen(result);
    // result = toBinary(result);

    return result;
};

export default convert;
