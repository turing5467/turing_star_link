<template>
    <v-form ref="form">
        <v-text-field v-model="link.title" :rules="rules.title" label="标题 *" clearable required></v-text-field>
        <v-text-field v-model="link.url" :rules="rules.url" label="地址 *" clearable required></v-text-field>
        <v-text-field v-model="link.description" label="描述" clearable></v-text-field>
        <v-text-field v-model="link.thumb" label="缩略图地址" clearable></v-text-field>

        <v-select v-model="link.tagIds" :items="tagList" item-title="tagName"
    item-value="id" label="选择标签" clearable multiple></v-select>
        <v-checkbox v-model="link.hasRead" label="是否已读" color="success" hide-details></v-checkbox>
        <v-row align="center">
            <span>喜欢程度：</span>
            <star-rate v-model:value="link.likeDegree" clearable/>
        </v-row>
        <div class="d-flex flex-column">
            <v-btn color="success" class="mt-4" block @click="submit">
                提交
            </v-btn>
        </div>
    </v-form>
</template>
<script setup lang="ts">
import type { Link } from '@/utils/type';
import { useTagStore } from '@/store/tag';
import { storeToRefs } from 'pinia';
import StarRate from './StarRate.vue';
const { tagList } = storeToRefs(useTagStore())
// @ts-ignore
const { proxy } = getCurrentInstance()

const props = defineProps({
    link: {
        type: Object,
        default: null
    },
    onSubmit: {
        type: Function,
        default: () => ({})
    }
})

const { link: propLink } = toRefs(props)

const link = ref<Partial<Link>>({})
watch(propLink.value, val => {
    link.value = val ? {
        ...val, tagIds: Array.isArray(val.tagIds) ? val.tagIds : val.tagIds?.split(',').map(Number)
    } : {}
}, {
    deep: true,
    immediate: true
})
const rules = {
    title: [(v: string) => !!v || '标题必填'],
    url: [(v: string) => !!v || '地址必填'],
}

const submit = async () => {
    const { valid } = await proxy.$refs.form.validate()
    console.log('link', link);
    if (!valid) {
        return
    }
    props.onSubmit({
        ...link.value,
        tagIds: Array.isArray(link.value.tagIds) ? link.value.tagIds?.join(',') : link.value.tagIds
    })
}
</script>
<style scoped>
.v-row {
    margin: 0;
}
:deep(.v-checkbox .v-selection-control__input) {
    margin-left: -16px;
}
</style>