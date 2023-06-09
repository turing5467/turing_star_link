import { defineStore } from 'pinia'
import { request } from '@/utils/axios'
import type { TagList } from '@/utils/type'


export const useTagStore = defineStore('tag', {
  state: () => ({
    tagList: [] as TagList
  }),
  getters: {
    tagGroups(): TagList {
      const list = this.tagList.filter(tag => !tag.parentId)
        list.forEach(tag => {
            tag.children = this.tagList.filter(tag_ => tag_.parentId === tag.id)
        })
      return list
    }
  },
  actions: {
    async getTagList() {
        const res = await request({
            url: '/tag'
        })
        this.tagList = res.data;
    }
  }
})
