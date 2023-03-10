import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",

    component: () => import("../views/LoginPage.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    meta: { requiresAuth: true },

    component: () => import("../views/ProfileView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

const isAuthenticated = () => {
  return JSON.parse(localStorage.getItem("user"))?.id;
};
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      next({
        path: "/",
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
