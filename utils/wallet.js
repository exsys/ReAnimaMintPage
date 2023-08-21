//import "dotenv/config";
import { init } from '@web3-onboard/vue';
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from "@web3-onboard/walletconnect";
import { networkSettings, mainChainId } from "~/data/constants";

const injected = injectedModule();
const walletConnect = walletConnectModule({
    projectId: "432edbd9307fd5a59c13815fff6f158c", // change to own wallet connect project id
    requiredChains: [mainChainId],
});
const rpcUrl = networkSettings[mainChainId].rpcUrl;

export const web3Onboard = init({
    wallets: [injected, walletConnect],
    chains: [
        networkSettings[mainChainId].chainInfo
    ]
});