<template>
  <div id="app" class="layout">
    <header class="header layout__header">
      <nav class="nav">
        <router-link to="/" class="nav__link">Home</router-link>
        <router-link to="/profile" class="nav__link">About</router-link>
      </nav>
    </header>
    <main class="layout__main">
      <router-view />
    </main>

    <footer class="footer layout__footer"></footer>
  </div>
</template>
