import { ref, reactive, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useDataCategoryStore } from '@/stores/dataCategory';
import { filterDataFunction, splitData } from "@/scripts/_baseScripts/search";
import { defineAsyncComponent, nextTick } from 'vue';
import SkeletonBox from '@/components/SkeletonBox.vue';
import { ordersApi } from "@/api/ordersApi";
import { useI18n } from 'vue-i18n';
import { statusEnum, allColorEnum, viewModeEnum, viewNameEnum, preStepZTEnum, localCurrency } from '@/until/constant';
import moment from 'moment';


export default {
    components: {
        Plus: defineAsyncComponent({
            loader: () => import('@/views/zoneTable/components/createOrder/Plus.vue'),
            loadingComponent: SkeletonBox,
        }),
    },
    props: ['viewSettings'],
    emits: ['onChangeView'],
    setup(props: any, context: any) {
        const { t } = useI18n();
        const categoryStore = useDataCategoryStore();
        const viewTitle = ref(t("Create Order"));
        const moneyType = ref(localCurrency);
        const listItems = ref([]);
        const tempList = ref([]);
        const isLoading = ref(false);
        const listItemsOrder = ref([]);
        const isShowOrderItemModal = ref(false);
        const orderOfTable = ref({
        });
        const isMustPay = ref(false);
        const isReloadData = ref(true);

        const tableOrder = ref({});

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
                tableOrder.value = Object.assign({}, props.viewSettings.dataItem);
                tableOrder.value.preStep = [];
                if (tableOrder.value.flow) {
                    for (let i = 0; i < props.viewSettings.dataItem.preStep.length; i++) {
                        tableOrder.value.preStep.push(props.viewSettings.dataItem.preStep[i]);
                    }
                } else {
                    for (let i = 0; i < props.viewSettings.dataItem.preStep.length - 1; i++) {
                        tableOrder.value.preStep.push(props.viewSettings.dataItem.preStep[i]);
                    }
                }

                if (tableOrder.value.status === statusEnum.AVAILABLE) {
                    createOrder(tableOrder.value.tableId);
                } else if (tableOrder.value.status === statusEnum.OCCUPIED) {
                    getOrderOfTable(tableOrder.value.tableId);
                }
            }
            console.log("------",tableOrder.value)

            autoReload();
        });



        async function getAllItemsList() {
            await categoryStore.getAllItems({ page: 1, size: 9999 })
        }

        const autoReload = () => {
            setTimeout(() => {
                getOrderOfTable(tableOrder.value.tableId);
            }, 500);

            setInterval(() => {
                let isAutoReload = true;
                if (!listItemsOrder.value || listItemsOrder.value.length === 0) {
                    isAutoReload = false;
                } else {
                    let endState = 0;
                    for (let i = 0; i < listItemsOrder.value.length; i++) {
                        if (listItemsOrder.value[i].state === (
                            statusEnum.CANCELLED ||
                            statusEnum.REJECTED ||
                            statusEnum.DONE
                        )) {
                            endState++;
                        }
                    }
                    if (endState === listItemsOrder.value.length) {
                        isAutoReload = false;
                    }
                }

                if (isReloadData.value && isAutoReload) {
                    getOrderOfTable(tableOrder.value.tableId);
                    // ElMessage({
                    //     message: `${t('New data have been updated')}`,
                    //     type: 'success',
                    // });
                }
            }, 5000);
        }

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

            tableOrder.value.orderId = orderOfTable.value.id;
            tableOrder.value.createdDate = orderOfTable.value.createdDate;
            listItemsOrder.value = orderOfTable.value?.items;

            if (listItemsOrder.value && listItemsOrder.value.length > 0) {
                listItemsOrder.value.forEach(item => {
                    if (item.state === statusEnum.ACCEPTED || item.state === statusEnum.DONE || item.state === statusEnum.FINISHED) {
                        isMustPay.value = true;
                    }
                })

            }
        }

        const checkOut = () => {
            let isOk = true;
            let isPendingExits = false;
            listItemsOrder.value.forEach(item => {
                if (item.state === statusEnum.FINISHED || item.state === statusEnum.ACCEPTED) {
                    isOk = false;
                }

                if (item.state === statusEnum.PENDING) {
                    isPendingExits = true;
                }
            });

            //cancel pending item fist
            if (isPendingExits) {
                ElMessage({
                    message: `${t('You must CANCEL all PENDING item before check out')}`,
                    type: 'info',
                });
            } else {
                isOk = true;
                //if the are no DONE
                if (!isOk) {
                    ElMessageBox.confirm(
                        `${t("There are some item not DONE. Contiues?")}`, t('Confirm'), {
                        dangerouslyUseHTMLString: true,
                        confirmButtonText: t("Yes"),
                        cancelButtonText: t("No"),
                        type: 'warning',
                    })
                        .then(() => {
                            gotoCreateBill();
                        })
                        .catch(() => {
                        });
                } else {
                    gotoCreateBill();
                }

            }


        }

        //if and orderItem's state is ACCEPTED or DONE you'll get warning
        const gotoCreateBill = () => {
            listItemsOrder.value = [];
            tableOrder.value.orderId = orderOfTable.value.id;
            tableOrder.value.preStep.push(preStepZTEnum.CREATEORDER);
            tableOrder.value.flow = true;
            // console.log("=============",tableOrder.value)

            context.emit('onChangeView', {
                viewName: viewNameEnum.CONFIRM,
                data: tableOrder.value
            });
        }

        //when click to table have status is AVAILABLE, the order of this table is auto create
        function createOrder(tableId: string) {
            const data = { tableId: tableId };
            ordersApi
                .createOrder(data)
                .then((response: any) => {
                    if (response.data) {
                        ElMessage({
                            message: t('New order is created!'),
                            type: 'success',
                        });
                        orderOfTable.value.id = response.data.id;
                        orderOfTable.value.createdDate = response.data.createdDate;
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

        const cancelOrder = () => {
            if (!isMustPay.value) {
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
                                        viewName: viewNameEnum.LISTDATA,
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
            } else {
                ElMessage({
                    message: `${t('The order of this table can not be cancell!')}`,
                    type: 'info',
                });
            }
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
                        getOrderOfTable(tableOrder.value.tableId);
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

        const submitItemsOrderList = () => {
            isLoading.value = true;
            const data = [];
            listItemsOrder.value.forEach(element => {
                if (element.state === statusEnum.NOTORDER) {
                    data.push({
                        itemId: element.id,
                        quantity: element.quantity,
                        specifications: element.specifications
                    });
                }
            });
            ordersApi
                .addItemToOrder(orderOfTable.value.id, data)
                .then((response: any) => {
                    if (response.data) {
                        ElMessage({
                            message: `${t('The order of this table has been updated')}`,
                            type: 'success',
                        });
                        isReloadData.value = true;
                        viewTitle.value = t("Maintain Order");

                        reloadData();
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
            getOrderOfTable(tableOrder.value.tableId);
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

        const selectItems = (data: any) => {
            isShowOrderItemModal.value = false;
            if (data !== false) {
                listItemsOrder.value = data;
                isReloadData.value = false;
            } else {
                isReloadData.value = true;
            }
        }

        return {
            t,
            isLoading,
            getOrderOfTable,
            isShowOrderItemModal,
            pageStatus,
            handleCurrentChange,
            handleSizeChange,
            moneyType,
            isReloadData,
            listItemsOrder,
            viewTitle,
            tableOrder,
            cancelOrder,
            submitItemsOrderList,
            isMustPay,
            reloadData,
            cancelItemOrder,
            checkOut,
            statusEnum,
            allColorEnum,
            finishItemOrder,
            formatDateTime,
            viewModeEnum,
            selectItems
        };
    }
};
