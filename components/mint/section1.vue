<template>
    <div class="h-full">
        <div class="flex flex-col-reverse justify-end items-center lg:flex-row lg:justify-center
            h-full w-4/5 xl:w-3/4 mx-auto gap-10">
            <div ref="target" class="fadeInFromLeft sm:w-[70%] lg:w-[40%] xl:mr-16" :class="isVisible ? 'visible' : ''">
                <img src="~/assets/images/isabell.png" alt="anima" class="w-full">
            </div>
            <div ref="target" class="fadeInFromRight flex flex-col text-center mb-10 lg:text-left lg:max-w-[50%] xl:max-w-[35%]"
            :class="isVisible ? 'visible' : ''">
                <h1 class="text-4xl mb-6">About RE:Anima</h1>
                <div>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corrupti quod fuga ab praesentium dolores
                    nulla
                    voluptatum harum minima iste quaerat repellendus earum debitis, eum eius, quos temporibus illum culpa
                    ex?
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';

export default {
    name: "section1",
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
}
</script>