# B3T Solver
A CMGTCoin miner built with NodeJS and using the functional programming pattern.

## Usage

This app uses NodeJS v7 in order to properly run. v8+ does not support *Tail Call Optimization* as it was removed from the v8 engine. This project uses a lot of recursion in which it is needed to avoid Call Stack errors.

To run the development server

    $ npm run dev

To run tests

    $ npm run test:watch
