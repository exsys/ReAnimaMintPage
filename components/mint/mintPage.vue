<template>
    <div class="flex items-start min-h-screen max-h-full relative px-4 pt-32 lg:mt-0 lg:items-center bg-img-main">
        <div class="mint-container flex w-full md:w-[90%] lg:w-[65%] mt-24 xl:w-[50%] 2xl:w-[45%] md:mt-32 lg:mt-24 xl:mt-10 2xl:mt-28">
            <div class="flex flex-col items-center text-center py-10 lg:px-20 xl:px-12 2xl:px-20">
                <h1 class="text-5xl mb-8 font-medium hidden">Re: Anima Pass</h1>
                <h2 class="text-2xl uppercase tracking-wide leading-8 text-black-main opacity-50">
                    Your access pass to Re:Anima's fantastical realms of exploration and adventure
                </h2>
                <div v-if="!whitelistMintActive && !publicMintActive && !mintEnded && !walletHasMinted"
                    class="mt-8 flex flex-col w-full text-black-main">
                    <div class="mb-6">
                        <h3 class="text-4xl font-bold mb-2">Countdown</h3>
                        <div class="text-5xl font-bold">
                            {{ days.toString().padStart(2, "0") }} :
                            {{ hours.toString().padStart(2, "0") }} :
                            {{ minutes.toString().padStart(2, "0") }} :
                            {{ seconds.toString().padStart(2, "0") }}
                        </div>
                    </div>
                    <h3 class="text-2xl font-medium">Check eligibility</h3>
                    <div class="mt-4 text-2xl" :class="eligibilityChecked ? 'visible' : 'invisible'">
                        <div v-if="eligible" class="text-black-main opacity-50 text-2xl font-bold uppercase">
                            Congratulations! You are whitelisted
                        </div>
                        <div v-if="!eligible" class="text-black-main opacity-50 text-2xl font-bold uppercase">
                            Unfortunately, you are not whitelisted
                        </div>
                    </div>
                    <div class="flex flex-col w-full max-w-[400px] mx-auto">
                        <input v-model="walletAddress" type="text" name=""
                            class="my-6 px-3 py-2 outline-0 text-black rounded-md text-xl drop-shadow-lg">
                        <button class="main-button py-2 px-6 rounded-md text-white font-bold text-xl uppercase" 
                        @click="checkEligibility">
                            Check
                        </button>
                    </div>
                </div>
                <div v-if="whitelistMintActive && !mintEnded && !walletHasMinted" class="mt-10">
                    <div class="mb-16">
                        <h3 class="text-4xl font-bold mb-2 text-black-main">Time Left</h3>
                        <div class="text-5xl text-black-main font-bold">
                            {{ days.toString().padStart(2, "0") }} :
                            {{ hours.toString().padStart(2, "0") }} :
                            {{ minutes.toString().padStart(2, "0") }} :
                            {{ seconds.toString().padStart(2, "0") }}
                        </div>
                    </div>
                    <button class="mint-button whitelisted" @click="mintPass">
                        MINT
                    </button>
                </div>

                <div v-if="publicMintActive && !mintEnded && !walletHasMinted" class="mt-10">
                    <div class="mb-6">
                        <h3 class="text-3xl font-bold mb-2 text-black-main">Public Mint active</h3>
                    </div>
                    <button class="mint-button" @click="mintPass">
                        Mint
                    </button>
                </div>

                <div v-if="mintEnded && !walletHasMinted" class="mt-6">
                    <h2 class="text-5xl font-bold uppercase text-black-main">Mint has ended!</h2>
                </div>

                <div v-if="walletHasMinted" class="mt-8">
                    <div class="mb-10">
                        <h3 class="text-4xl font-bold mb-2 text-black-main">Time Left</h3>
                        <div class="text-5xl text-black-main font-bold">
                            {{ days.toString().padStart(2, "0") }} :
                            {{ hours.toString().padStart(2, "0") }} :
                            {{ minutes.toString().padStart(2, "0") }} :
                            {{ seconds.toString().padStart(2, "0") }}
                        </div>
                    </div>
                    <h2 class="text-3xl mb-8 font-medium text-black-main">You have minted!</h2>
                    <button class="mint-button" @click="mintPass">
                        Mint
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useOnboard } from '@web3-onboard/vue';
import { ethers } from 'ethers';
import { networkSettings, reAnimaPassContractAddress } from "@/data/constants";
import { reAnimaPassABI } from '@/data/abis';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import changeNetwork from "@/components/toastify/changeNetwork";

const chainIdHex = networkSettings.testnet.chainInfo.id; // TODO: change to mainnet
const viewOnlyProvider = new ethers.JsonRpcProvider(networkSettings.testnet.rpcUrl); // TODO: change to mainnet
const reAnimaViewOnlyContract = new ethers.Contract(reAnimaPassContractAddress.testnet, reAnimaPassABI, viewOnlyProvider); // TODO: change to mainnet
const amountMintedFilter = reAnimaViewOnlyContract.filters.Transfer(null, null);

export default {
    name: "mintPage",
    data() {
        return {
            maxAmount: 2222,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            whitelistStartTimestamp: 1694084400000,
            whitelistEndTimestamp: 1694106000000,
            timeLeftUntilWhitelistMint: 0,
            timeLeftUntilPublicMint: 0,
            whitelistMintActive: false,
            publicMintActive: false,
            mintEnded: false,
            walletHasMinted: false,
            eligible: false,
            eligibilityChecked: false,
            walletAddress: "",
            amountMinted: 0,
        }
    },
    watch: {
        timeLeftUntilWhitelistMint: {
            handler() {
                if (this.timeLeftUntilWhitelistMint > 0) {
                    setTimeout(() => {
                        this.updateTimeLeft();
                    }, 1000);
                }
            },
            immediate: true,
        },
        timeLeftUntilPublicMint: {
            handler() {
                if (this.timeLeftUntilPublicMint > 0) {
                    setTimeout(() => {
                        this.updateTimeLeft();
                    }, 1000);
                }
            },
            immediate: true,
        },
        connectedWallet: async function (newVal, oldVal) {
            if (newVal.accounts.length) {
                try {
                    const balance = Number(await reAnimaViewOnlyContract.balanceOf(this.connectedWallet.accounts[0].address));
                    if (balance > 0) this.walletHasMinted = true;
                } catch (error) {
                    console.log(error);
                }
            }
        }
    },
    setup() {
        const { connectedWallet, wallets, alreadyConnectedWallets, connectedChain } = useOnboard();
        return { connectedWallet, wallets, alreadyConnectedWallets, connectedChain };
    },
    async mounted() {
        // start timer and track token id if mint has startes
        if (Date.now() >= this.whitelistStartTimestamp && Date.now() < this.whitelistEndTimestamp) this.whitelistMintActive = true;
        if (Date.now() >= this.whitelistEndTimestamp) this.publicMintActive = true;
        this.updateTimeLeft();
        //await this.getInitalAmountMinted();
        //this.startTrackingLatestTokenId();
    },
    methods: {
        async mintPass() {
            //if (!whitelisted) return;
            const wrongNetwork = this.checkCorrectNetwork();
            if (wrongNetwork) return;
            if (this.connectedWallet) {
                const ethersProvider = new ethers.BrowserProvider(this.connectedWallet.provider);
                const signer = await ethersProvider.getSigner();
                const reAnimaPassContract = new ethers.Contract(reAnimaPassContractAddress.testnet, reAnimaPassABI, signer); // TODO: change to mainnet
                try {
                    const tx = await reAnimaPassContract.mint();
                    const balance = Number(await reAnimaViewOnlyContract.balanceOf(this.connectedWallet.accounts[0].address));
                    if (balance > 0) this.walletHasMinted = true;
                } catch (error) {
                    if (error.info.error.code === 4001) {
                        toast.error("User denied transaction!", {
                            autoClose: 7000,
                            position: toast.POSITION.TOP_CENTER,
                            pauseOnHover: false,
                        });
                        return;
                    }
                    if (error.info.error.code === -32603) {
                        toast.error("Not whitelisted!", {
                            autoClose: 7000,
                            position: toast.POSITION.TOP_CENTER,
                            pauseOnHover: false,
                        });
                        return;
                    }
                    toast.error("Something went wrong!", {
                        autoClose: 7000,
                        position: toast.POSITION.TOP_CENTER,
                        pauseOnHover: false,
                    });
                }
            } else {
                toast.warning("Connect your wallet!", {
                    autoClose: 7000,
                    position: toast.POSITION.TOP_CENTER,
                    pauseOnHover: false,
                });
            }
        },
        async checkEligibility() {
            const validAddress = ethers.isAddress(this.walletAddress);
            if (!validAddress) {
                toast.error("Not a valid wallet address!", {
                    autoClose: 7000,
                    position: toast.POSITION.TOP_CENTER,
                    pauseOnHover: false,
                });
                return;
            }
            try {
                this.eligible = await reAnimaViewOnlyContract.whiteList(this.walletAddress);
                this.eligibilityChecked = true;
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong", {
                    autoClose: 7000,
                    position: toast.POSITION.TOP_CENTER,
                    pauseOnHover: false,
                });
            }
        },
        async getInitalAmountMinted() {
            if (this.whitelistMintActive || this.publicMintActive) {
                // query blocks until we find one where a pass was minted
                try {
                    var currentBlock = await viewOnlyProvider.getBlockNumber();
                    var startBlock = currentBlock - 1000;
                    var endBlock = currentBlock;
                } catch (error) {
                    console.log(error);
                }

                let latestTransferEvent;
                while (!latestTransferEvent) {
                    try {
                        const transferEvents = await reAnimaViewOnlyContract.queryFilter(amountMintedFilter, startBlock, endBlock);
                        if (transferEvents.length) {
                            latestTransferEvent = transferEvents.slice(-1)[0];
                        } else {
                            startBlock -= 1000;
                            endBlock -= 1000;
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
                const latestTokenId = parseInt(latestTransferEvent.topics[3], 16);
                this.amountMinted = latestTokenId;
                if (latestTokenId >= this.maxAmount) this.mintEnded = true;
            }
        },
        startTrackingLatestTokenId() {
            if (this.whitelistMintActive || this.publicMintActive) {
                setTimeout(async () => {
                    try {
                        const currentBlock = await viewOnlyProvider.getBlockNumber();
                        const transferEvents = await reAnimaViewOnlyContract.queryFilter(amountMintedFilter, currentBlock - 1000);
                        if (transferEvents.length) {
                            const latestTransferEvent = transferEvents.slice(-1)[0];
                            const latestTokenId = parseInt(latestTransferEvent.topics[3], 16);
                            this.amountMinted = latestTokenId;
                            if (latestTokenId >= this.maxAmount) {
                                this.mintEnded = true;
                                return; // if all tokens have minted out tracking will stop
                            }
                        }
                        setTimeout(this.startTrackingLatestTokenId, 10000); // track token id every 10 seconds
                    } catch (error) {
                        console.log(error);
                    }
                }, 1000);
            }
        },
        checkCorrectNetwork() {
            if (this.connectedWallet) {
                if (this.connectedChain.id !== chainIdHex) {
                    toast.warning(changeNetwork, {
                        autoClose: 7000,
                        position: toast.POSITION.TOP_CENTER,
                        pauseOnHover: false,
                        closeOnClick: false,
                    });
                    return true;
                }
            }
        },
        updateTimeLeft() {
            const now = Date.now();
            let timeLeft = 0;
            if (!this.whitelistMintActive) {
                // timer for whitelist mint
                timeLeft = this.whitelistStartTimestamp - now;
                this.timeLeftUntilWhitelistMint = timeLeft;
            } else {
                // timer for public mint
                timeLeft = this.whitelistEndTimestamp - now;
                this.timeLeftUntilPublicMint = timeLeft;
            }

            if (timeLeft > 0) {
                this.days = Math.floor(timeLeft / 1000 / 60 / 60 / 24);
                this.hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                this.minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                this.seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            }
        },
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

.bg-img-main {
    background-image: url("/assets/images/bg-mint.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: unset;
}

@media (max-width: 480px) {
    .bg-img-main {
        background-image: url("/assets/images/bg-mint-sm.png");
        background-position: 13% 100%;
    }
}

@media ((width: 820px) and (height: 1180px)) or ((width: 768px) and (height: 1024px)) {
    .bg-img-main {
        background-position: 4% 100%;
    }
    .mint-container {
        margin-top: 16rem;
        width: 95%;
    }
}
@media (width: 912px) and (height: 1368px) {
    .bg-img-main {
        background-position: 6% 100%;
    }
    .mint-container {
        margin-top: 22rem;
        width: 99%;
    }
}
</style>