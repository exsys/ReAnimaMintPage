<template>
    <div>Wrong Network. <span class="underline" @click="changeNetwork">Change</span></div>
</template>

<script>
import { useOnboard } from '@web3-onboard/vue';
import { networkSettings } from '@/data/constants';

export default {
    name: "changeNetwork",
    setup() {
        const { setChain, connectedChain } = useOnboard();
        const set = async () => setChain({ wallet: 'MetaMask', chainId: `0x${networkSettings.mainChainId.toString(16)}` });
        return { set, connectedChain };
    },
    methods: {
        changeNetwork() {
            this.set();
        }
    }
}
</script>