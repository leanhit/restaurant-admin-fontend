import axios from 'axios';
export const menuApi = {
    getMenuAll() {
        return axios.get(`/menu`);
    }
}