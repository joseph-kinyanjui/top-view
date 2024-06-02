<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { computed, ref, reactive, onMounted } from 'vue'

const isMenuActive = ref(false)

const toggleMenu = () => {
  isMenuActive.value = !isMenuActive.value
}

</script>

<template>
  <header>
    <div class="logo_wrap">
      <RouterLink to="/" class="brand"><img alt="Vue logo" class="logo" src="/logo-bg.png" width="250" height="250" />
      </RouterLink>
    </div>

    <div class="nav-wrapper">
      <nav class="navbar">
        <div class="navbar-brand">
          <button @click="toggleMenu" class="hamburger">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </button>
        </div>
        <div :class="['navbar-menu', { 'is-active': isMenuActive }]">
          <RouterLink to="/" class="nav-item" @click="toggleMenu">Home</RouterLink>
          <RouterLink to="/properties" class="nav-item" @click="toggleMenu">Properties</RouterLink>
          <RouterLink to="/tenants" class="nav-item" @click="toggleMenu">Tenants</RouterLink>
        </div>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.nav-wrapper {
  flex: 1;
  height: 100%;
  display: flex;
  right: 5em;
  align-items: center;
  justify-content: flex-end;
  padding-right: 5%;
}

.navbar {
  display: flex;
  justify-content: right;
  align-items: center;
  padding: 1rem;
}

.navbar-brand {
  display: flex;
  align-items: center;
  background: none;
}

.brand {
  font-size: 1.5rem;
  color: white;
  text-decoration: none;
  margin-right: 1rem;
}

.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
  padding: 0.5em;
  border-radius: 0.5em;
}

.hamburger .bar {
  width: 3.5em;
  height: 0.55em;
  background-image: linear-gradient(to right bottom, rgb(5, 25, 55, 0.85), rgb(18, 52, 97, 0.85), rgb(29, 82, 143, 0.85), rgb(36, 115, 192, 0.85), rgb(33, 150, 243, 0.85)) !important;
  margin: 0.33em 0;
  border-radius: 1em;
}

.navbar-menu {
  display: flex;
}

.nav-item {
  margin-left: 1rem;
  text-decoration: none;
  color: rgb(15, 0, 23);
  font-weight: bold;
  font-size: larger;
}

.nav-item:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .hamburger {
    display: flex;
    padding: 0.75em;
  }

  .navbar-menu {
    display: none;
    flex-direction: column;
    width: 30%;
    position: absolute;
    top: 19%;
    right: 2.33em;
    z-index: 3;
    background: rgba(255, 255, 255, 0.75);
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .navbar-menu.is-active {
    display: flex;
  }

  .nav-item {
    margin: 0.33em 0;
    text-align: center;
    margin-left: 1rem;
    text-decoration: none;
    color: rgb(15, 0, 23);
    font-weight: bold;
    font-size: large;
  }

}

.logo_wrap {
  display: flex;
  align-items: flex-start;
  flex: 1;
}

.wrapper {
  flex: 1;
}

.logo {
  display: block;
}

@media screen and (max-width: 768px) {
  .hamburger .bar {
    width: 2.5em;
    height: 0.5em;
    background-image: linear-gradient(to right bottom, rgb(5, 25, 55, 0.85), rgb(18, 52, 97, 0.85), rgb(29, 82, 143, 0.85), rgb(36, 115, 192, 0.85), rgb(33, 150, 243, 0.85)) !important;
    margin: 0.13em 0;
    border-radius: 1em;
  }
}

/*
nav {
  width: 100%;
  text-align: center;
}

nav a.router-link-exact-active {
  color: rgb(15,0,23);
  text-decoration: underline;
  text-decoration-color: rgb(15,0,23);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  font-size: 1.5em;
  font-weight: bold;
  border-left: 1px solid rgb(15,0,23);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {}*/
</style>
