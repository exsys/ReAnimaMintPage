<template>
    <Header />
    <div class="pt-24 h-full">
        <mintPage />
        <section1 />
        <section2 />
    </div>
</template>

<script>
import mintPage from "@/components/mint/mintPage";
import section1 from "@/components/mint/section1";
import section2 from "@/components/mint/section2";

export default {
    name: "index",
    components: {
        mintPage,
        section1,
        section2,
    },
}
</script>