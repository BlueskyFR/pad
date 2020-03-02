import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import(/* webpackChunkName: "admin" */ "./views/Admin.vue")
    },
    {
      path: "/list",
      name: "list",
      component: () => import(/* webpackChunkName: "pad-list" */ "./views/PadList.vue")
    },
    {
      path: "/:slug",
      name: "pad",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "pad" */ "./views/Pad.vue")
    }
  ]
});
