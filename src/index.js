import express from 'express';
import fetch from 'node-fetch';
import moment from 'moment';
import hasher from './convert';
import { API } from './constants';
import { hash as mockHash } from './block';

const app = express();
app.set('port', 3000);

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

    const block = await fetch(`${API}/blockchain/next`)
        .then(result => result.json())
        .catch(err => console.error('Error!', err));

    // console.log('Received block:', JSON.stringify(block, null, 2));
    return block;
};

export const addNewBlock = async (nonce) => {
    console.log('Adding new block to blockchain...');

    await fetch(`${API}/blockchain`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nonce,
            user: 'Sander, 0832970',
        }),
    })
        .then(result => result.json())
        .then(data => console.log('Succes!', data))
        .catch(err => console.log('Error!', err));
};

export const start = async () => {
    if (mockHash) {
        const { nonce } = hasher(mockHash);
        console.log('Nonce:', nonce);
    } else {
        const block = await getLastBlock();

        if (block.open) {
            const hash = hashFactory('prev', block);
            console.log(`Hash is: ${hash}`);

            const { solution } = hasher(hash);
            console.log('Solution of last block:', solution);

            const newHash = solution + hashFactory('next', block);
            console.log('hash for algorithm:', newHash);

            const { nonce } = hasher(newHash);
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

