import axios from 'axios';
export const tablesApi = {
    getTableByID(tableId: string) {
        return axios.get(`/tables/${tableId}`);
    },

    updateTable(tableId: string, params: any) {
        return axios.put(`/tables/${tableId}`,  params );
    },

    deleteTable(tableId: string) {
        return axios.delete(`/tables/${tableId}`);
    },

    getTables() {
        return axios.get(`/tables`);
    },

    addTable( params: any) {
        return axios.post(`/tables`, params );
    },


}