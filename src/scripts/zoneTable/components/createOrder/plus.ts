import { ref, reactive, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useDataCategoryStore } from '@/stores/dataCategory';
import { filterDataFunction, splitData } from "@/scripts/_baseScripts/search";
import { ordersApi } from "@/api/ordersApi";
import { useI18n } from 'vue-i18n';
import { statusEnum, allColorEnum, viewModeEnum, localCurrency } from '@/until/constant';
import moment from 'moment';


export default {
    props: ['itemOrderList'],
    emits: ['selectItems'],
    setup(props: any, context: any) {
        const { t } = useI18n();
        const categoryStore = useDataCategoryStore();
        const menu = ref([]);
        const filterData = ref("");
        const listItems = ref([]);
        const tempList = ref([]);
        const moneyType = ref(localCurrency);
        const selectedCategoryId = ref("");
        const isLoading = ref(false);
        const listItemsSelect = ref([]);
        const listItemsOrder = ref([]);

        const categoryDetail = reactive({
            id: "",
            name: "",
            availableStatus: statusEnum.AVAILABLE,
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
            if (props.itemOrderList) {
                listItemsOrder.value = props.itemOrderList;
                showSelectItemModel();
            }
        });


        const addInfo_ = () => {
            tempList.value.forEach(element => {
                element.quantity = 0;
                element.specifications = "";
                element.showSpecifications = false;
                element.state = statusEnum.NOTORDER;
                element.itemId = "";
            });
        }

        //this function load all item of menu
        const selectCategory_ = () => {
            if (menu) {
                menu.value.forEach(category => {
                    if (category.id === pageStatus.currentCategoryId) {
                        tempList.value = [];
                        category.items.forEach(item => {
                            if (item.availableStatus !== statusEnum.HIDE) {
                                tempList.value.push(item);
                            }
                        })

                        categoryDetail.id = category.id;
                        categoryDetail.name = category.name;
                        categoryDetail.availableStatus = category.availableStatus;
                    }
                });
            }

            //add info to tempList
            addInfo_();

            listItems.value = [];
            listItems.value = tempList.value;
            pageStatus.totalItems = listItems.value.length;
            listItems.value = splitData(tempList.value, pageStatus);

            if (listItemsSelect.value.length > 0) {
                listItemsSelect.value.forEach(element => {
                    listItems.value.forEach(item => {
                        if (element.id === item.id) {
                            item.quantity = element.quantity;
                            item.specifications = element.specifications;
                        }
                    })

                });
            }
        };

        const selectCategory = (category: any) => {
            pageStatus.currentCategoryId = category.id;
            categoryStore.setPageStatus(pageStatus);
            filterData.value = "";

            selectCategory_();
        }

        async function getAllItemsList() {
            isLoading.value = true;
            await categoryStore.getMenu();
            await categoryStore.getAllItems({ page: 0, size: 9999 });

            menu.value = [{
                id: "",
                name: t("All Category"),
                availableStatus: statusEnum.AVAILABLE,
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
        };

        const changeViewMode = (mode: string) => {
            if (mode === viewModeEnum.CARDMODE) {
                pageStatus.viewMode = viewModeEnum.TABLEMODE;

            } else if (mode === viewModeEnum.TABLEMODE) {
                pageStatus.viewMode = viewModeEnum.CARDMODE;

            }
            categoryStore.setPageStatus(pageStatus);
        }

        watch(filterData, () => {
            listItems.value = filterDataFunction(filterData.value, tempList.value)
        });

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

        const addSpecifications = (item: any) => {
            listItemsSelect.value.forEach(element => {
                //only check not order item
                if (element.state === statusEnum.NOTORDER && element.id === item.id) {
                    element.specifications = item.specifications;
                }
            });
        }

        const countItem = (isPlus: boolean, item: any) => {
            if (isPlus) {
                if (item.quantity <= item.maxStock - 1) {
                    item.quantity += 1;
                    checkAndAdd_(item);
                }
            } else {
                if (item.quantity > 0) {
                    item.quantity -= 1;
                    if (item.quantity === 0) {
                        item.showSpecifications = false;
                        checkAndRemove_(item)
                    } else {
                        checkAndAdd_(item);
                    }
                }
            }
        }

        const checkAndAdd_ = (item: any) => {
            if (listItemsSelect.value.length === 0) {
                listItemsSelect.value.push(Object.assign({}, item));
            } else {
                let isExit = false;
                listItemsSelect.value.forEach(element => {
                    //only check not order item
                    if (element.state === statusEnum.NOTORDER && element.id === item.id) {
                        isExit = true;
                        element.quantity = item.quantity;
                        element.specifications = item.specifications;
                    }
                });

                if (!isExit) {
                    listItemsSelect.value.push(Object.assign({}, item));
                }
            }
        }

        const checkAndRemove_ = (item: any) => {
            //remover from listItemsSelect
            for (let i = 0; i < listItemsSelect.value.length; i++) {
                if (listItemsSelect.value[i].id === item.id) {
                    listItemsSelect.value.splice(i, 1);
                }
            }
        }

        const showSelectItemModel = () => {
            getAllItemsList();
            listItemsOrder.value.forEach(element => {
                listItemsSelect.value.push(element);
            });
        }

        const itemOrderPlus = (isAdd: boolean) => {
            if (isAdd && (listItemsSelect.value.length > 0)) {
                listItemsOrder.value = [];
                listItemsSelect.value.forEach(item => {
                    listItemsOrder.value.push(Object.assign({}, item));

                });
                listItemsSelect.value = [];

                context.emit('selectItems', listItemsOrder.value)

            } else {
                context.emit('selectItems', false)
            }
        }


        return {
            t,
            isLoading,
            pageStatus,
            handleCurrentChange,
            handleSizeChange,
            listItems,
            filterData,
            getAllItemsList,
            selectCategory,
            menu,
            categoryDetail,
            moneyType,
            selectedCategoryId,
            countItem,
            listItemsSelect,
            changeViewMode,
            addSpecifications,
            statusEnum,
            allColorEnum,
            viewModeEnum,
            itemOrderPlus
        };
    }
};
