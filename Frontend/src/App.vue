<template>
    <div id="app">
      <book-inventory />
    </div>
  </template>
  
  <script>
  import BookInventory from './Home.vue';
  
  export default {
    name: 'App',
    components: {
      BookInventory
    }
  };
  </script>
  