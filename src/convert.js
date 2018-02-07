const hashToAscii = (hash) => {
    return hash
        .split('')
        .map(char => isNaN(char) ? char.charCodeAt(0).toString() : char);
};

const convert = (hash) => {
    const ascii = hashToAscii(hash);

    return ascii;
};

export default convert;
