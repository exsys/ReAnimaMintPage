<template>
    <div class="flex justify-center items-start h-full relative mt-16 lg:mt-0 lg:items-center">
        <div class="flex justify-center w-full">
            <div class="w-[94%] lg:w-1/2 flex flex-col items-center justify-center text-center 
            px-4 py-10 bg-black/20 lg:bg-transparent rounded-xl z-10">
                <h1 class="text-5xl mb-8 font-medium">RE:Anima Pass</h1>
                <h2 class="text-2xl">Some random info text</h2>
                <div class="flex justify-center my-10 text-2xl gap-4">
                    <button class="w-10 h-10 main-button rounded-md" @click="changeAmount(-1)">
                        -
                    </button>
                    <input v-model="amount" class="text-center w-1/3 bg-transparent">
                    <button class="w-10 h-10 main-button rounded-md" @click="changeAmount(1)">
                        +
                    </button>
                </div>
                <button class="main-button rounded-md py-2 px-10" @click="mintPass">
                    Mint
                </button>
            </div>
            <img src="~/assets/images/akirina.png" alt="anima" class="absolute lg:w-[20%] lg:top-[10%] lg:right-[15%]">
        </div>
    </div>
</template>

<script>
import { useOnboard } from '@web3-onboard/vue';
import { ethers } from 'ethers';
import { reAnimaPassContractAddress } from "@/data/constants";
import { reAnimaPassABI } from '@/data/abis';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    name: "mintPage",
    data() {
        return {
            amount: 0,
        }
    },
    setup() {
        const { connectedWallet, wallets, alreadyConnectedWallets } = useOnboard();
        return { connectedWallet, wallets, alreadyConnectedWallets };
    },
    methods: {
        changeAmount(byAmount) {
            if (this.amount + byAmount < 0) return;
            this.amount += byAmount;
        },
        async mintPass() {
            if (this.connectedWallet) {
                const ethersProvider = new ethers.BrowserProvider(this.connectedWallet.provider);
                const signer = await ethersProvider.getSigner();
                const reAnimaPassContract = new ethers.Contract(reAnimaPassContractAddress.main, reAnimaPassABI, signer);
                try {
                    const tx = await reAnimaPassContract.mint();
                } catch (error) {
                    if (error.info.error.code === 4001) {
                        toast.error("User denied transaction!", {
                            autoClose: 7000,
                            position: toast.POSITION.TOP_CENTER,
                            pauseOnHover: false,
                        });
                    }
                }
            } else {
                toast.warning("Connect your wallet!", {
                    autoClose: 7000,
                    position: toast.POSITION.TOP_CENTER,
                    pauseOnHover: false,
                });
            }
        }
    }
}
</script>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
}
</style>