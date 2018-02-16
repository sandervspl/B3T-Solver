const nextBlock = {
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
    open: true,
}

export const get = () => {
    return new Promise((resolve) => {
        process.nextTick(() => resolve(nextBlock))
    })
}

export const post = () => {
    return new Promise((resolve) => {
        process.nextTick(() => resolve({
            message: 'blockchain accepted, user awarded'
        }))
    })
}