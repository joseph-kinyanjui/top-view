<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="logo_wrap">
      <img alt="Vue logo" class="logo" src="/logo-bg.png" width="300" height="300" />
    </div>

    <div class="wrapper">
      <nav>
        <RouterLink to="/">Properties</RouterLink>
        <RouterLink to="/tenants">Tenants</RouterLink>

      </nav>
    </div>
  </header>

  <RouterView/>
</template>

<style scoped>

header{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 7.5%;
  margin-right: 7.5%;
}

.logo_wrap{
  display: flex;
  align-items: flex-start;
  flex: 1;
}

.wrapper{
  flex: 1;
}

.logo{
  display: block;
}

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

@media (min-width: 1024px) {}
</style>
