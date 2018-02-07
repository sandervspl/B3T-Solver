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
    console.log('cur length:', array.length);

    if (array.length % 10 !== 0) {
        const diff = 10 - array.length % 10;
        let i = 0;

        _.times(
            diff,
            () => array.push((i++).toString())
        );

        console.log('new length:', array.length);
    }

    return array;
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

    return modulatedArray;
};

const convert = (hash) => {
    let binary;
    binary = hashToAscii(hash);
    binary = splitAsciiChars(binary);
    binary = toMultipleOfTen(binary);
    binary = shrinkToTen(binary);

    return binary;
};

export default convert;
