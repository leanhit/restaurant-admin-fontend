import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import { menuApi } from '@/api/menuApi';
import { categoryApi } from '@/api/categoryApi';
import { itemsApi } from "@/api/itemsApi";
import { ordersApi } from '@/api/ordersApi';
import { useI18n } from 'vue-i18n';
import { zonesApi } from '@/api/zonesApi';
import { tablesApi } from '@/api/tablesApi';
import { usersApi } from '@/api/usersApi';
import { viewModeEnum } from "@/until/constant";

export const useDataCategoryStore = defineStore("dataCategory", () => {
    const { t } = useI18n();
    const allItem = ref([]);
    const menu = ref([]);
    const currentCategory = ref([]);
    const pageStatus = reactive({
        currentCategoryId: "",
        viewMode: viewModeEnum.TABLEMODE,
        pageSize: 30,
        currentPage: 1,
        currentSortMode: ""
    });
    const currentOrder = reactive({
        isActivate: false,
        currentOrderDetail: ref({})
    });
    const orderOfTable = ref({});
    const zones = ref([]);
    const zone = ref({});
    const tables = ref([]);
    const currentZoneId = ref("");
    const allOrderList = ref({
        list: [],
        page: {}
    });
    const allOrderItem = ref([]);
    const orderPagePagination = ref({});
    const users = ref([]);

    const restaurantInfo = ref({
        name: "My Restaurant",
        sologan:"Have nice a day!",
        address:"68 Lucky St",
        email:"someemail@gmail.com",
        phone:""
    });

    
    async function getUsers() {
        try {
            const response = await usersApi.getUsers();
            if (response.status == 200) {
                users.value = response.data.content;
            } else {
                console.log('Error:', response.status);
            }
        } catch (err) {
            console.log('Error:', err);
        }
    }


    async function getAllOrderList(pagePagination: any) {
        try {
            const response = await ordersApi.getAllOrders(pagePagination);

            if (response.status == 200) {
                allOrderList.value.list = response.data.content;
                allOrderList.value.page = response.data.page;
            } else {
                console.log('Error:', response.status);
            }
        } catch (err) {
            console.log('Error:', err);
        }
    }

    async function getOrderItemByState(params: any) {
        try {
            const response = await ordersApi.getOrderItemByState(params);

            if (response.status == 200) {
                allOrderItem.value = response.data.content;
                orderPagePagination.value = response.data.page;

                allOrderItem.value.forEach(orderItem => {
                    //add item info
                    if (allItem.value.length > 0) {
                        allItem.value.forEach(item => {
                            if (orderItem.itemId === item.id) {
                                orderItem.photos = item.photos;
                                orderItem.name = item.name;
                            }
                        });
                    }

                    //add zone-table
                    if (zones.value.length > 0) {
                        zones.value.forEach(zone => {
                            zone.tables.forEach(table => {
                                if (orderItem.orderTableId === table.id) {
                                    orderItem.zoneName = zone.name;
                                    orderItem.tableName = table.name;
                                    orderItem.zoneTable = zone.name + " - " + table.name;
                                    return;
                                }
                            });
                        });

                    }
                });

            } else {
                console.log('Error:', response.status);
            }
        } catch (err) {
            console.log('Error:', err);
        }
    }

    async function getZones() {
        try {
            const response = await zonesApi.getZones();
            if (response.status == 200) {
                zones.value = response.data.content;
            } else {
                console.log('Error:', response.status);
            }
        } catch (err) {
            console.log('Error:', err);
        }
    }

    async function getZoneById(zoneId: string) {
        try {
            const response = await zonesApi.getZoneByID(zoneId);

            if (response.status == 200) {
                zone.value = response.data.content;
            } else {
                console.log('Error:', response.status);
            }
        } catch (err) {
            console.log('Error:', err);
        }
    }

    async function getTables(tableId: string) {
        try {
            const response = await tablesApi.getTableByID(tableId);

            if (response.status == 200) {
                tables.value = response.data.content;
            } else {
                console.log('Error:', response.status);
            }
        } catch (err) {
            console.log('Error:', err);
        }
    }

    async function getOrderOfTable(tableId: string) {
        try {
            const response = await ordersApi.getOrderOfTable(tableId);
            if (response.status == 200) {
                orderOfTable.value = response.data;
                orderOfTable.value?.items?.forEach(element => {
                    allItem.value.forEach(item => {
                        if (item.id === element.itemId) {
                            element.photos = item.photos;
                            element.name = item.name;
                            element.price = item.price;
                        }
                    })
                });
            } else {
                console.log('Error:', response.status);
            }
        } catch (err) {
            console.log('Error:', err);
        }
    }

    async function getMenu() {
        try {
            const response = await menuApi.getMenuAll();
            if (response.status == 200) {
                menu.value = response.data.categories;
            } else {
                console.log('Error:', response.status);
            }
        } catch (err) {
            console.log('Error:', err);
        }
    }

    async function getCategoryById(categoryId: string) {
        try {
            const response = await categoryApi.getCategoryById(categoryId);
            if (response.status == 200) {
                currentCategory.value = response.data.items;
            } else {
                console.log('Error:', response.status);
            }
        } catch (err) {
            console.log('Error:', err);
        }
    }

    async function getAllItems(pagePagination: { page: number, size: number }) {
        try {
            const response = await itemsApi.getItems(pagePagination);
            if (response.status == 200) {
                allItem.value = response.data.content;
            } else {
                console.log('Error:', response.status);
            }
        } catch (err) {
            console.log('Error:', err);
        }
    }

    const setCurrentCategoryId = (id: string) => {
        pageStatus.currentCategoryId = id;
    }

    const setPageStatus = (status: any) => {
        pageStatus.currentCategoryId = status.currentCategoryId;
        pageStatus.currentPage = status.currentPage;
        pageStatus.pageSize = status.pageSize;
        pageStatus.currentSortMode = status.currentSortMode;
        pageStatus.viewMode = status.viewMode;
    }

    const setCurrentZoneId = (id: string) => {
        currentZoneId.value = id;
    }

    const setActivateOrder = (order: any, status: boolean) => {
        currentOrder.isActivate = status;
        currentOrder.currentOrderDetail = ref(order);
    }

    return {
        getMenu,
        menu,
        currentCategory,
        getCategoryById,
        allItem,
        getAllItems,
        setCurrentCategoryId,
        pageStatus,
        setPageStatus,
        orderOfTable,
        getOrderOfTable,
        currentOrder,
        setActivateOrder,
        getZones,
        zones,
        currentZoneId,
        setCurrentZoneId,
        getTables,
        tables,
        getZoneById,
        zone,
        allOrderList,
        getAllOrderList,
        allOrderItem,
        getOrderItemByState,
        orderPagePagination,
        restaurantInfo,
        getUsers,
        users
    };
});
