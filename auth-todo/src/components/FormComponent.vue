<template>
  <ValidationObserver tag="div" v-slot="{ invalid, validated }">
    <form class="form" @submit.prevent="submitForm(!invalid, validated)">
      <div class="form__header">
        <span class="form__title">description</span>
      </div>
      <div class="form__body">
        <span class="form__subtitle">description</span>

        <ValidationProvider
          rules="username"
          v-slot="{ errors }"
          tag="label"
          class="form__label"
        >
          <input
            class="form__input input"
            :class="errors[0] && 'input__error'"
            placeholder="Username"
            v-model="form.username"
            type="text"
          />
          <span class="form__error" v-if="errors[0]">{{ errors[0] }}</span>
        </ValidationProvider>

        <ValidationProvider
          rules="phone"
          v-slot="{ errors }"
          tag="label"
          class="form__label"
        >
          <input
            class="form__input input"
            :class="errors[0] && 'input__error'"
            placeholder="Phone Number"
            v-model="form.phone"
            type="text"
          />
          <span class="form__error" v-if="errors[0]">{{ errors[0] }}</span>
        </ValidationProvider>

        <button
          type="submit"
          :disabled="invalid || !validated"
          class="form__button button"
          :class="(invalid || !validated) && 'button--disabled'"
        >
          Register
        </button>
        {{ errorMessage }}
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
export default {
  name: "FormComponent",
  data() {
    return {
      form: {
        username: "",
        phone: "",
      },
      userData: [],
      errorMessage: "",
    };
  },
  methods: {
    submitForm() {
      // submit was successfully

      this.fetchUsersData().then((data) => {
        this.userData =
          data.find(
            ({ username, phone }) =>
              username === this.form.username && phone === this.form.phone
          ) || [];

        if (this.userData) {
          localStorage.setItem("user", JSON.stringify(this.userData));
          this.$router.push("profile");

          this.errorMessage = "";
        } else {
          this.errorMessage = "No user by this login and phone";
        }
      });
    },
    async fetchUsersData() {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      return response.json();
    },
  },
  mounted() {},
};
</script>
