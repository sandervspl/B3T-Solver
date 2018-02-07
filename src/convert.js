import { flatten } from 'lodash';

const hashToAscii = (hash) => {
    return hash
        .split('')
        .map(char => isNaN(char) ? char.charCodeAt(0).toString() : char);
};

const splitAsciiChars = (ascii) => {
    return flatten(ascii.map(char => char.split('')));
};

const convert = (hash) => {
    let binary;
    binary = hashToAscii(hash);
    binary = splitAsciiChars(binary);

    return binary;
};

export default convert;
