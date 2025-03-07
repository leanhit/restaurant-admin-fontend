import axios from 'axios';
export const itemsApi = {
    getItemByID(itemId: string) {
        return axios.get(`/items/${itemId}`);
    },

    updateItem(itemId: string, params: any) {
        return axios.put(`/items/${itemId}`, params);
    },

    deleteItem(itemId: string) {
        return axios.delete(`/items/${itemId}`);
    },

    getItems(params: any) {
        return axios.get(`/items`, params);
    },

    addItem(params: any) {
        return axios.post(`/items`, params);
    },


}