<template>
    <link href="https://db.onlinewebfonts.com/c/05b52ebc23e412e038a4fde8dae0e464?family=HelveticaNeue-BoldCond" rel="stylesheet">
    <div class="helvetica-font">
        <Header />
        <mintPage />
        <!-- <Footer /> -->
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

<style>
.helvetica-font {
    font-family: "HelveticaNeue-BoldCond";
}
</style>