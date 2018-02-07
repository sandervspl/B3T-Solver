import express from 'express';
import { hash } from './hash.json';
import convertHashToBinary from './convert';

const app = express();
app.set('port', 3000);

app.listen(app.get('port'), () => {
    console.log(`Server started on port ${app.get('port')}`);

    console.log(`Hash is: ${hash}`);
    const binary = convertHashToBinary(hash);
    console.log('binary result:', binary);
});
