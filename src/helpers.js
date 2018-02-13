export const createHash = (array) => array.reduce((str, val) => (str += val), '')
