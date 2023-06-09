<template>
    <v-chip
        v-if="tagItem"
        :key="tagItem.id"
        :color="tagItem.color || 'primary'"
        size="small"
        close-icon="mdi:mdi-delete"
        :closable="showClose"
        @click:close="onClose(tagItem)"
    >
    <v-icon v-if="showEdit" @click="onEdit(tagItem)" icon="mdi:mdi-pencil" size="small"></v-icon>
    {{ tagItem.tagName }}
</v-chip>
</template>
<script setup lang="ts">
    import type { Tag, TagList } from '@/utils/type';
    import { useTagStore } from '@/store/tag'
    const props = defineProps({
        tagId: {
            type: Number,
            default: 0
        },
        tag: {
            type: Object,
            default: null
        },
        showClose: {
            type: Boolean,
            default: false
        },
        onClose: {
            type: Function,
            default: () => ({})
        },
        showEdit: {
            type: Boolean,
            default: false
        },
        onEdit: {
            type: Function,
            default: () => ({})
        },
    })

    const { tagId, tag, showEdit, showClose, onClose, onEdit } = toRefs(props)
    const tagList: TagList = useTagStore().tagList
    const tagItem = computed<Tag | undefined>(() => tag.value ? (tag.value as Tag) : tagList.find(tag => tag.id === tagId.value))

</script>
<style scoped lang="scss">
    :deep(.v-icon) {
        cursor: pointer;
    }
    .v-icon.mdi-pencil {
        margin-right: 5px;
    }
</style>