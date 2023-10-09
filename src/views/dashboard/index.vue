<template>
  <div>
    <Card></Card>
    <Sale></Sale>
    <Observe></Observe>
  </div>
</template>

<script>
import Card from "@/views/dashboard/Card";
import Sale from "./Sale";
import Observe from "./Observe";

export default {
  name: "Dashboard",
  components: {
    Card,
    Sale,
    Observe,
  },
  mounted() {
    this.$store.dispatch("home/getDate");
    // this.$store.commit('home/get')
  },
  data() {
    return {};
  },

  methods: {},
};
</script>

<style lang="scss" scoped></style>
