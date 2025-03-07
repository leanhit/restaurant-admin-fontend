import { ref, reactive, watch, onMounted } from "vue";
import { filterDataFunction } from "@/scripts/_baseScripts/search";
import { useDataCategoryStore } from "@/stores/dataCategory";
import { ElMessage, ElMessageBox } from 'element-plus';
import { statusEnum } from "@/until/constant";
import { useI18n } from 'vue-i18n';
import { ordersApi } from "@/api/ordersApi";
import { allColorEnum } from "@/until/constant";

export default {
    props: ["viewSettings"],
    emits: ["onChangeView"],
    setup() {
        const { t } = useI18n();
        const categoryStore = useDataCategoryStore();
        const filterData = ref("");
        const filter = ref("");
        const listItems = ref([]);
        const isLoading = ref(false)
        const tempList = ref([]);
        const isAutoReload = ref(true);
        const selectedStatus = ref(statusEnum.PENDING);
        const isShowConfirmModal = ref(false);
        const confirmItem = ref({});
        const zones = ref({});
        const rejectReasonOptions = reactive([
            t("Out of ingredients"),
            t("Out of service"),
            t("Something else"),
        ]);

        const rejectReason = ref(rejectReasonOptions[0]);

        //pagination
        const pageStatus = reactive({
            pageSize: 30, //number items/page
            currentPage: 0,
            totalItems: 0,
            selectedStatus: statusEnum.PENDING
        });

        const statusOptions = ref({
            PENDING: statusEnum.PENDING,
            ACCEPTED: statusEnum.ACCEPTED
        })

        onMounted(() => {
            getAllItems();
            getListData();
            setInterval(() => {
                if (isAutoReload.value) {
                    getListData();
                }
                isAutoReload.value = false;
            }, 5000);
        });

        const addInfo_ = (orderItem: any) => {
            if (zones.value.length > 0) {
                zones.value.forEach(zone => {
                    zone.tables.forEach(table => {
                        if (orderItem.orderTableId === table.id) {
                            orderItem.zoneTable = zone.name + " - " + table.name;
                            return;
                        }
                    });
                });

            }
        }

        async function getAllItems() {
            await categoryStore.getAllItems({ page: 0, size: 9999 });                        

            await categoryStore.getZones();            
            zones.value = categoryStore.zones;            
        }


        async function getListData() {
            tempList.value = [];
            listItems.value = [];
            await categoryStore.getOrderItemByState({
                page: pageStatus.currentPage,
                size: pageStatus.pageSize,
                state: pageStatus.selectedStatus
            });

            tempList.value = categoryStore.allOrderItem;
            tempList.value.forEach(orderItem => {
                addInfo_(orderItem);
            });

            pageStatus.totalItems = categoryStore.orderPagePagination.totalElements;

            listItems.value = tempList.value;

        };

        watch(filterData, () => {
            listItems.value = filterDataFunction(filterData.value, tempList.value)
        });


        watch(selectedStatus, () => {
            pageStatus.selectedStatus = selectedStatus.value;
            getListData();
        });

        const switchState = () =>{
            if(selectedStatus.value === statusEnum.PENDING){
                selectedStatus.value = statusEnum.ACCEPTED;
            }else if(selectedStatus.value === statusEnum.ACCEPTED){
                selectedStatus.value = statusEnum.PENDING;
            }

        }


        const rejectItem_ = (isOK: boolean, item: any) => {
            isLoading.value = true;
            ordersApi
                .prepareOrderItem(item.id, { toState: statusEnum.REJECTED })
                .then((response: any) => {
                    if (response.data) {
                    } else {
                        isOK = false;
                    }
                })
                .catch((error) => {
                    console.error(error);
                    isOK = false;
                });

            isLoading.value = false;
        }

        const acceptItem_ = (isOk: boolean, item: any) => {
            isLoading.value = true;
            ordersApi
                .prepareOrderItem(item.id, { toState: statusEnum.ACCEPTED })
                .then((response: any) => {
                    if (response.data) {
                    } else {
                        isOk = false;
                    }
                })
                .catch((error) => {
                    console.error(error);
                    isOk = false;
                });
            isLoading.value = false;
        }

        const rejectItem = (item: any) => {
            confirmItem.value = item;
            isShowConfirmModal.value = !isShowConfirmModal.value;
        }

        const confirmRejectItem_ = (item: any) => {
            isLoading.value = true;
            ordersApi
                .prepareOrderItem(item.id, { toState: statusEnum.REJECTED })
                .then((response: any) => {
                    if (response.data) {
                        getListData();
                        ElMessage({
                            message: `${t('The order item has been  ')}${t(statusEnum.ACCEPTED)}`,
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
        }

        const finishItem_ = (isOk: boolean, item: any) => {
            isLoading.value = true;
            ordersApi
                .prepareOrderItem(item.id, { toState: statusEnum.FINISHED })
                .then((response: any) => {
                    if (response.data) {
                    } else {
                        isOk = false;
                    }
                })
                .catch((error) => {
                    console.error(error);
                    isOk = false;
                });
            isLoading.value = false;
        }

        const acceptItem = (item: any) => {
            isLoading.value = true;
            ordersApi
                .prepareOrderItem(item.id, { toState: statusEnum.ACCEPTED })
                .then((response: any) => {
                    if (response.data) {
                        getListData();
                        ElMessage({
                            message: `${t('The order item has been ')}${t(statusEnum.ACCEPTED)}`,
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
        }

        const rejectAllItem = () => {
            isShowConfirmModal.value = !isShowConfirmModal.value;
            confirmItem.value = {};
        }

        const rejectAllItem_ = () => {
            let isOK = true;
            isLoading.value = true;
            listItems.value.forEach(item => {
                item.specifications = rejectReason.value;
                rejectItem_(isOK, item);
            });

            setTimeout(() => {
                getListData();
            }, 500);
            if (isOK) {
                ElMessage({
                    message: `${t('All order item has been ')}${t(statusEnum.REJECTED)}`,
                    type: 'success',
                });
            } else {
                ElMessage.error(`Oops, ${t('Something went wrong')}`);
            }

            isLoading.value = false;
        }

        const acceptAllItem = () => {
            ElMessageBox.confirm(
                `${t("Are you sure to accept ALL this item?")}`, t('Confirm'), {
                dangerouslyUseHTMLString: true,
                confirmButtonText: t("Yes"),
                cancelButtonText: t("No"),
                type: 'warning',
            })
                .then(() => {
                    isLoading.value = true;
                    let isOk = true;
                    listItems.value.forEach(item => {
                        acceptItem_(isOk, item);
                    });

                    setTimeout(() => {
                        getListData();
                    }, 500);

                    if (isOk) {
                        ElMessage({
                            message: `${t('All order item has been ')}${t(statusEnum.ACCEPTED)}`,
                            type: 'success',
                        });
                        switchState();
                    } else {
                        ElMessage.error(`Oops, ${t('Something went wrong')}`);
                    }
                    isLoading.value = false;
                })
                .catch(() => {
                    // catch error
                });

        }

        const finishItem = (item: any) => {
            isLoading.value = true;
            ordersApi
                .prepareOrderItem(item.id, { toState: statusEnum.FINISHED })
                .then((response: any) => {
                    if (response.data) {
                        getListData();
                        ElMessage({
                            message: `${t('The order item has been ')}${t(statusEnum.FINISHED)}`,
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
        }

        const finishAllItem = () => {
            ElMessageBox.confirm(
                `${t("Are you sure to finish ALL this item?")}`, t('Confirm'), {
                dangerouslyUseHTMLString: true,
                confirmButtonText: t("Yes"),
                cancelButtonText: t("No"),
                type: 'warning',
            })
                .then(() => {
                    isLoading.value = true;
                    let isOk = true;
                    listItems.value.forEach(item => {
                        finishItem_(isOk, item);
                    });

                    setTimeout(() => {
                        getListData();
                    }, 500);
                    if (isOk) {
                        ElMessage({
                            message: `${t('All order item has been ')}${t(statusEnum.FINISHED)}`,
                            type: 'success',
                        });
                    } else {
                        ElMessage.error(`Oops, ${t('Something went wrong')}`);
                    }
                    isLoading.value = false;
                })
                .catch(() => {
                    // catch error
                });

        }

        const confirmFunction = () => {
            isShowConfirmModal.value = !isShowConfirmModal.value;
            if (confirmItem.value.id) {
                confirmItem.value.specifications = rejectReason.value;
                confirmRejectItem_(confirmItem.value);
                confirmItem.value = {};
            }
            else {
                rejectAllItem_()
            }
        }

        const handleSizeChange = (pageSize: number) => {
            pageStatus.pageSize = pageSize;
            getListData();
        }
        const handleCurrentChange = (pageIndex: number) => {
            pageStatus.currentPage = pageIndex;
            getListData();
        }

        const refreshDataFn = () => {
            getListData();
        }

        return {
            t,
            pageStatus,
            handleCurrentChange,
            handleSizeChange,
            isLoading,
            listItems,
            filterData,
            filter,
            isAutoReload,
            statusEnum,
            statusOptions,
            selectedStatus,
            acceptItem,
            acceptAllItem,
            rejectItem,
            rejectAllItem,
            finishItem,
            finishAllItem,
            isShowConfirmModal,
            rejectReason,
            rejectReasonOptions,
            confirmFunction,
            allColorEnum,
            refreshDataFn,
            switchState
        };
    },
};
