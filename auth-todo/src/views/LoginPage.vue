<template>
  <div class="page login-page">
    <FormComponent class="login-page__form" />
  </div>
</template>

<script>
import FormComponent from "@/components/FormComponent.vue";

export default {
  name: "LoginPage",
  components: {
    FormComponent,
  },
  methods: {
    fetchUsersData() {
      fetch("https://jsonplaceholder.typicode.com/users")
        .then((response) => response.json())
        .then((json) => {
          this.usersData = json;
        })
        .catch((error) => console.log(error));
    },
  },
  mounted() {
    this.fetchUsersData();
  },
};
</script>
