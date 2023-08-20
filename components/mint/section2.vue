<template>
    <div class="h-screen">
        <div class="flex flex-col justify-end items-center lg:flex-row lg:justify-center 
        h-full w-4/5 xl:w-3/4 mx-auto gap-10">
            <div ref="target" class="fadeInFromLeft flex flex-col text-center mb-10 lg:text-left lg:max-w-[50%] xl:max-w-[35%]"
            :class="isVisible ? 'visible' : ''">
                <h1 class="text-4xl mb-6">Title</h1>
                <div>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate tenetur deleniti, repellat corrupti
                    molestiae commodi libero quam accusantium enim aperiam sunt fuga corporis unde sequi maiores expedita
                    voluptas aut sapiente?
                </div>
            </div>
            <div ref="target" class="fadeInFromRight w-[150%] sm:w-[90%] lg:w-[60%]" :class="isVisible ? 'visible' : ''">
                <img src="~/assets/images/group1.png" alt="anima" class="w-full">
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';

export default {
    name: "section2",
    setup() {
        const target = ref(null);
        const isVisible = ref(false);

        const { stop } = useIntersectionObserver(
            target,
            ([{ isIntersecting }], observerElement) => {
                isVisible.value = isIntersecting;
                if (isIntersecting) stop();
            },
            { threshold: 0.6 }
        );

        return { target, isVisible };
    },
    methods: {

    }
}
</script>