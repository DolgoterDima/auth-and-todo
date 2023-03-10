<template>
  <div class="todo" :class="isActive && 'todo--active'">
    <span class="todo__title">{{ title }}</span>

    <button @click="addToFavorite()" class="todo__button">
      <font-awesome-icon icon="fa-solid fa-star" v-if="isFavorite" />
      <font-awesome-icon icon="fa-regular fa-star" v-else />
    </button>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

library.add(fas, far);

export default {
  name: "TodoComponent",
  props: {
    title: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number,
    },
  },
  components: {
    FontAwesomeIcon,
  },
  computed: {},
  methods: {
    addToFavorite() {
      this.$emit("addToFavorite", this.id);
    },
  },
};
</script>

<style scoped></style>
