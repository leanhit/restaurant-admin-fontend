import axios from 'axios';
export const zonesApi = {
    getZoneByID(zoneId: string) {
        return axios.get(`/zones/${zoneId}`);
    },

    updateZone(zoneId: string, params: any) {
        return axios.put(`/zones/${zoneId}`, params);
    },

    deleteZone(zoneId: string) {
        return axios.delete(`/zones/${zoneId}`);
    },

    getZones() {
        return axios.get(`/zones`);
    },

    addZone( params: any) {
        return axios.post(`/zones`, params);
    },

    addTableToZone(zoneId: string, params: any) {
        return axios.post(`/zones/${zoneId}/tables`, params);
    },

}