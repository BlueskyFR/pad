<template>
  <Password v-if="askForPassword" ref="password" @onPassword="onPassword" />
  <Editor
    v-else
    @onEditorReady="onEditorReady"
    @onInput="onInput"
    :code="code"
    :language="options.language"
    :lastDelta="lastDelta"
  />
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Editor from "@/components/Editor.vue";
import Password from "@/components/Password.vue";
import availableLanguages from "@/modeList.json";

/*const padTypes = {
  loading: 0,
  editor: 1,
  password: 2,
  url: 3,
  drawing: 4
};*/

export default {
  name: "Pad",
  props: {
    //slug: String
  },
  data: function () {
    return {
      askForPassword: false,
      socket: null,
      lastDelta: null,
      code: "",
      distantLanguage: "javascript", // Store the distant language to avoid sending it again
    };
  },
  computed: {
    ...mapState(["options", "showAdminTools"]),
  },
  methods: {
    ...mapMutations({
      setAdminToolsEnabled: "showAdminTools",
      setOption: "setOption",
    }),

    onEditorReady: function (editor) {
      console.log("Editor ready!");
    },
    onInput: function (delta, fulltext) {
      // the delta (a modification) has to be sent and then applied to all
      // the other clients in order for them to get the same document.
      // A check is made directly in the Editor component to avoid sending
      // the init data again.
      if (delta !== this.lastDelta) {
        this.socket.emit("update", delta, fulltext);
      }
    },
    onPassword: function (password) {
      if (password.trim()) this.socket.emit("password", password);
    },

    openSocketConnection() {
      this.socket = io((this.$devMode ? "localhost:8888" : "") + "/pads", {
        path: "/api",
        query: {
          slug: this.$route.params.slug,
        },
      });

      this.socket.on("init", (pad) => {
        if (pad.isPasswordProtected) this.askForPassword = true;
        else {
          this.code = pad.data;
          this.setLanguage(pad.language);
        }

        this.setAdminToolsEnabled(pad.enableAdminTools === true); // Convert potential undefined to false
      });

      this.socket.on("password", (response) => {
        if (response.isPasswordCorrect) {
          this.askForPassword = false;
          this.code = response.data;
          this.setLanguage(response.language);

          // This only applies when the admin password was specified before
          this.setAdminToolsEnabled(response.enableAdminTools === true); // Convert potential undefined to false
        } else this.$refs.password.warnInvalidPassword();
      });

      this.socket.on("update", (delta) => {
        this.lastDelta = delta;
      });

      this.socket.on("setLanguage", this.setLanguage);

      this.socket.on("setPasswordConfirmation", () => {
        this.setAdminToolsEnabled(false);
      });
    },

    setLanguage(language) {
      if (language) {
        this.distantLanguage = language;
        this.setOption({ language: language });
      }
    },
  },
  components: {
    Editor,
    Password,
  },
  mounted() {
    // TODO: check if the password view has to be shown first
    this.openSocketConnection();
  },
  watch: {
    "options.language": function (newLanguage) {
      if (newLanguage !== this.distantLanguage) this.socket.emit("setLanguage", newLanguage);
    },

    "options.password": function (newPassword) {
      if (newPassword && this.showAdminTools && this.socket != null) {
        this.socket.emit("setPassword", newPassword);
      }
    },

    $route(to /*, from*/) {
      //TODO: close previous connection and open a new one here
      // and update this.code
      if (this.socket) this.socket.close();
      this.askForPassword = false;
      this.code = "";
      this.lastDelta = null;
      this.openSocketConnection();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../scss/variables";

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
