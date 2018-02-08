import express from 'express';
import { hash } from './block.json';
import findNonce from './convert';

const app = express();
app.set('port', 3000);

app.listen(app.get('port'), () => {
    console.log(`Server started on port ${app.get('port')}`);

    console.log(`Hash is: ${hash}`);

    const nonce = findNonce(hash);

    console.log('Nonce result:', nonce);
});
