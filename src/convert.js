import { flatten, times } from 'lodash';

const hashToAscii = (hash) => {
    return hash
        .split('')
        .map(char => isNaN(char) ? char.charCodeAt(0).toString() : char);
};

const splitAsciiChars = (ascii) => {
    return flatten(ascii.map(char => char.split('')));
};

const toMultipleOfTen = (array) => {
    console.log('cur length:', array.length);

    if (array.length % 10 !== 0) {
        const diff = 10 - array.length % 10;
        let i = 0;

        times(
            diff,
            () => array.push((i++).toString())
        );

        console.log('new length:', array.length);
    }

    return array;
};

const convert = (hash) => {
    let binary;
    binary = hashToAscii(hash);
    binary = splitAsciiChars(binary);
    binary = toMultipleOfTen(binary);

    return binary;
};

export default convert;
