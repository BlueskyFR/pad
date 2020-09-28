// Import Bootstrap JS
import "bootstrap";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

Vue.config.productionTip = false;

// Define a custom instance property to know if we are in dev mode
Vue.prototype.$devMode = process.env.NODE_ENV === "development";

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
