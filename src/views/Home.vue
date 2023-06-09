<template>
  <div class="link-container">
    <link-list />
  </div>
</template>

<script lang="ts" setup>
  import LinkList from '@/components/LinkList.vue'
  import { useTagStore } from '@/store/tag'
  useTagStore().getTagList()
</script>

<style scoped>
.link-container {
  height: 100%;
  padding: 20px;
}
</style>