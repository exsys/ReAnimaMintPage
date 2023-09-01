<template>
    <header class="z-10 h-24 absolute top-0 w-full">
        <div class="py-6">
            <div class="flex items-center justify-between mx-8 lg:mx-auto lg:w-3/4">
                <NuxtLink class="cursor-pointer">
                    <div class="w-32 md:w-44 lg:w-52">
                        <img src="~/assets/images/reanima-logo.png" alt="logo">
                    </div>
                </NuxtLink>

                <div class="flex gap-20 items-center">
                    <button class="main-button uppercase py-2 px-6 rounded-xl min-w-[155px] tracking-wide" @click="connWallet">
                        {{ connectedWallet ?
                            `${connectedWallet.accounts[0].address.substring(0, 7)}...`
                            :
                            "Connect Wallet"
                        }}
                    </button>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import { web3Onboard } from '@/utils/wallet'; // don't remove
import { useOnboard } from '@web3-onboard/vue';
import { networkSettings } from '@/data/constants';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import changeNetwork from "@/components/toastify/changeNetwork";

const chainIdHex = networkSettings.testnet.chainInfo.id; // TODO: change to mainnet

export default {
    data() {
        return {
            ethersProvider: null,
            headerMenuActive: false,
        }
    },
    watch: {
        // watch current chain and send a popup if wrong network
        connectedChain: async function (newVal, oldVal) {
            if (!newVal) return;
            if (newVal.id !== chainIdHex) {
                this.toastId = toast.warning(changeNetwork, {
                    autoClose: 7000,
                    position: toast.POSITION.TOP_CENTER,
                    pauseOnHover: false,
                    closeOnClick: false,
                });
            } else {
                toast.remove();
            }
        }
    },
    setup() {
        const { connectWallet, setChain, connectedWallet, wallets, alreadyConnectedWallets, connectedChain } = useOnboard();
        const connect = async () => connectWallet();
        const set = async () => setChain({ wallet: 'MetaMask', chainId: chainIdHex });
        return { connect, set, connectedWallet, wallets, alreadyConnectedWallets, connectedChain };
    },
    async mounted() {
        if (this.alreadyConnectedWallets.length) {
            try {
                await this.connect();
            } catch (error) {
                console.log(error);
            }
        }
    },
    methods: {
        async connWallet() {
            if (this.connectedWallet) return;
            try {
                await this.connect();
            } catch (error) {
                console.log(error);
            }
        },
    }
}
</script>

<style>
.menu {
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
    transition: all 150ms linear;
    will-change: transform;
    opacity: 0;
}

.menuIconLine {
    width: 2.25rem;
    height: 3px;
    background-color: white;
    border-radius: 0.5rem;
    transition: all 0.3s;
}

.menuIconLine:not(:first-child) {
    margin-top: 0.5rem;
}

.line1 {
    transform: translate(0, 13px) rotate(-45deg);
}

.line2 {
    opacity: 0;
}

.line3 {
    transform: translate(0, -9px) rotate(45deg);
}

.active {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    transition: all 150ms linear;
    will-change: transform;
    opacity: 1;
}
</style>