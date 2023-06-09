<!--
 * @Author: turing5467
 * @Date: 2023-03-17 10:47:17
 * @LastEditors: turing5467
 * @LastEditTime: 2023-05-29 14:36:12
 * @Description: 
-->
<template>
    <v-row justify="space-between" align="center">
      <div class="home" @click="goHome">
        <v-icon icon="mdi:mdi-call-split" color="#059669"/>
          Turing Star Link
      </div>
      <div class="flex">
        <router-link to="/tag">标签</router-link>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              variant="text"
              color="primary"
              v-bind="props"
            >
              {{ userInfo.userName }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item :key="0" :value="0" @click="logOut">退出登录</v-list-item>
          </v-list>
        </v-menu>
        <!-- <v-img v-if="userInfo.avatar" :src="userInfo.avatar" :width="24" :height="24"></v-img> -->
      </div>
      <v-snackbar
        v-model="snackbar"
        location="center"
      >
        <div class="text-subtitle-1 pb-2">顶号通知</div>
        <p>当前账号已在其它地方登陆，3秒后将自动跳转至登录页</p>
        <template v-slot:actions>
          <v-btn
            variant="text"
            @click="quit"
          >
            x
          </v-btn>
        </template>
      </v-snackbar>
    </v-row>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store/user'
  import { socket } from '@/utils/socket'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const goHome = () => {
    router.push('/')
  }
  const { userInfo, logOut } = useUserStore()
  const snackbar = ref<boolean>(false)
  socket?.on('forceLogOut', () => {
    // 被顶号
    snackbar.value = true
    setTimeout(() => {
      quit()
    }, 3000)
  })
  const quit = () => {
    // snackbar.value = false
    window.location.href = '/login'
  }
</script>

<style scoped lang="scss">
  .v-row {
    padding: 10px 20px;
    min-height: 68px;
    flex: unset;
  }
  .home {
    cursor: pointer;
  }
  .flex {
    display: flex;
    align-items: center;
    > a {
      padding: 11px;
      font-size: 14px;
      color: #101010;
      &:hover {
        color: $green;
      }
      &.router-link-active {
        border-bottom: 1px solid var(--green);
      }
    }
    .v-img {
      margin-left: 10px;
      border-radius: 50%;
    }
  }
</style>