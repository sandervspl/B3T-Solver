import express from 'express';
import moment from 'moment';
import solver from './convert';
import * as api from './api';
import { hash as mockHash } from './block';

const app = express();

if (process.version.match(/\w7/)) {
    app.set('port', 3000);
} else {
    throw Error(`This app requires Node v7 (using: ${process.version}) in order to properly run. Node does not support TCO as of v8. Try installing NVM to downgrade to v7.`);
}

export const createHash = (data) => Object.values(data).reduce((str, val) => (str += val));

export const hashFactory = (type, block) => {
    switch(type) {
        case 'prev': {
            const { blockchain } = block;
            const data = {
                hash: blockchain.hash,
                from: blockchain.data[0].from,
                to: blockchain.data[0].to,
                amount: blockchain.data[0].amount,
                timestamp1: blockchain.data[0].timestamp,
                timestamp2: blockchain.timestamp,
                nonce: blockchain.nonce,
            };

            return createHash(data);
        }
        case 'next': {
            const { transactions, timestamp } = block;
            const data = {
                from: transactions[0].from,
                to: transactions[0].to,
                amount: transactions[0].amount,
                timestamp1: transactions[0].timestamp,
                timestamp2: timestamp,
            };

            return createHash(data);
        }
        default: return console.log('Invalid hash type supplied to hashFactory');
    }
};

export const getLastBlock = async () => {
    console.log('Fetch last block from blockchain...');
    const block = await api.get({ path: 'blockchain/next' });

    // console.log('Received block:', JSON.stringify(block, null, 2));
    return block;
};

export const addNewBlock = async (nonce) => {
    console.log('Adding new block to blockchain...');

    await api.post({
        path: 'blockchain',
        body: JSON.stringify({
            nonce,
            user: 'Sander, 0832970',
        }),
    })
        .then(data => console.log('Succes!', data));
};

export const start = async () => {
    if (mockHash) {
        const { nonce } = solver(mockHash);
        console.log('Nonce:', nonce);
    } else {
        const block = await getLastBlock();

        if (block.open) {
            const hash = hashFactory('prev', block);
            console.log(`Hash is: ${hash}`);

            const { solution } = solver(hash);
            console.log('Solution of last block:', solution);

            const newHash = solution + hashFactory('next', block);
            console.log('hash for algorithm:', newHash);

            const { nonce } = solver(newHash);
            console.log('Nonce:', nonce);

            await addNewBlock(nonce);
        } else {
            const time = moment.duration(block.countdown);
            console.log(`Block is closed for ${time.minutes()}:${time.seconds()} minutes.`);
        }
    }
};

app.listen(app.get('port'), async () => {
    console.log(`Server started on port ${app.get('port')}`);
    await start();
});

