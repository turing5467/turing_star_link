<template>
    <v-form @submit.prevent="handleLogin">
        <v-container>
            <v-row justify="center">
                <v-col cols="6">
                    <v-text-field v-model="userForm.userName" label="用户名"
                        required></v-text-field>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col cols="6">
                    <v-text-field type="password" v-model="userForm.password" label="密码"
                        required></v-text-field>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col cols="6">
                    <v-btn type="submit" block class="mt-2">登陆</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>
<script setup lang="ts">
import { request } from '@/utils/axios'
import { setToken } from '../utils/cookie'
import { useRouter } from 'vue-router'
  const router = useRouter()

const userForm = reactive({
    userName: 'turing5467',
    password: 'turing12345.'
})

const handleLogin = async () => {
    const res = await request({
        url: 'user/login',
        method: 'POST',
        data: userForm
    })
    setToken(res.data)
    router.push('/')
}
</script>
<style scoped>
    .v-form {
        height: 100%;
        justify-content: center;
        display: flex;
        flex-direction: column;
    }
</style>