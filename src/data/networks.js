const supportedNetworks = [
    {
        name: 'Ethereum',
        chainId: '1',
        rpcUrl: 'https://mainnet.infura.io/v3/',
        supportedTokens: [
            {
                name: 'Tether',
                symbol: 'USDT',
                address: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
            },
            {
                name: 'MATIC',
                symbol: 'MATIC',
                address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0'
            },
            {
                name: 'USD COIN',
                symbol: 'USDC',
                address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
            },
        ]
    }
    ,
    {
        name: 'Polygon',
        chainId: 137,
        rpcUrl: 'https://polygon-mainnet.infura.io/v3/',
        supportedTokens: [
            {
                name: 'Tether',
                symbol: 'USDT',
                address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
            },
            {
                name: 'WRAPPED ETHER',
                symbol: 'WETH',
                address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
            },
            {
                name: 'USD COIN',
                symbol: 'USDC',
                address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
            },
        ]
    }
    ,
    {
        name: 'BNB',
        chainId: '56',
        supportedTokens: [
            {
                name: 'Binance-Peg Ether',
                symbol: 'ETH',
                address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8'
            },
            {
                name: 'MATIC Token',
                symbol: 'MATIC',
                address: '0xCC42724C6683B7E57334c4E856f4c9965ED682bD'
            },
            {
                name: 'Binance-Peg USD Coin',
                symbol: 'USDC',
                address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d'
            },
        ]
    }
    ,
    {
        name: 'Aurora',
        chainId: '1313161554',
        rpcUrl: 'https://aurora-mainnet.infura.io/v3/',
        supportedTokens: [
            {
                name: 'Tether',
                symbol: 'USDT',
                address: '0x4988a896b1227218e4A686fdE5EabdcAbd91571f'
            },
        ]
    }
    ,
    {
        name: 'Gnosis',
        chainId: '100',
        supportedTokens: [
            {
                name: 'TETHER USD on xDai',
                symbol: 'USDT',
                address: '0x4ECaBa5870353805a9F068101A40E0f32ed605C6'
            },
            {
                name: 'MATIC on xDai',
                symbol: 'MATIC',
                address: '0x7122d7661c4564b7C6Cd4878B06766489a6028A2'
            },
            {
                name: 'USD COIN on xDai',
                symbol: 'USDC',
                address: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83'
            },
        ]
    }
    ,
    {
        name: 'Mantle',
        chainId: '5000',
        supportedTokens: [
            {
                name: 'Ether',
                symbol: 'ETH',
                address: '0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111'
            },
        ]
    }
    ,
    {
        name: 'ZetaChain',
        chainId: '7000',
        supportedTokens: []
    }
    ,
    {
        name: 'Celo',
        chainId: '42220',
        rpcUrl: 'https://celo-mainnet.infura.io/v3/',
        supportedTokens: [
            {
                name: 'Tether',
                symbol: 'USDT',
                address: '0x617f3112bf5397D0467D315cC709EF968D9ba546'
            }
        ]
    }
    ,
    {
        name: 'OP',
        chainId: '10',
        rpcUrl: 'https://optimism-mainnet.infura.io/v3/',
        supportedTokens: [
            {
                name: 'TETHER',
                symbol: 'USDT',
                address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58'
            },
            {
                name: 'WRAPPED BTC',
                symbol: 'WBTC',
                address: '0x68f180fcCe6836688e9084f035309E29Bf0A2095'
            },
            {
                name: 'USD COIN',
                symbol: 'USDC',
                address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607'
            },
        ]
    }
    ,
    {
        name: 'Cronos',
        chainId: '25',
        supportedTokens: [
            {
                name: 'TETHER',
                symbol: 'USDT',
                address: '0x66e428c3f67a68878562e79A0234c1F83c208770'
            },
            {
                name: 'MATIC',
                symbol: 'MATIC',
                address: '0xf78a326ACd53651F8dF5D8b137295e434B7c8ba5'
            },
            {
                name: 'USD COIN',
                symbol: 'USDC',
                address: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59'
            },
        ]
    },
    {
        name: 'Linea',
        chainId: '59144',
        rpcUrl: 'https://linea-mainnet.infura.io/v3/',
        supportedTokens: [
        ]
    }
]

export default supportedNetworks