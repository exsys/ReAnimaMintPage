<template>
    <Header />
    <div class="pt-24">
        <mintPage />
        <section1 />
        <section2 />
    </div>
    <Footer />
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