import io, { Socket } from 'socket.io-client'
import { getToken } from './cookie';

let socket: Socket

const connectSocket = () => {
    socket = io('http://127.0.0.1:3030', {
        extraHeaders: {
            authorization: getToken() as string
        }
    }).connect();
}

const disconnectSocket = () => {
    socket.disconnect();
}



export {
    socket,
    connectSocket,
    disconnectSocket
}