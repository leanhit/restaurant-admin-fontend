import { ref, reactive, watch, onMounted } from "vue";
import { filterDataFunction } from "@/scripts/_baseScripts/search";
import { useDataCategoryStore } from "@/stores/dataCategory";
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { ordersApi } from "@/api/ordersApi";
import { allColorEnum } from "@/until/constant";
import { defineAsyncComponent, nextTick } from 'vue';
import SkeletonBox from '@/components/SkeletonBox.vue';
import { payTypeEnum, statusEnum, viewNameEnum, localCurrency } from '@/until/constant';

import moment from 'moment';

export default {
    components: {
        Confirm: defineAsyncComponent({
            loader: () => import('@/views/zoneTable/components/createBill/Confirm.vue'),
            loadingComponent: SkeletonBox,
        }),
        Review: defineAsyncComponent({
            loader: () => import('@/views/zoneTable/components/createOrder/Review.vue'),
            loadingComponent: SkeletonBox,
        })
    },
    props: ["viewSettings"],
    emits: ["onChangeView"],
    setup() {
        const { t } = useI18n();
        const categoryStore = useDataCategoryStore();
        const filterData = ref("");
        const filter = ref("");
        const listItems = ref([]);
        const isLoading = ref(false);
        const moneyType = ref(localCurrency);
        const tempList = ref([]);
        const zones = ref({});
        const isShowOrderDetail = ref(false);
        const isShowBillOfOrder = ref(false);

        //pagination
        const pageStatus = reactive({
            pageSize: 30, //number items/page
            currentPage: 0,
            totalItems: 0,
            selectedStatus: statusEnum.PENDING
        });

        const reviewSettings = ref({
            viewName: viewNameEnum.REVIEW,
            dataItem: {
            }
        });

        onMounted(() => {
            getAllItems();
            getListData();
        });

        const addInfo_ = (orderItem: any) => {
            if (zones.value.length > 0) {
                zones.value.forEach(zone => {
                    zone.tables.forEach(table => {
                        if (orderItem.tableId === table.id) {
                            orderItem.zoneTable = zone.name + " - " + table.name;
                            return;
                        }
                    });
                });

            }
        }

        async function getAllItems() {
            await categoryStore.getZones();
            zones.value = categoryStore.zones;
        }


        async function getListData() {
            tempList.value = [];
            listItems.value = [];
            await categoryStore.getAllOrderList({
                page: pageStatus.currentPage,
                size: pageStatus.pageSize
            });

            tempList.value = categoryStore.allOrderList.list;
            console.log(tempList.value)
            tempList.value.forEach(orderItem => {
                addInfo_(orderItem);
            });

            pageStatus.totalItems = categoryStore.allOrderList.page.totalElements;

            listItems.value = tempList.value;

        };

        watch(filterData, () => {
            listItems.value = filterDataFunction(filterData.value, tempList.value)
        });


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

        const showOrderDetail = (order: any) => {
            isShowOrderDetail.value = true;
            order.isReadonly = true;
            reviewSettings.value.dataItem = order;
        }


        const showBillOfOrder = (order: any) => {
            isShowBillOfOrder.value = true;
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
            refreshDataFn,
            formatDateTime,
            showOrderDetail,
            showBillOfOrder,
            isShowBillOfOrder,
            isShowOrderDetail,
            reviewSettings,
            moneyType
        };
    },
};
