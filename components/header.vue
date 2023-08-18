<template>
    <header>
        <div class="w-full absolute top-0 py-6">
            <div class="flex items-center justify-between w-3/4 mx-auto">
                <div>
                    Logo
                </div>

                <!-- mobile header -->
                <div class="inline-block lg:hidden cursor-pointer z-20 p-1.5" @click="headerMenuActive = !headerMenuActive">
                    <div class="menuIconLine" :class="headerMenuActive ? '!bg-white line1' : ''"></div>
                    <div class="menuIconLine" :class="headerMenuActive ? '!bg-white line2' : ''"></div>
                    <div class="menuIconLine" :class="headerMenuActive ? '!bg-white line3' : ''"></div>
                </div>
                <div :class="headerMenuActive ? 'active' : ''" class="menu absolute items-center
                justify-center bg-black w-screen h-screen inset-0 px-10 py-24 lg:hidden">
                    <nav class="flex flex-col gap-4 text-white" aria-label="main">
                        <NuxtLink class="cursor-pointer">Home</NuxtLink>
                        <NuxtLink class="cursor-pointer">Mint</NuxtLink>
                        <NuxtLink class="cursor-pointer">About</NuxtLink>
                    </nav>
                </div>

                <!-- non-mobile header -->
                <div class="hidden lg:flex gap-20 items-center">
                    <nav class="flex gap-12">
                        <NuxtLink class="cursor-pointer">Home</NuxtLink>
                        <NuxtLink class="cursor-pointer">Mint</NuxtLink>
                        <NuxtLink class="cursor-pointer">About</NuxtLink>
                    </nav>

                    <button class="main-button py-2 px-6 rounded-xl" @click="connWallet">
                        {{ connectedWallet ? `${connectedWallet.accounts[0].address.substring(0, 6)}...`
                            : "Connect Wallet" }}
                    </button>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import { web3Onboard } from '@/utils/wallet';
import { useOnboard } from '@web3-onboard/vue';
import { ethers } from 'ethers';
import { networkSettings } from '@/data/constants';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import changeNetwork from "@/components/toastify/changeNetwork";
const mainChainIdHex = `0x${networkSettings.mainChainId.toString(16)}`;

export default {
    data() {
        return {
            ethersProvider: null,
            headerMenuActive: false,
            toastId: null,
        }
    },
    watch: {
        connectedChain: async function (newVal, oldVal) {
            if (newVal.id !== mainChainIdHex) {
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
        const set = async () => setChain({ wallet: 'MetaMask', chainId: mainChainIdHex });
        return { connect, set, connectedWallet, wallets, alreadyConnectedWallets, connectedChain };
    },
    async mounted() {
        if (this.alreadyConnectedWallets.length) {
            await this.connect();
            this.checkCorrectNetwork();
        }
    },
    methods: {
        async connWallet() {
            await this.connect();
            this.checkCorrectNetwork();
        },
        checkCorrectNetwork() {
            if (this.connectedWallet) {
                if (this.connectedChain.id !== mainChainIdHex) {
                    this.toastId = toast.warning(changeNetwork, {
                        autoClose: 7000,
                        position: toast.POSITION.TOP_CENTER,
                        pauseOnHover: false,
                        closeOnClick: false,
                    });
                }
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
    background-color: black;
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