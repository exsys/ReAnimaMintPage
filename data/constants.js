export const mainnetChainId = 42161;
export const testnetChainId = 421613;

export const networkSettings = {
    // arbitrum mainnet
    mainnet: {
        rpcUrl: "https://arb1.arbitrum.io/rpc",
        chainInfo: {
            id: "0xa4b1",
            token: "ETH",
            label: "Arbitrum One",
        }
    },
    // arbitrum testnet (goerli)
    testnet: {
        rpcUrl: "https://arbitrum-goerli.blockpi.network/v1/rpc/public",
        chainInfo: {
            id: "0x66eed",
            token: "AGOR",
            label: "Arbitrum Goerli",
        }
    }
};

export const reAnimaPassContractAddress = {
    mainnet: "0x740Df9ccE9D7448AC7Bd481ea157934188EF4361",
    testnet: "0xa0707dAb631c384785Fb7fb560922705abafB48B",
};