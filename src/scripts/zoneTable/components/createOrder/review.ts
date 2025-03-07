import { ref, reactive, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useDataCategoryStore } from '@/stores/dataCategory';
import { filterDataFunction, splitData } from "@/scripts/_baseScripts/search";
import { ordersApi } from "@/api/ordersApi";
import { useI18n } from 'vue-i18n';
import { statusEnum, allColorEnum, viewModeEnum, localCurrency } from '@/until/constant';
import moment from 'moment';


export default {
    props: ['viewSettings'],
    emits: ['onChangeView'],
    setup(props: any, context: any) {
        const { t } = useI18n();
        const categoryStore = useDataCategoryStore();
        const viewTitle = ref(t("Create Order"));
        const listItems = ref([]);
        const tempList = ref([]);
        const moneyType = ref(localCurrency);
        const isLoading = ref(false);
        const listItemsOrder = ref([]);
        const orderOfTable = ref({
        });
        const isMustPay = ref(false);
        const isReloadData = ref(true);
        const tableOrder = reactive({
            tableId: "",
            tableStatus: statusEnum.AVAILABLE,
            tableName: "",
            zoneName: "",
            orderId: ""
        });

        const pageStatus = reactive({
            currentCategoryId: "",
            viewMode: viewModeEnum.TABLEMODE,
            pageSize: 30,
            currentPage: 1,
            totalItems: 0,
            currentSortMode: ""
        });

        onMounted(() => {
            getAllItemsList();

            
            if (props.viewSettings.dataItem) {
                if (props.viewSettings.dataItem.isReadonly) {
                    viewTitle.value = `${t("Order of table: ")}${props.viewSettings.dataItem.zoneTable}`;
                    getOrderById(props.viewSettings.dataItem.id);
                } else {
                    tableOrder.tableId = props.viewSettings.dataItem.id;
                    tableOrder.tableName = props.viewSettings.dataItem.name;
                    tableOrder.tableStatus = props.viewSettings.dataItem.status;
                    tableOrder.zoneName = props.viewSettings.dataItem.zoneName;

                    viewTitle.value = `${t("Order of table: ")}${tableOrder.zoneName} - ${tableOrder.tableName}`;
                    getOrderOfTable(tableOrder.tableId);
                }
            }
        });

        async function getAllItemsList() {
            isLoading.value = true;
            await categoryStore.getAllItems({ page: 0, size: 9999 });

            isLoading.value = false;
        };

        const handleSizeChange = (itemsPerPage: number) => {
            pageStatus.pageSize = itemsPerPage;
            // categoryStore.setPageStatus(pageStatus);
            listItems.value = splitData(tempList.value, pageStatus);
        }

        const handleCurrentChange = (currentPage: number) => {
            pageStatus.currentPage = currentPage;
            // categoryStore.setPageStatus(pageStatus);
            listItems.value = splitData(tempList.value, pageStatus);
        }

        const cancelItemOrder = (item: any) => {
            if (item.state === statusEnum.NOTORDER) {
                let unorderItemCount = 0;
                //count 
                for (let i = 0; i < listItemsOrder.value.length; i++) {
                    if (listItemsOrder.value[i].state === statusEnum.NOTORDER) {
                        unorderItemCount++;
                    }
                }
                //remover from itemListOrder
                for (let i = 0; i < listItemsOrder.value.length; i++) {
                    if (listItemsOrder.value[i].id === item.id) {
                        listItemsOrder.value.splice(i, 1);
                        unorderItemCount--;
                    }
                }
                //reset from itemList
                for (let i = 0; i < listItems.value.length; i++) {
                    if (listItems.value[i].id === item.id) {
                        listItems.value[i].quantity = 0;
                        listItems.value[i].specifications = "";
                    }
                }

                if (unorderItemCount === 0) {
                    isReloadData.value = true;
                } else {
                    isReloadData.value = false;
                }
            } else {
                if (isReloadData.value) {
                    if (item.state === statusEnum.PENDING) {
                        ElMessageBox.confirm(
                            `${t("Are you sure to cancel this item?")}`, t('Confirm'), {
                            dangerouslyUseHTMLString: true,
                            confirmButtonText: t("Yes"),
                            cancelButtonText: t("No"),
                            type: 'warning',
                        })
                            .then(() => {
                                isLoading.value = true;
                                ordersApi
                                    .cancelItemInOrder(orderOfTable.value.id, item.id)
                                    .then((response: any) => {
                                        if (response.data) {
                                            reloadData();
                                            ElMessage({
                                                message: `${t('The order of this item has been cancelled ')}`,
                                                type: 'success',
                                            });
                                        } else {
                                            ElMessage.error(`Oops, ${response.message}`);
                                        }
                                        isLoading.value = false;
                                    })
                                    .catch((error) => {
                                        console.error(error);
                                        isLoading.value = false;
                                    });

                                isLoading.value = false;
                            })
                            .catch(() => {
                                // catch error
                            });
                    } else {
                        ElMessage({
                            message: `${t('You can only cancel a PENDING item')}`,
                            type: 'warning',
                        });
                    }
                } else {
                    ElMessage({
                        message: `${t('You must order all item before cancel')}`,
                        type: 'warning',
                    });
                }
            }
        }

        //get order of table
        async function getOrderOfTable(tableId: string) {
            await categoryStore.getOrderOfTable(tableId);
            orderOfTable.value = categoryStore.orderOfTable;

            tableOrder.orderId = orderOfTable.value.id;
            listItemsOrder.value = orderOfTable.value?.items;

            if (listItemsOrder.value && listItemsOrder.value.length > 0) {
                isMustPay.value = true;
            }
        }


        //get order by id
        async function getOrderById(orderId: string) {
            try {
                const response = await ordersApi.getOrderByID(orderId);
                if (response.status == 200) {
                    console.log("----------------",response.data)

                    // orderOfTable.value = response.data;
                    // orderOfTable.value.items.forEach(element => {
                    //     categoryStore.allItem.forEach(item => {
                    //         if (item.id === element.itemId) {
                    //             element.photos = item.photos;
                    //             element.name = item.name;
                    //             element.price = item.price;
                    //         }
                    //     })
                    // });
                } else {
                    console.log('Error:', response.status);
                }
            } catch (err) {
                console.log('Error:', err);
            }

            // await categoryStore.getOrd(orderId);
            // orderOfTable.value = categoryStore.orderOfTable;

            // tableOrder.orderId = orderOfTable.value.id;
            // listItemsOrder.value = orderOfTable.value?.items;

            // if (listItemsOrder.value && listItemsOrder.value.length > 0) {
            //     isMustPay.value = true;
            // }
        }

        const cancelOrder = () => {
            ElMessageBox.confirm(
                `${t("Are you sure to cancel this order?")}`, t('Confirm'), {
                dangerouslyUseHTMLString: true,
                confirmButtonText: t("Yes"),
                cancelButtonText: t("No"),
                type: 'warning',
            })
                .then(() => {
                    isLoading.value = true;
                    ordersApi
                        .cancelOrder(orderOfTable.value.id)
                        .then((response: any) => {
                            if (response.status === 204) {
                                ElMessage({
                                    message: `${t('The order of this table has been cancelled ')}`,
                                    type: 'success',
                                });

                                context.emit('onChangeView', {
                                    viewName: 'ListData',
                                    data: null,
                                });
                            } else {
                                ElMessage.error(`Oops, ${response.message}`);
                            }
                            isLoading.value = false;
                        })
                        .catch((error) => {
                            console.error(error);
                            isLoading.value = false;
                        });

                    isLoading.value = false;
                })
                .catch(() => {
                    // catch error
                });
        }

        const finishItemOrder = (item: any, state: string) => {
            isLoading.value = true;
            ordersApi
                .prepareOrderItem(item.id, { toState: state })
                .then((response: any) => {
                    if (response.data) {
                        ElMessage({
                            message: `${t('The order item has been ')}${t(state)}`,
                            type: 'success',
                        });
                        getOrderOfTable(tableOrder.tableId);
                    } else {
                        ElMessage.error(`Oops, ${response.message}`);
                    }
                    isLoading.value = false;
                })
                .catch((error) => {
                    console.error(error);
                    isLoading.value = false;
                });
            isLoading.value = false;
        }

        const reloadData = () => {
            getOrderOfTable(tableOrder.tableId);
        }

        const formatDateTime = (dateTime: Date) => {
            if (!dateTime) dateTime = new Date();
            return moment(dateTime).calendar(null, {
                sameDay: `[${t("Today")}] HH:mm:ss`,
                lastDay: `[${t("Yesterday")}] HH:mm:ss`,
                nextDay: `[${t("Tomorrow")}] HH:mm:ss`,
                lastWeek: 'DD/MM/YYYY HH:mm:ss',
                sameElse: 'DD/MM/YYYY HH:mm:ss',
            });
        }

        return {
            t,
            isLoading,
            isReloadData,
            getOrderOfTable,
            pageStatus,
            handleCurrentChange,
            handleSizeChange,
            moneyType,
            listItemsOrder,
            viewTitle,
            tableOrder,
            cancelOrder,
            reloadData,
            cancelItemOrder,
            statusEnum,
            allColorEnum,
            finishItemOrder,
            formatDateTime,
        };
    }
};
