<template>
    <div class="flex justify-center items-start h-screen relative mt-16 lg:mt-0 lg:items-center">
        <div class="flex justify-center w-full">
            <div class="w-[94%] lg:w-max flex flex-col items-center justify-center text-center 
            px-4 py-10 bg-black/20 lg:bg-transparent rounded-xl z-10">
                <h1 class="text-5xl mb-8 font-medium">RE:Anima Pass</h1>
                <h2 class="text-2xl">Some random info text</h2>
                <div v-if="!mintActive" class="mt-10 flex flex-col w-full">
                    <h3 class="text-2xl">Check eligibility</h3>
                    <input v-model="walletAddress" type="text" name=""
                        class="my-6 px-3 py-2 outline-0 text-black rounded-md text-xl">
                    <button class="main-button py-2 px-6 rounded-md" @click="checkEligibility">Check</button>
                    <div v-if="eligibilityChecked" class="mt-6 text-2xl">
                        <div v-if="eligible" class="text-[#198754]">
                            Congrats! You are whitelisted 
                        </div>
                        <div v-if="!eligible" class="text-[#ff3333]">
                            This wallet is not whitelisted
                        </div>
                    </div>
                </div>
                <div v-if="mintActive">
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
            </div>
            <img src="~/assets/images/akirina.png" alt="anima" class="absolute sm:w-[50%] lg:w-[30%] lg:top-[15%] lg:right-[10%]
            xl:w-[20%] xl:top-[17%] xl:right-[15%]">
        </div>
    </div>
</template>

<script>
import { useOnboard } from '@web3-onboard/vue';
import { ethers } from 'ethers';
import { reAnimaPassContractAddress } from "@/data/constants";
import { reAnimaPassABI } from '@/data/contractAbis';
import { networkSettings } from '@/data/constants';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import changeNetwork from "@/components/toastify/changeNetwork";
//import { merkleTree } from "@/utils/whitelistChecker";

const mainChainIdHex = `0x${networkSettings.mainChainId.toString(16)}`;

export default {
    name: "mintPage",
    data() {
        return {
            mintActive: false,
            eligible: false,
            eligibilityChecked: false,
            walletAddress: "",
            amount: 0,
        }
    },
    setup() {
        const { connectedWallet, wallets, alreadyConnectedWallets, connectedChain } = useOnboard();
        return { connectedWallet, wallets, alreadyConnectedWallets, connectedChain };
    },
    methods: {
        changeAmount(byAmount) {
            if (this.amount + byAmount < 0) return;
            this.amount += byAmount;
        },
        async mintPass() {
            const wrongNetwork = this.checkCorrectNetwork();
            if (wrongNetwork) return;
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
        },
        checkEligibility() {
            const validAddress = ethers.isAddress(this.walletAddress);
            if (!validAddress) {
                toast.error("Not a valid wallet address!", {
                    autoClose: 7000,
                    position: toast.POSITION.TOP_CENTER,
                    pauseOnHover: false,
                });
                return;
            }
            /*for (const [i, v] of merkleTree.entries()) {
                if (v[0] === this.walletAddress) {
                    this.eligible = true;
                    this.eligibilityChecked = true;
                    return;
                }
            }*/
            this.eligible = false;
            this.eligibilityChecked = true;
        },
        checkCorrectNetwork() {
            if (this.connectedWallet) {
                if (this.connectedChain.id !== mainChainIdHex) {
                    toast.warning(changeNetwork, {
                        autoClose: 7000,
                        position: toast.POSITION.TOP_CENTER,
                        pauseOnHover: false,
                        closeOnClick: false,
                    });
                    return true;
                }
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