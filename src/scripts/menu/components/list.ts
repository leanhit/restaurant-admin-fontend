import { ref, reactive, watch, defineAsyncComponent } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import { filterDataFunction, splitData } from "@/scripts/_baseScripts/search";
import { categoryApi } from "@/api/categoryApi";
import { itemsApi } from "@/api/itemsApi";
import { useDataCategoryStore } from "@/stores/dataCategory";
import { statusEnum, allColorEnum, viewModeEnum, viewNameEnum, localCurrency , currencyEnum} from "@/until/constant";
import { useI18n } from 'vue-i18n';

export default {
    // components: {
    //     Item: defineAsyncComponent({
    //         loader: () => import('@/views/menu/components/Item.vue'),
    //         loadingComponent: SkeletonBox,
    //     }),
    // },
    props: ["viewSettings"],
    emits: ["onChangeView"],
    setup() {
        const { t } = useI18n();
        const categoryStore = useDataCategoryStore();
        
        const menu = ref([]);
        const filterData = ref("");
        const listItems = ref([]);
        const isLoading = ref(false);
        const tempList = ref([]);
        const moneyType = ref(localCurrency);
        const selectedCategoryId = ref("");

        const categoryDetail = reactive({
            id: "",
            name: "",
            availableStatus: statusEnum.AVAILABLE,
        });

        const filterOptions = reactive([
            {
                label: t("All"),
                value: "ALL"
            },
            {
                label: t(statusEnum.AVAILABLE),
                value: statusEnum.AVAILABLE
            }, {
                label: t(statusEnum.UNAVAILABLE),
                value: statusEnum.UNAVAILABLE
            }
        ]);

        const categoryStatusOptions = reactive([
            {
                label: t(statusEnum.HIDE),
                value: statusEnum.HIDE
            },
            {
                label: t(statusEnum.AVAILABLE),
                value: statusEnum.AVAILABLE
            }, {
                label: t(statusEnum.UNAVAILABLE),
                value: statusEnum.UNAVAILABLE
            }
        ]);

        const itemStatusOptions = reactive([
            {
                label: t(statusEnum.HIDE),
                value: statusEnum.HIDE
            },
            {
                label: t(statusEnum.AVAILABLE),
                value: statusEnum.AVAILABLE
            }, {
                label: t(statusEnum.UNAVAILABLETODAY),
                value: statusEnum.UNAVAILABLETODAY
            }, {
                label: t(statusEnum.UNAVAILABLE),
                value: statusEnum.UNAVAILABLE
            }
        ]);

        const pageStatus = reactive({
            currentCategoryId: "",
            viewMode: viewModeEnum.TABLEMODE,
            pageSize: 30,
            currentPage: 1,
            totalItems: 0,
            currentSortMode: ""
        });

        const selectCategory_ = () => {
            tempList.value = [];
            if (menu) {
                menu.value.forEach(category => {
                    if (category.id === pageStatus.currentCategoryId) {
                        tempList.value = category.items;
                        tempList.value.forEach(item => {
                            item.categoryId = category.id;
                        })

                        categoryDetail.id = category.id;
                        categoryDetail.name = category.name;
                        categoryDetail.availableStatus = category.availableStatus;
                    }
                });
            }
            listItems.value = tempList.value
            pageStatus.totalItems = listItems.value.length;
            listItems.value = splitData(tempList.value, pageStatus);
        };

        const selectCategory = (category: any) => {
            pageStatus.currentCategoryId = category.id;
            categoryStore.setPageStatus(pageStatus);
            filterData.value = "";

            selectCategory_();
        }

        const changeItemStatus = (item: any) => {
            itemsApi.updateItem(item.id, item);
        }

        async function refreshDataFn() {
            isLoading.value = true;
            await categoryStore.getMenu();
            await categoryStore.getAllItems({ page: 0, size: 999 });

            const allAvailableStatus = ref(statusEnum.AVAILABLE);

            menu.value = [{
                id: "",
                name: t("All Category"),
                availableStatus: allAvailableStatus.value,
                items: categoryStore.allItem
            }]

            menu.value = [...menu.value, ...categoryStore.menu];

            selectedCategoryId.value = categoryStore.pageStatus.currentCategoryId;
            pageStatus.currentCategoryId = categoryStore.pageStatus.currentCategoryId;
            pageStatus.currentPage = categoryStore.pageStatus.currentPage;
            pageStatus.pageSize = categoryStore.pageStatus.pageSize;
            pageStatus.currentSortMode = categoryStore.pageStatus.currentSortMode;
            pageStatus.viewMode = categoryStore.pageStatus.viewMode;

            selectCategory_();

            isLoading.value = false;

            // ElMessage({
            //     dangerouslyUseHTMLString: true,
            //     type: 'success',
            //     message: `${("New data have been updated")}`,
            // });
        };

        refreshDataFn();

        const changeCategoryStatus = (category: any) => {
            categoryApi.updateCategory(category.id, category);
        }

        const changeViewMode = (mode: string) => {
            if (mode === viewModeEnum.CARDMODE) {
                pageStatus.viewMode = viewModeEnum.TABLEMODE;

            } else if (mode === viewModeEnum.TABLEMODE) {
                pageStatus.viewMode = viewModeEnum.CARDMODE;

            }
            categoryStore.setPageStatus(pageStatus);
        }

        const checkEmptyCategory_ = (categoryId: string) => {
            let isOK = true;
            if (menu) {
                menu.value.forEach(category => {
                    if (category.id === categoryId) {
                        if (category.items.length > 0) {
                            isOK = false;
                        }
                    }
                });
            } else {
                isOK = false;
            }

            return isOK;
        }

        //remove category that have been deleted from menu
        const renoveDeletedCategory_ = (categoryId: string) => {
            if (menu) {
                let index = 0;
                menu.value.forEach(category => {
                    if (category.id === categoryId) {
                        menu.value.splice(index, 1)
                    }
                    index++;
                });
            }
            selectedCategoryId.value = "";
            selectCategory({ id: "" });
        }

        const deleteCategory = (item: any) => {
            if (checkEmptyCategory_(item.id)) {
                ElMessageBox.confirm(
                    `${t("Do you realy remove")} ${t("category")} <strong class="text-primary">${item.name}</strong>`, t('Confirm'), {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: t(t("Yes")),
                    cancelButtonText: t('No'),
                    type: 'warning',
                })
                    .then(() => {
                        categoryApi
                            .deleteCategory(item.id)
                            .then((respond) => {
                                if (respond) {
                                    if (respond.status == 204) {
                                        ElMessage({
                                            dangerouslyUseHTMLString: false,
                                            type: 'success',
                                            message: t("Successful!"),
                                        });
                                        renoveDeletedCategory_(item.id);
                                    } else {
                                        ElMessage({
                                            dangerouslyUseHTMLString: true,
                                            type: 'info',
                                            message: `${t("An error occurred while deleting")} ${t("category")} <strong class="text-primary">${item.name}</strong>. ${("It cannot be deleted")}`,
                                        });
                                    }
                                }
                            })
                            .catch(() => {
                                ElMessage({
                                    dangerouslyUseHTMLString: true,
                                    type: 'info',
                                    message: t("Successful!"),
                                })
                            });
                    })
                    .catch(() => {
                        ElMessage({
                            dangerouslyUseHTMLString: true,
                            type: 'info',
                            message: `${t("The category")} <strong class="text-primary">${item.name}</strong> ${t("deletion command has been cancelled")}`,
                        })
                    });
            } else {
                ElMessage({
                    dangerouslyUseHTMLString: true,
                    type: 'info',
                    message: `${("It cannot be deleted")}`,
                });
            }

        };

        //remove category that have been deleted from menu
        const renoveDeletedItem_ = (itemId: string) => {
            //there are 2 category contain thiss item
            //allItem and category parent of this item
            if (menu) {
                menu.value.forEach(category => {
                    category.items.forEach(item => {
                        let index = 0;
                        if (item.id === itemId) {
                            category.items.splice(index, 1)
                        }
                        index++;
                    });
                });
            }
            selectCategory_();
        }

        const deleteItem = (item: any) => {
            ElMessageBox.confirm(
                `${t("Do you realy remove")} ${t("item")} <strong class="text-primary">${item.name}</strong>`, t('Confirm'), {
                dangerouslyUseHTMLString: true,
                confirmButtonText: t("Yes"),
                cancelButtonText: t("No"),
                type: 'warning',
            })
                .then(() => {
                    itemsApi
                        .deleteItem(item.id)
                        .then((respond) => {
                            if (respond) {
                                if (respond.status == 204) {
                                    ElMessage({
                                        dangerouslyUseHTMLString: false,
                                        type: 'success',
                                        message: t("Successful!"),
                                    });

                                    renoveDeletedItem_(item.id);
                                } else {
                                    ElMessage({
                                        dangerouslyUseHTMLString: true,
                                        type: 'info',
                                        message: `${t("An error occurred while deleting")} ${t("item")} <strong class="text-primary">${item.name}</strong>. ${t("It cannot be deleted")}`,
                                    });
                                }
                            }
                        })
                        .catch(() => {
                            ElMessage({
                                dangerouslyUseHTMLString: true,
                                type: 'info',
                                message: t("Successful!"),
                            })
                        });
                })
                .catch(() => {
                    ElMessage({
                        dangerouslyUseHTMLString: true,
                        type: 'info',
                        message: `${t("The item")} <strong class="text-primary">${item.name}</strong> ${t("deletion command has been cancelled")}`,
                    })
                });
        };

        watch(filterData, () => {
            listItems.value = filterDataFunction(filterData.value, tempList.value)
        });

        const handleSizeChange = (itemsPerPage: number) => {
            pageStatus.pageSize = itemsPerPage;
            categoryStore.setPageStatus(pageStatus);
            listItems.value = splitData(tempList.value, pageStatus);
        }
        const handleCurrentChange = (currentPage: number) => {
            pageStatus.currentPage = currentPage;
            categoryStore.setPageStatus(pageStatus);
            listItems.value = splitData(tempList.value, pageStatus);
        }

        return {
            t,
            pageStatus,
            handleCurrentChange,
            handleSizeChange,
            isLoading,
            listItems,
            filterData,
            refreshDataFn,
            deleteItem,
            selectCategory,
            menu,
            filterOptions,
            categoryDetail,
            deleteCategory,
            changeItemStatus,
            categoryStatusOptions,
            itemStatusOptions,
            changeCategoryStatus,
            changeViewMode,
            currencyEnum,
            moneyType,
            selectedCategoryId,
            statusEnum,
            allColorEnum,
            viewModeEnum,
            viewNameEnum
        };
    },
};
