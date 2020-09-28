<template>
  <main>
    <div class="d-flex flex-wrap">
      <router-link
        v-for="pad in padList"
        :to="pad.slug"
        :key="pad.slug"
        class="list-group-item align-center flex-grow-1 router-link-patch"
        :title="pad.isPasswordProtected ? 'Protégé par mot de passe' : false"
      >
        <i v-if="pad.isPasswordProtected" class="material-icons mr-2">lock</i>
        <span> {{ pad.slug }}</span>
      </router-link>
    </div>
  </main>
</template>

<script>
export default {
  data: function () {
    return {
      padList: [],
    };
  },
  mounted() {
    let socket = io((this.$devMode ? "localhost:8888" : "") + "/padList", { path: "/api" });
    socket.on("padList", (padList) => (this.padList = padList));
  },
  // Triggered after a virtual DOM re-render
  updated() {
    // Enable again all tooltips after each DOM re-render
    //:data-toggle="pad.isPasswordProtected ? 'tooltip' : false"
    //:data-placement="pad.isPasswordProtected ? 'bottom' : false"
    //$('"[data-toggle="tooltip"]"').tooltip();
  },
  beforeDestroy() {},
};
</script>

<style lang="scss" scoped>
main {
  height: 100%;
}

.align-center {
  display: inline-flex;
  vertical-align: middle;
  align-items: center;
  justify-content: center;
}

.router-link-patch {
  color: inherit;

  &:hover {
    text-decoration: none !important;

    span {
      text-decoration: underline;
    }
  }
}
</style>
