import axios from 'axios';
export const categoryApi = {
    getCategoryById(categoryId: string) {
        return axios.get(`/categories/${categoryId}`);
    },

    updateCategory(categoryId: string, params: any) {
        return axios.put(`/categories/${categoryId}`,  params );
    },

    deleteCategory(categoryId: string) {
        return axios.delete(`/categories/${categoryId}`);
    },

    getCategories() {
        return axios.get(`/categories`);
    },

    addCategory( params: any) {
        return axios.post(`/categories`, params );
    },

    addItemToCategory(categoryId: string, params: any) {
        
        console.log("----------",categoryId,params)
        return axios.post(`/categories/${categoryId}/items`, params);
    },
}