module.exports = function (wallaby) {
    return {
        files: [
            'src/*.js'
        ],
        tests: [
            'tests/*.test.js'
        ],
        env: {
            type: 'node',
            runner: 'node',
            params: {
                runner: '--harmony_tailcalls'
            }
        },
        testFramework: 'jest',
        compilers: {
            '**/*.js*': wallaby.compilers.babel(),
        },
    };
};