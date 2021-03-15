import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "@/views/login";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      title: "后台登录",
    },
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  routes
});

router.beforeEach(async (to, from, next) => {
  const adminToken = localStorage.adminToken;
  console.log(1111111, adminToken);
  if (to.path == "/login") {
    if (adminToken) {
      next("/");
    } else {
      next();
    }
  } else {
    // next();
    if (adminToken) {
      next();
    } else {
      next("/login");
    }
  }
});

export default router;
