import { getAddress } from 'ethers'

const ENDPOINTS = {
    100: {
        url: 'https://api.gnosisscan.io/api?module=account&action=tokentx&address=$address&sort=asc&apikey=',
        key: process.env.NEXT_PUBLIC_GNOSIS_API_KEY
    },
    42220: {
        url: 'https://api.celoscan.io/api?module=account&action=tokentx&address=$address&sort=asc&apikey=',
        key: process.env.NEXT_PUBLIC_CELO_API_KEY
    },
    5000: {
        url: 'https://explorer.mantle.xyz/api?module=account&action=tokentx&address=$address&sort=asc&apikey=',
        key: '' // No API key needed
    },
    1313161554: {
        url: 'https://explorer.mainnet.aurora.dev/api?module=account&action=tokentx&address=$address&sort=asc&apikey=',
        key: '' // No API key needed
    }
}

export default async function fetchTransactions (chainID, address, tokens) {
    const rawUrl = `${ENDPOINTS[chainID].url}${ENDPOINTS[chainID].key}`
    const url = rawUrl.replace('$address', address)

    const response = await fetch(url)

    if (response.status === 200) {
        const data = await response.json()
        const tokenAddresses = tokens.map((token) => token.address)

        return data.result.filter((tx) => {
            const contractAddress = getAddress(tx.contractAddress)
            return tokenAddresses.includes(contractAddress)
        }).slice(0, 20) // tmp
    } else {
        return []
    }
}