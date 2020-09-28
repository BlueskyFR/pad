import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    showOptions: false, // Whether to show the options button or not
    showAdminTools: false,
    isPasswordProtected: false,
    options: {
      language: "javascript",
      password: "",
    },
  },
  mutations: {
    showOptions(state, value) {
      state.showOptions = value;
    },
    showAdminTools(state, value) {
      state.showAdminTools = value;
    },
    isPasswordProtected(state, value) {
      state.isPasswordProtected = value;
    },
    setOption(state, { language, password }) {
      if (language) state.options.language = language;
      if (password) state.options.password = password;
    },
  },
  actions: {},
});
