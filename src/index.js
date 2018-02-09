import express from 'express';
import fetch from 'node-fetch';
import moment from 'moment';
import hasher from './convert';
import { API } from './constants';

const app = express();
app.set('port', 3000);

const getLastBlock = async () => {
    console.log('Fetch last block from blockchain...');

    const block = await fetch(`${API}/blockchain/next`)
        .then(result => result.json())
        .then(({ blockchain, ...block }) => {
            if (!block.open) {
                return {
                    countdown: block.countdown,
                };
            }

            return {
                hash: blockchain.hash,
                from: blockchain.data[0].from,
                to: blockchain.data[0].to,
                amount: blockchain.data[0].amount,
                timestamp1: blockchain.data[0].timestamp,
                timestamp2: blockchain.timestamp,
                nonce: blockchain.nonce,
            };
        })
        .catch((err) => console.error(err));

    if (block.countdown) return block;

    console.log('Assembling a hash with this data:', block);

    // return block with hash as one big string
    return {
        hash: Object.values(block).reduce((str, val) => (str += val)),
    }
};

const mineNewBlock = async () => {
    console.log('Fetch new hash info from block transaction...');

    const block = await fetch(`${API}/blockchain/next`)
        .then(result => result.json())
        .then(({ transactions, ...block }) => ({
            from: transactions[0].from,
            to: transactions[0].to,
            amount: transactions[0].amount,
            timestamp1: transactions[0].timestamp,
            timestamp2: block.timestamp,
        }))
        .catch((err) => console.error(err));

    // return hash as one big string
    return Object.values(block).reduce((str, val) => (str += val));
};

const addNewBlock = async (nonce) => {
    console.log('Adding new block to blockchain...');

    await fetch(`${API}/blockchain`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nonce,
            user: 'Sander, 0832970,'
        }),
    })
        .then(result => result.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));
};

const start = async () => {
    const block = await getLastBlock();

    if (block.hash) {
        console.log(`Hash is: ${block.hash}`);

        const { solution } = hasher(block.hash);

        console.log('Solution of last block:', solution);

        const hashStr = await mineNewBlock();
        const newHash = solution + hashStr;
        console.log('hash for algorithm:', newHash);

        const { nonce } = hasher(newHash);

        console.log('Nonce:', nonce);

        await addNewBlock(nonce);
    } else {
        const time = moment.duration(block.countdown);
        console.log(`Block is closed for ${time.minutes()}:${time.seconds()} minutes.`);
    }
};

app.listen(app.get('port'), async () => {
    console.log(`Server started on port ${app.get('port')}`);
    await start();
});

