<template>
  <div class="profile-page page">
    {{ userData.id }}
    <div class="profile-page__user-info user-info">
      <h1 class="user-info__title">{{ userData.name }}</h1>
      <div class="user-info__row">
        <span class="user-info__legend">Email: </span>
        <span class="user-info__value"> {{ userData.email }}</span>
      </div>

      <div class="user-info__row">
        <span class="user-info__legend">Address: </span>
        <span class="user-info__value">
          {{ userData.address?.street }}, {{ userData.address?.city }},
          {{ userData.address?.zipcode }}</span
        >
      </div>

      <div class="user-info__row">
        <span class="user-info__legend">Phone</span>
        <span class="user-info__value">{{ userData.phone }}</span>
      </div>
      <div class="user-info__row">
        <span class="user-info__legend">Website</span>
        <span class="user-info__value">{{ userData.website }}</span>
      </div>

      <div class="user-info__row">
        <span class="user-info__legend">Company</span>
        <span class="user-info__value"
          >{{ userData.company?.name }} "{{
            userData.company?.catchPhrase
          }}"</span
        >
      </div>
    </div>

    <div class="profile-page__sorts-row">
      <select name="" id="" @change="onStatusChange">
        <option :value="selectDictionary.All">
          {{ selectDictionary.All }}
        </option>
        <option :value="selectDictionary.Completed">
          {{ selectDictionary.Completed }}
        </option>
        <option :value="selectDictionary.Uncompleted">
          {{ selectDictionary.Uncompleted }}
        </option>
        <option :value="selectDictionary.Favorites">
          {{ selectDictionary.Favorites }}
        </option>
      </select>

      <select name="" id="" @change="onStatusChange">
        <option value="">All</option>
        <option :value="userId" v-for="userId in usersIds" :key="userId">
          {{ userId }}
        </option>
      </select>
    </div>
    <div class="profile-page__todos todos">
      <TodoComponent
        class="todos__item"
        v-for="{ title, completed, favorite, id } in dataTodosToShow"
        :key="id"
        :id="id"
        :title="title"
        :is-active="completed"
        :is-favorite="favorite"
        @addToFavorite="addTodoToFavorite"
      />
    </div>
  </div>
</template>

<script>
import TodoComponent from "@/components/TodoComponent.vue";

export default {
  name: "ProfileView",
  components: { TodoComponent },
  data() {
    return {
      userData: {},
      allTodos: [],
      selectStatus: "",
      showTodosByUserId: "",

      todosDataToShow:[]
    };
  },
  computed: {
    selectDictionary() {
      return {
        All: "All",
        Completed: "Completed",
        Uncompleted: "Uncompleted",
        Favorites: "Favorites",
        UserId: this.userData.id,
        AllUsers: "AllUsers",
      };
    },
    dataTodosToShow() {

      if (this.showTodosByUserId) {

        return  this.arraySelectedStatus.filter(
            (item) => item.userId === this.showTodosByUserId
          )

      }
      return this.arraySelectedStatus;
    },


    arraySelectedStatus() {
      switch (this.selectStatus) {
        case this.selectDictionary.Completed:
          return this.todosDataToShow =this.allTodos.filter((item) => item.completed);

        case this.selectDictionary.Uncompleted:
          return this.allTodos.filter((item) => !item.completed);

        case this.selectDictionary.Favorites:

          return this.allTodos.filter((item) => item.favorite);

        default:
          return this.allTodos;
      }
    },
    usersIds() {
      return [...new Set(this.allTodos.map((item) => item.userId))];
    },
  },

  methods: {
    searchInTodos(){

    },
    addTodoToFavorite(id) {
      const userFavoritesList = localStorage.getItem("userFavorites")
        ? JSON.parse(localStorage.getItem("userFavorites"))
        : [];

      userFavoritesList.push(id);
      localStorage.setItem("userFavorites", JSON.stringify(userFavoritesList));

      this.allTodos = this.allTodos.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            favorite: true,
          };
        }
        return item;
      });
    },
    onStatusChange(e) {
      if (!isNaN(e.target.value)) {
         this.showTodosByUserId = +e.target.value;
      }
      this.selectStatus = this.selectDictionary[e.target.value];
    },
    fetchAllTodos() {
      fetch("https://jsonplaceholder.typicode.com/todos")
        .then((response) => response.json())
        .then((json) => {
          this.allTodos = json.map((item) => {
            return {
              ...item,
              favorite: false,
            };
          });
        })

        .catch((error) => console.log(error));
    },
  },
  mounted() {
    this.userData = JSON.parse(localStorage.getItem("user"));
    this.fetchAllTodos();
  },
};
</script>
