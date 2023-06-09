import { defineStore } from 'pinia'
import { request } from '@/utils/axios'
import { UserInfo } from '@/utils/type'
import { connectSocket, disconnectSocket } from '@/utils/socket'

export const useUserStore = defineStore('user', {
  state: () => ({
    // 用户信息
    userInfo: {} as UserInfo
  }),
  actions: {
    async getUserInfo() {
        const res = await request({
            url: '/user/getInfo'
        })
        this.userInfo = res.data;
        connectSocket()
        return res.data
    },
    async logOut() {
      disconnectSocket()
      await request({
        url: '/user/logout',
        method: 'POST'
      })
      window.location.href = '/login'
        // this.userInfo = res.data;
        // return res.data
    }
  }
})
