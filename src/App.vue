<template>
  <router-view v-slot="{ Component }">
    <transition :enter-active-class="`animate__animated ${$route.meta.transition}`">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script lang="ts" setup>

</script>
