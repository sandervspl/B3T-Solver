import express from 'express'
import moment from 'moment'
import solver from './convert'
import * as api from './api'
import { createHash } from './helpers'
import { hash as mockHash } from './block'

if (!process.version.match(/\w7/)) {
    throw Error(`This app requires NodeJS v7 (using: ${process.version}) in order to properly run. NodeJS does not support TCO as of v8. Try installing NVM to downgrade to v7.`)
}

export const hashFactory = (type, block) => {
    switch(type) {
        case 'prev': {
            const { blockchain } = block
            const data = [
                blockchain.hash,
                blockchain.data[0].from,
                blockchain.data[0].to,
                blockchain.data[0].amount,
                blockchain.data[0].timestamp,
                blockchain.timestamp,
                blockchain.nonce,
            ]

            return createHash(data)
        }
        case 'next': {
            const { transactions, timestamp } = block
            const data = [
                transactions[0].from,
                transactions[0].to,
                transactions[0].amount,
                transactions[0].timestamp,
                timestamp,
            ]

            return createHash(data)
        }
        default: return console.error('Invalid hash type supplied to hashFactory')
    }
}

export const getLastBlock = async () => {
    console.log('Fetch last block from blockchain...')
    const block = await api.get({ path: 'blockchain/next' })

    // console.log('Received block:', JSON.stringify(block, null, 2))
    return block
}

export const addNewBlock = async (nonce) => {
    console.log('Adding new block to blockchain...')

    return await api.post({
        path: 'blockchain',
        body: JSON.stringify({
            nonce,
            user: 'Sander 0832970',
        }),
    })
}

export const start = async () => {
    if (mockHash) {
        const { nonce, solution } = solver(mockHash)
        console.log('Nonce:', nonce)
        console.log('Solution:', solution)
    } else {
        const block = await getLastBlock()

        if (block.open) {
            const hash = hashFactory('prev', block)
            console.log(`Hash is: ${hash}`)

            const { solution } = solver(hash)
            console.log('Solution of last block:', solution)

            const newHash = solution + hashFactory('next', block)
            console.log('hash for algorithm:', newHash)

            const { nonce } = solver(newHash)
            console.log('Nonce:', nonce)

            await addNewBlock(nonce)
                .then(data => console.log('Succes!', data))
        } else {
            const time = moment.duration(block.countdown)
            console.log(`Block is closed for ${time.minutes()}:${time.seconds()} minutes.`)
        }
    }
}

if (process.env.NODE_ENV !== 'test') {
    const app = express()
    app.set('port', 3000)

    app.listen(app.get('port'), async () => {
        console.log(`Server started on port ${app.get('port')}`)
        await start()
    })
}
