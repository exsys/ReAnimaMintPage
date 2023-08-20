<template>
    <footer>
        <div class="flex justify-center items-center mt-32 lg:mt-0 lg:gap-16">
            <div class="w-[40%] lg:w-[15%]">
                <img src="~/assets/images/aien.png" alt="anima" class="w-full">
            </div>
            <div class="flex flex-col justify-center font-medium text-xl">
                <div>Join our Communities!</div>
                <div class="flex items-center justify-center lg:justify-start gap-3 mt-3">
                    <NuxtLink class="cursor-pointer h-fit" to="https://twitter.com/ReAnimaGame" target="_blank">
                        <img src="~/assets/icons/x-logo.svg" alt="X" class="w-8 hover:drop-shadow-purple-md">
                    </NuxtLink>
                    <NuxtLink class="cursor-pointer">
                        <img src="~/assets/icons/discord-logo.svg" alt="Discord" class="w-10 hover:drop-shadow-purple-md">
                    </NuxtLink>
                </div>
            </div>
        </div>
        <div class="flex lg:w-3/4 mx-auto p-10">
            © RE:Anima {{ currentYear }}
        </div>
    </footer>
</template>

<script>
export default {
    data() {
        return {
            currentYear: 2023
        }
    },
    mounted() {
        this.currentYear = new Date().getFullYear();
    },
    methods: {

    }
}
</script>