import Cookies from 'js-cookie';

const TOKEN_KEY = 'Turing-Token';

export const getToken = () => Cookies.get(TOKEN_KEY);
export const setToken = (token: string) => Cookies.set(TOKEN_KEY, token);