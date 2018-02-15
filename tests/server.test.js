import { createHash } from '../src/helpers'
import {
    getLastBlock,
    hashFactory,
} from '../src';

jest.mock('../src/api')

describe('server', () => {
    const mockBlock = {
        blockchain: {
            hash: '1001101010',
            timestamp: 1518423013955,
            nonce: '617',
            data: [{
                from: 'CMGT Mining Corporation',
                to: 'sander',
                amount: 1,
                timestamp: 1518280457208
            }],
        },
        transactions: [{
            from: 'CMGT Mining Corporation',
            to: 'trump',
            amount: 1,
            timestamp: 1518719979286,
        }],
        timestamp: 1518721886922,
    }

    describe('hashFactory()', () => {
        const { blockchain } = mockBlock
        const data = blockchain.data[0]
        const transaction = mockBlock.transactions[0]

        it('Returns the correct hash with type "prev"', () => {
            const expectedHash = createHash([
                blockchain.hash,
                data.from,
                data.to,
                data.amount,
                data.timestamp,
                blockchain.timestamp,
                blockchain.nonce,
            ])

            expect(hashFactory('prev', mockBlock)).toEqual(expectedHash);
        })

        it('Returns the correct hash with type "next"', () => {
            const expectedHash = createHash([
                transaction.from,
                transaction.to,
                transaction.amount,
                transaction.timestamp,
                mockBlock.timestamp,
            ])

            expect(hashFactory('next', mockBlock)).toEqual(expectedHash);
        })

        it('Fires a console error on default', () => {
            console.error = jest.fn()
            hashFactory('', mockBlock)

            expect(console.error).toHaveBeenCalled()

            console.error.mockClear()
        })
    })

    describe('getLastBlock()', () => {
        it('Resolves the last block from the blockchain', async () => {
            expect.assertions(1)
            const data = await getLastBlock()
            return expect(data).toEqual(mockBlock)
        })
    })
})
