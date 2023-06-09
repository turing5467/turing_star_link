<template>
    <div class="tag-list" >
        <v-card class="tag-group" v-for="group in tagGroups" :key="group.id">
            <template v-slot:title>
                <div class="tag-group-title">
                    <span :style="`color: ${group.color}`" >{{ group.tagName }}</span>
                    <v-icon @click="() => showEditTag(group)" icon="fas fa-edit" size="mini" color="#020305"></v-icon>
                </div>
            </template>

            <template v-slot:text>
                <div class="tag-child-container">
                    <v-btn prepend-icon="mdi:mdi-plus" size="small" @click="() => showEditTag({ parentId: group.id })">添加标签</v-btn>
                    <tag-item v-for="child in group.children" :key="child.id" :tag="child" show-close show-edit :on-close="deleteTag" :on-edit="showEditTag"></tag-item>
                </div>
            </template>
        </v-card>
    </div>
    <v-dialog
      v-model="showEdit"
      width="500px"
    >
    <v-card>
        <v-card-title>
          <span class="text-h5">编辑标签</span>
        </v-card-title>
        <v-card-text v-if="editGroup">
          <v-container>
            <v-row>
                <v-text-field
                  label="标签名称*"
                  v-model="editGroup.tagName"
                  required
                ></v-text-field>
                <v-messages :active="showErrorMsg" color="error" messages="请填写标签昵称"></v-messages>
            </v-row>
            <v-row>
                <v-text-field
                label="标签颜色"
                v-model="editGroup.color"
                placeholder="或直接输入标签颜色字符串"
                required
                ></v-text-field>
                <v-btn class="color-btn" @click="showColor = true" :color="editGroup.color ? editGroup.color : ''">{{ !editGroup.color ? '选择标签颜色' : '' }}</v-btn>
                <v-dialog
                    v-model="showColor"
                    width="auto"
                >
                    <v-color-picker
                        v-show="showColor"
                        v-model="editGroup.color"
                        :modes="['rgba']"
                    ></v-color-picker>

                </v-dialog>

            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="saveTagOrGeoup"
          >
            保存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
    import type { Tag } from '@/utils/type';
    import TagItem from '@/components/TagItem.vue'
    import { useTagStore } from '@/store/tag';
    import { request } from '@/utils/axios';
    import { storeToRefs } from 'pinia';
    const TagStore=  useTagStore();
    const { tagGroups } = storeToRefs(TagStore);

    const editGroup = ref<Partial<Tag> | null>(null)
    const showEdit = ref<boolean>(false)
    const showColor = ref<boolean>(false)
    const showErrorMsg = ref<boolean>(false)


    const showEditTag = (group: Partial<Tag>) => {
        showEdit.value = true;
        editGroup.value = {...group};
    }

    const saveTagOrGeoup = async() => {
        if (!editGroup.value?.tagName) {
            showErrorMsg.value = true;
            return
        }
        if (editGroup.value?.id) {
            await request({
                url: '/tag/' + editGroup.value?.id,
                method: 'PATCH',
                data: {
                    tagName: editGroup.value?.tagName,
                    color: editGroup.value?.color,
                }
            })
        } else {
            await request({
                url: '/tag',
                method: 'post',
                data: editGroup.value
            })
        }
        showEdit.value = false;
        TagStore.getTagList()
    }
    const deleteTag = (tag: Tag) => {
        request({
            method: 'delete',
            url: '/tag/' + tag.id
        })
        TagStore.getTagList()
    }
    !tagGroups.value.length && TagStore.getTagList()
</script>
<style scoped lang="scss">
    .tag-list {
        padding: 20px;
        display: flex;
        flex-wrap: wrap;
        :deep(.v-card-text) {
            padding-bottom: 10px;
        }
        .tag-group {
            width: calc((100% - 20px) / 2);
            margin-bottom: 20px;
            &:nth-child(even) {
                margin-left: 20px;
            }
        }
    }
    .color-btn {
        margin: 10px 0 0 10px;
    }
    .v-icon {
        cursor: pointer;
    }
    .tag-group-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
            line-height: 32px;
        }
    }
    :deep(.v-chip) {
        margin-right: 10px;
    }
    .tag-child-container {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .v-btn {
            margin-right: 10px;
        }
        .v-btn, .v-chip {
            margin-bottom: 10px;
        }
    }
</style>