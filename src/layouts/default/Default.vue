<template>
  <v-app>
    <default-bar v-if="showBar"/>

    <default-view />
  </v-app>
</template>

<script lang="ts" setup>
  import DefaultBar from './AppBar.vue'
  import DefaultView from './View.vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const showBar = computed(() => !route.path.includes('login'))
</script>
