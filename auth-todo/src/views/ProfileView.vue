<template>
  <div class="profile-page page">
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
    <div class="profile-page__add-todo">
      <p class="profile-page__subtitle">Add new todo</p>
      <input
        type="text"
        class="profile-page__input input"
        v-model="newTodoTitle"
      />
      <button type="button" @click="addNewTodo" class="button">add todo</button>
    </div>

    <div class="profile-page__sorts-row">
      <input
        type="text"
        v-model="filterData.selectByTitle"
        class="input"
        placeholder="Search by title"
      />
      <select name="" id="" @change="onStatusChange" class="select">
        <option :value="selectDictionary.all" class="select__option">
          {{ selectDictionary.all }}
        </option>
        <option :value="selectDictionary.completed" class="select__option">
          {{ selectDictionary.completed }}
        </option>
        <option :value="selectDictionary.uncompleted" class="select__option">
          {{ selectDictionary.uncompleted }}
        </option>
        <option :value="selectDictionary.favorites" class="select__option">
          {{ selectDictionary.favorites }}
        </option>
      </select>

      <select name="" id="" @change="onIdChange" class="select">
        <option value="" class="select__option">All</option>
        <option
          :value="userId"
          v-for="userId in usersIds"
          :key="userId"
          class="select__option"
        >
          {{ userId }}
        </option>
      </select>
    </div>
    <div class="profile-page__todos todos">
      <TodoComponent
        class="todos__item"
        v-for="{ title, completed, favorite, id } in filteredItemsList"
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
const dictSelected = {
  all: "all",
  completed: "completed",
  uncompleted: "uncompleted",
  favorites: "favorites",
};
export default {
  name: "ProfileView",
  components: { TodoComponent },
  data() {
    return {
      userData: {},
      allTodos: [],
      newTodoTitle: "",

      filterData: {
        selectStatus: dictSelected.all,
        selectById: "",
        selectByTitle: "",
      },
    };
  },
  computed: {
    selectDictionary() {
      return dictSelected;
    },

    usersIds() {
      return [...new Set(this.allTodos.map((item) => item.userId))];
    },
    filteredItemsList() {
      const checkStatus = this.arraySelectedStatus();

      return this.allTodos.filter((item) => {
        return (
          checkStatus?.(item) &&
          this.filterById(item) &&
          this.filterByTitle(item)
        );
      });
    },
  },

  methods: {
    filterDoneItems(item, isReversed = false) {
      if (isReversed) {
        return !item.completed;
      }
      return !!item.completed;
    },

    filterFavoriteItems(item, isReversed = false) {
      if (isReversed) {
        return !item.favorite;
      }
      return !!item.favorite;
    },

    filterById(item) {
      if (!this.filterData.selectById) return true;

      return item.userId === this.filterData.selectById;
    },

    filterByTitle(item) {
      if (!this.filterData.selectByTitle) return true;

      return item.title.includes(this.filterData.selectByTitle);
    },

    arraySelectedStatus() {
      const dict = {
        completed: (item) => this.filterDoneItems(item),
        uncompleted: (item) => this.filterDoneItems(item, true),
        favorite: (item) => this.filterFavoriteItems(item),
        all: () => true,
      };

      if (!this.filterData.selectStatus) return dict.all;
      let result = "";

      switch (this.filterData.selectStatus) {
        case this.selectDictionary.completed:
          result = dict.completed;
          break;
        case this.selectDictionary.uncompleted:
          result = dict.uncompleted;
          break;
        case this.selectDictionary.favorites:
          result = dict.favorite;
          break;
        default:
          result = dict.all;
          break;
      }

      return result;
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
    onIdChange(e) {
      this.filterData.selectById = +e.target.value;
    },

    onStatusChange(e) {
      console.log(
        "this.filterData.selectStatus",
        this.selectDictionary[e.target.value],
        e.target.value
      );
      this.filterData.selectStatus = this.selectDictionary[e.target.value];
    },

    addNewTodo() {
      fetch("https://jsonplaceholder.typicode.com/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: this.newTodoTitle,
          completed: false,
          userId: this.userData.id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.allTodos.unshift({
            ...data,
            favorite: false,
          });
        })
        .catch((error) => console.error(error));
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
