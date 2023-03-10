import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/scss/index.scss";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

Vue.config.productionTip = false;

/* icons start */
Vue.component("font-awesome-icon", FontAwesomeIcon);

/* icons end */

/* vee validation start */

import { ValidationProvider, extend, ValidationObserver } from "vee-validate";

//  rules
extend("username", {
  validate: (value) => /^[a-zA-Z]+$/.test(value),
  message: "Only english letters",
});

extend("phone", {
  validate: (value) =>
    /^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]*$/.test(value),
  message: "Only numbers and symbols",
});

Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);

/* vee validation end */

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
