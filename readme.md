# B3T Solver
A CMGTCoin miner built with NodeJS.

## Disclaimer

This app requires Node **v7.x.x** in order to run. v8+ does not support Tail Call Optimization as it was removed from the v8 engine. This project uses a lot of recursion in which it is needed to avoid Call Stack errors.

## Usage

### Downgrading Node
You can use a tool like [NVM](https://github.com/creationix/nvm) to downgrade to v7.

To downgrade to v7 with NVM

`nvm use 7`

### Installing
`npm i`

To run the development server

`npm run dev`

To run tests

`npm run test:watch`