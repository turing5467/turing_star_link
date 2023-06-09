<template>
    <div class="chat-div">
        <span v-for="(item, idx) in messageList" :key="idx" :class="{ 'chat-send': item.type, 'chat-receive': !item.type }">
            {{ item.data }}
        </span>
    </div>
    <div class="chat-input">
        <textarea v-model="inputMessage"></textarea>
        <button @click="send">send</button>
    </div>
</template>
  
<script setup lang="ts">
import io from 'socket.io-client'
import { reactive, ref } from "vue";
// import { message } from "../chat";
import { getToken } from './utils/cookie';

const client = io('http://127.0.0.1:3030', {
    extraHeaders: {
        authorization: getToken()
    }
}).connect();

const messageList = reactive([] as any[]);
client.on('message', (res: string) => {
    console.log('====data', res);
    messageList.push({ type: 0, data: res });
});

const inputMessage = ref('');
const send = () => {
    messageList.push({ type: 1, data: inputMessage.value });
    client.emit('message', inputMessage.value);
}
</script>
  
<style scoped lang="scss">
.chat-div {
    height: 500px;
    width: 500px;
    display: flex;
    flex-direction: column;
    border: solid 1px;
    overflow: auto;
}

.chat-input {
    width: 500px;
    display: flex;

    textarea {
        flex-grow: 1;
    }
}

.chat-send {
    text-align: right;
}

.chat-receive {
    text-align: left;
}
</style>