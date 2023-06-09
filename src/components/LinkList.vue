<template>
    <div class="header-btn">
        <v-btn class="manage-btn" color="normal" variant="outlined" @click="setLinkEdit">{{ isEdit ? '取消管理' : '管理' }}</v-btn>
        <v-btn variant="outlined" @click="() => handleShowAdd()">添加</v-btn>
    </div>

    <search-bar @change="getLinkList" />
    <div class="link-list">
        <v-virtual-scroll
            :items="linkList"
            :height="listHeight"
            item-height="160"
            @scroll="debounceScroll"
        >
            <template v-slot:default="{ item }">
                <link-item
                    :link="item"
                    :key="item.id"
                    :isEdit="isEdit"
                    :on-remove="deleteLink"
                    :on-check="checkLink"
                    :on-edit="() => handleShowAdd(item)"
                />
            </template>
            <template v-slot:empty>
                <v-alert type="warning">没有相关链接！</v-alert>
            </template>
        </v-virtual-scroll>
    </div>
    <div v-if="isEdit" class="footer-btn">
        <v-btn color="normal" @click.stop="() => deleteLink(selectIds.join(','))">删除</v-btn>
    </div>
    <v-dialog
        v-model="showAddOrEdit"
        width="600"
        >
        <v-card>
            <v-card-title>
            <span class="text-h5">{{  editLink ? '编辑链接' : '新增链接'  }}</span>
            </v-card-title>
            <v-card-text>
                <edit-link-form :link="editLink" :on-submit="saveLink" />
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { request } from '@/utils/axios';
import LinkItem from './LinkItem.vue';
import type { Link, LinkList, Pagination } from '@/utils/type';
import EditLinkForm from './EditLinkForm.vue'
import SearchBar from './SearchBar.vue'
import { debounce } from 'lodash';

const isEdit = ref<boolean>(false)
const showAddOrEdit = ref<boolean>(false)
const selectIds = ref<Array<number>>([])
const linkList = ref<LinkList>([])
const editLink = ref<Link | undefined>(undefined)
const listHeight = ref<number | string>(window.innerHeight)
const searchParams = ref({})
const paginaton = reactive<Pagination>({
    pageNo: 1,
    pageSize: 10
    // total: 0
})

const checkLink = (link: Link) => {
    const index = selectIds.value.indexOf(link.id)
    if (index > -1) {
        selectIds.value.splice(index, 1)
    } else {
        selectIds.value.push(link.id)
    }
}

const setLinkEdit = () => {
    selectIds.value = []
    isEdit.value = !isEdit.value
}

const deleteLink = async (ids: string) => {
    if (!ids) return
    const res = await request({
        method: 'DELETE',
        url: '/link/' + ids
    })
    if (res.data.count > 0) {
        linkList.value = linkList.value.filter(link => !ids.includes(link.id + ''))
    }
}

const getLinkList = async (params: any = null, concat: boolean = false) => {
    // 设置列表高度
    if (params) {
        paginaton.pageNo = 1
        // paginaton.total = 0
        searchParams.value = {...params}
    }
    const res = await request({
        method: 'post',
        url: '/link/search',
        data: {
            ...searchParams.value,
            ...paginaton
        }
    })
    linkList.value = concat ? linkList.value.concat(res.data) : res.data
    nextTick(() => {
        // 10条但没出现滚动条无法触发滚送事件加载下一页时，手动加在下一页
        const scrollEl: Element = document.querySelector('.link-list .v-virtual-scroll') as Element
        if (scrollEl.clientHeight === scrollEl.scrollHeight && linkList.value.length === paginaton.pageNo * paginaton.pageSize) {
            paginaton.pageNo ++
            getLinkList(null, true)
        }
    })
}

const handleShowAdd = (link: Link | undefined = undefined) => {
    showAddOrEdit.value = true
    editLink.value = link
}

const saveLink = async(link: Link) => {
    await request({
        url: '/link/' + (link.id || ''),
        method: 'POST',
        data: link,
    })
    showAddOrEdit.value = false
    getLinkList()
}

// const loadList = ({ done }: { done: any}) => {
//     setTimeout(() => {
//         console.log('===empty')
//         done('empty')
//     }, 1000)
// }

const debounceScroll = debounce(() => {
    const scrollEl: Element = document.querySelector('.link-list .v-virtual-scroll') as Element
    console.log('===scroll', scrollEl?.scrollHeight, scrollEl?.scrollTop, scrollEl?.clientHeight)
    if (scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight < 100) {
        // 滚到最下后又滚上来再滚下去不再调用
        if (linkList.value.length >= (paginaton.pageNo - 1) * paginaton.pageSize && linkList.value.length < paginaton.pageNo * paginaton.pageSize) return
        paginaton.pageNo ++
        getLinkList(null, true)
    }
}, 100)

getLinkList()
</script>

<style scoped lang="scss">
.header-btn {
    margin-bottom: 20px;
    .v-btn {
        margin-right: 20px;
    }
}

.footer-btn {
    background-color: #d2cfcc;
    border-radius: 5px 5px 0 0;
    padding: 10px 20px;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
}
</style>