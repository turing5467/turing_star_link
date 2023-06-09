<template>
  <div class="filter-bar">
    <!-- 时间/星数排序、标签筛选、标题搜索 -->
    <v-menu location="bottom">
      <template v-slot:activator="{ props }">
        <span class="sort-item" v-bind="props">{{ btnText }}</span>
      </template>
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index" @click="changeSort(item.value)">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <span class="sort-item" @click="showTag">筛选标签</span>

    <input type="text" placeholder="请输入标题/描述/url，回车搜索" @keyup.enter="changeSearch">
    <v-icon icon="fa:fas fa-search"></v-icon>
    <v-dialog v-model="tagDialog" scrollable width="500px">
      <v-card>
        <v-card-title>筛选标签</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          <div class="filter-type-box">
            <span>标签筛选方式：</span>
            <v-radio-group
              v-model="filterParams.tagFilterType"
              hide-details
              inline
            >
              <v-radio
                label="合并"
                :value="TAG_FILTER_TYPE.union"
              ></v-radio>
              <v-radio
                label="共有"
                :value="TAG_FILTER_TYPE.intersection"
              ></v-radio>
            </v-radio-group>
          </div>
          <div class="tag-group" v-for="tag in tagGroups" :key="tag.id">
            <v-checkbox prepend-icon="fas fa-list" :color="tag.color || 'primary'" v-model="filterParams.tagList"
              :label="tag.tagName" :value="tag.id" hide-details></v-checkbox>
            <div class="tag-child-list">
              <v-checkbox v-for="child in tag.children" :color="child.color || 'primary'" :key="child.id"
                v-model="filterParams.tagList" :label="child.tagName" :value="child.id" hide-details></v-checkbox>
            </div>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue-darken-1" variant="text" @click="tagDialog = false">
            取消
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="changeTag">
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <div v-if="filterParams.selectTag.length" class="select-tag-list">
    <tag-item v-for="id in filterParams.selectTag" show-close :on-close="() => deleteTag(id)" :key="id" :tag-id="id"></tag-item>
  </div>
</template>
<script setup lang="ts">
import TagItem from './TagItem.vue';
import { useTagStore } from '@/store/tag';
import { storeToRefs } from 'pinia';
import { TAG_FILTER_TYPE, SORT_TYPE } from '../utils/type';
const emits = defineEmits(['change'])
const { tagGroups } = storeToRefs(useTagStore())
const items = ref([
  { title: '添加时间降序', value: SORT_TYPE.timeDesc },
  { title: '添加时间升序', value: SORT_TYPE.timeAsc },
  { title: '星数降序', value: SORT_TYPE.starDesc },
  { title: '星数升序', value: SORT_TYPE.starAsc },
])
const filterParams = reactive({
  tagFilterType: TAG_FILTER_TYPE.union,
  sort: SORT_TYPE.timeDesc,
  search: '',
  tagList: [],
  selectTag: [],
  hasRead: undefined,
  site: undefined,
})

const changeSearch = (e: any) => {
  console.log(e.target.value)
  filterParams.search = e.target.value
  nextTick(() => {
    emits('change', searchParams.value)
  })
}

const searchParams = computed(() => {
  return {
    search: filterParams.search,
    tagFilterType: filterParams.tagFilterType || TAG_FILTER_TYPE.union,
    sort: filterParams.sort,
    tagIds: filterParams.selectTag.join(','),
    hasRead: filterParams.hasRead,
    site: filterParams.site,
  }
})

const tagDialog = ref(false)
const btnText = computed(() => items.value.find(item => item.value === filterParams.sort)?.title)

const changeSort = (value: number) => {
  filterParams.sort = value
  emits('change', searchParams.value)
}

const changeTag = () => {
  filterParams.selectTag = [...filterParams.tagList]
  tagDialog.value = false
  console.log('====filterParams', filterParams);
  emits('change', searchParams.value)
}

const showTag = () => {
  tagDialog.value = true
  filterParams.tagList = [...filterParams.selectTag]
}

const deleteTag = (tagId: number) => {
  const index = filterParams.selectTag.findIndex(id => tagId === id)
  filterParams.selectTag .splice(index, 1)
}
</script>

<style lang="scss" scoped>
.filter-bar {
  border-radius: 5px 5px 0 0;
  position: relative;
  padding-left: 15px;
  font-size: 14px;
  height: 36px;
  line-height: 36px;
  background: $shallowblue;

  .sort-item {
    cursor: pointer;
    margin-right: 15px;

    &:hover {
      color: $green;
    }
  }

  input {
    width: 230px;
    float: right;
    background: #fff;
    padding-left: 30px;

    +.v-icon {
      color: $blue;
      font-size: 16px;
      position: absolute;
      right: 208px;
      top: 10px;
    }
  }
}
.tag-group {
  position: relative;
  border-bottom: 1px solid $gray;

  :deep(.v-input__prepend) {
    position: absolute;
    margin-right: 5px;
    left: -15px;
    top: 4px;

    i {
      font-size: 16px;
    }
  }

  .tag-child-list {
    display: flex;
    flex-wrap: wrap;
  }
}
.select-tag-list {
  background: #fff;
  border-bottom: 1px solid $gray;
  :deep(.v-chip) {
    margin: 5px;
  }
}
.filter-type-box {
  display: flex;
  align-items: center;
}
</style>