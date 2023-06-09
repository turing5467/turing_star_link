<template>
    <div class="item-box">
        <v-checkbox
            v-if="isEdit"
            v-model="checked"
            color="success"
            value="link.id"
            hide-details
            @click="() => onCheck(link)"
        ></v-checkbox>
        <a class="link-item" :href="link.url" target="_blank">
            <div class="link-item-info">
                <div class="link-item-title">{{ link.title }}</div>
                <div class="link-item-description">{{ link.description }}</div>
                <div v-if="link.tagIds">
                    <tag-item v-for="id in link.tagIds.split(',')" :tagId="Number(id)" :key="id" />
                </div>
                <star-rate v-if="link.likeDegree > 0" :id="link.id" :value="link.likeDegree" disabled size="small"></star-rate>
            </div>
            <div class="right-box">
                <v-icon
                    @click.stop.prevent="onEdit(link)"
                    icon="mdi:mdi-pencil"
                    color="primary"
                ></v-icon>
                <img class="link-item-thumb" v-if="!!link.thumb" :src="link.thumb" alt="">
            </div>
        </a>
        <div class="minus-box" v-if="isEdit">
            <v-icon
                @click="deleteLink"
                icon="mdi:mdi-minus-circle"
                color="error"
            ></v-icon>
        </div>
    </div>
</template>
<script setup lang="ts">
    import TagItem from './TagItem.vue';
    import StarRate from './StarRate.vue';
    const props = defineProps({
        link: {
            type: Object,
            default: () => ({})
        },
        isEdit: {
            type: Boolean,
            default: false
        },
        onRemove: {
            type: Function,
            default: () => ({})
        },
        onCheck: {
            type: Function,
            default: () => ({})
        },
        onEdit: {
            type: Function,
            default: () => ({})
        }
    })
    const { link, isEdit, onRemove, onCheck, onEdit } = toRefs(props)

    const checked = ref<boolean>(false)

    const deleteLink = () => {
        onRemove.value(link.value.id)
    }
</script>
<style scoped lang="scss">
    .link-item {
        position: relative;
        display: flex;
        width: 100%;
        height: 160px;
        cursor: pointer;
        padding: 20px;
        border-bottom: 1px solid rgb(228 230 235 / 50%);
        background-color: #fff;
        &:hover {
            background-color: #fafafa;
            .right-box {
                .v-icon {
                    visibility: visible;
                }
            }
        }
    }
    .link-item-info {
        flex: 1;
    }
    .link-item-title {
        font-weight: 700;
        font-size: 16px;
        line-height: 24px;
        color: #1d2129;
        margin-bottom: 8px;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
    }
    .link-item-description {
        height: 44px;
        font-weight: 400;
        font-size: 13px;
        line-height: 22px;
        color: #86909c;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }
    .right-box {
        width: 140px;
        display: flex;
        flex-wrap: wrap;
        margin-left: 24px;
        .v-icon {
            visibility: hidden;
            flex: 1;
        }
    }
    .link-item-thumb {
        width: 140px;
        max-height: 100px;
        border-radius: 2px;
    }
    .item-box {
        display: flex;
        align-items: center;
        .v-checkbox {
            margin-right: 10px;
        }
        .minus-box {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            height: 100%;
            width: 30px;
            margin-left: 10px;
        }
    }
    :deep(.v-chip) {
        margin-right: 5px;
    }
</style>