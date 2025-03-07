import axios from 'axios';
export const ordersApi = {
    getAllOrders(params:any) {
        const page = params.page;
        const size = params.size;
        return axios.get(`/orders?page=${page}&size=${size}`);
    },

    createOrder(params: any) {
        return axios.post(`/orders`, params);
    },

    addItemToOrder(orderId: string, params: any) {
        return axios.post(`/orders/${orderId}/item`, params);
    },

    getPrepareItemInOrder(orderId: string, itemId: string) {
        return axios.post(`/orders/${orderId}/item/${itemId}/prepare`);
    },

    cancelItemInOrder(orderId: string, itemId: string) {
        return axios.post(`/orders/${orderId}/item/${itemId}/cancel`);
    },

    checkoutOrder(orderId: string) {
        return axios.post(`/orders/${orderId}/checkout`);
    },

    cancelOrder(orderId: string) {
        return axios.post(`/orders/${orderId}/cancel`);
    },

    prepareOrderItem(itemId: string, params:any) {
        return axios.post(`/orders/item/${itemId}/prepare`, params);
    },

    getOrderByID(orderId: string) {
        return axios.get(`/orders/${orderId}`);
    },

    getOrderOfTable(tableId: string) {
        return axios.get(`/orders/table/${tableId}`);
    },

    getOrderItemByState(params: any) {
        const page = params.page;
        const size = params.size;
        const state = params.state;
        return axios.get(`/orders/items?state=${state}&page=${page}&size=${size}`);
    },
}