import axios from 'axios';
export const usersApi = {
    getUserByID() {
        return axios.get(`/auth/users/`);
    },

    login( params: any) {
        return axios.post(`/auth/login`, params);
    },
    
    register( params: any) {
        return axios.post(`/auth/register`, params);
    },
}