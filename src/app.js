import PadSettings from "@/components/PadSettings.vue";

export default {
  components: {
    PadSettings,
  },
  data: function () {
    return {
      // Using a global variable defined in vue.config.js
      padVersion: process.env.VUE_APP_VERSION.toString().slice(0, -2),
      padCount: 0,
    };
  },
  mounted() {
    let slug = $("#pad-slug");
    if (!this.$route.params.slug) slug.focus();

    // We are using a form to also handle the "enter" key press event
    $("#pad-form").submit((event) => {
      event.preventDefault();
      let value = "/" + slug.val().trim();
      if (!value) value = "/";
      if (value != this.$route.path) this.$router.push(value);
      slug.val("");
    });

    let socket = io((this.$devMode ? "localhost:8888" : "") + "/padCount", { path: "/api" });
    socket.on("padCountUpdate", (newPadCount) => (this.padCount = newPadCount));
  },
};
