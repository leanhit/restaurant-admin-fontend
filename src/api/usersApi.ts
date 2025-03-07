import axios from 'axios';
export const usersApi = {
    getUserByID(userId: string) {
        return axios.get(`/users/${userId}`);
    },

    updateUser( params: any) {
        return axios.put(`/users`, params);
    },

    deleteUser(userId: string) {
        return axios.delete(`/users/${userId}`);
    },

    getUsers() {
        return axios.get(`/users`);
    },

    createUser(params: any) {
        return axios.post(`/users`, params);
    },
}