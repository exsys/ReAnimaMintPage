export const networkSettings = {
    mainChainId: 42161,
    // arbitrum mainnet
    42161: {
        rpcUrl: "https://api.zan.top/node/v1/arb/one/public",
        chainInfo: {
            id: "0xa4b1",
            token: "ETH",
            label: "Arbitrum One",
        }
    },
    // arbitrum testnet (goerli)
    421613: {
        rpcUrl: "https://arbitrum-goerli.public.blastapi.io",
        chainInfo: {
            id: "0x66eed",
            token: "AGOR",
            label: "Arbitrum Goerli",
        }
    }
};

export const reAnimaPassContractAddress = {
    main: "0x740Df9ccE9D7448AC7Bd481ea157934188EF4361",
    testnet: "0xa0707dAb631c384785Fb7fb560922705abafB48B",
};