import { ref, reactive, watch, onMounted } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import { filterDataFunction, splitData } from "@/scripts/_baseScripts/search";
import { zonesApi } from "@/api/zonesApi";
import { tablesApi } from "@/api/tablesApi";
import { useDataCategoryStore } from "@/stores/dataCategory";
import { useI18n } from 'vue-i18n';
import { allColorEnum } from "@/until/constant";

export default {
    props: ["viewSettings"],
    emits: ["onChangeView"],
    setup() {
        const { t } = useI18n();
        const categoryStore = useDataCategoryStore();
        const filterData = ref("");
        const filter = ref("");
        const isShowBillDetail = ref(false);
        const itemsList = ref([]);
        const isShowFilter = ref(false);
        const listItems = ref([{
            id:"1",
            code:"different id",
            totalCost:"3000",
            zoneId:"zoneId -> fe get info",
            tableId:"tableId -> fe get info",
            created:"23/11/2023",
        }]);
        const isLoading = ref(false)
        const tempList = ref([]);
        const currentDate = ref(new Date());        
        const currentZoneId = ref("");
        const currentTableId = ref("");
        const viewModeEnum = reactive({
            allBill: t("All bill"),
            zoneBill: t("Bill of zone"),
            tableBill: t("Bill of table")
        });
        const selectDateEnum = reactive({
            allDay: t("All day"),
            aDay: t("Select a day"),
            days: t("Select time period")
        });
        const pageStatus = reactive({
            currentDate: currentDate,
            currentZoneId: currentZoneId,
            currentTableId: currentTableId,
            viewMode: viewModeEnum.allBill,
            selectDateMode:selectDateEnum.allDay,
            pageSize: 15, //number items/page
            currentPage: 1,
            totalItems: 0
        });
        const zonesList = ref([]);
        const tablesList = ref([]);      
        
        const currentOrderDetail = ref({});
        async function getListData() {
            await categoryStore.getAllOrderList({page:pageStatus.currentPage, size:pageStatus.pageSize});
            
            categoryStore.allOrderList.forEach(order=>{
                if(order.items.length>0){
                    tempList.value.push(order);
                }
            })

            console.log("------", tempList.value)
            listItems.value = filterDataFunction(filterData.value, tempList.value)
            console.log("------", listItems.value)
        }

        onMounted(() => {
            isShowBillDetail.value = categoryStore.currentOrder.isActivate;
            if(isShowBillDetail.value){
                currentOrderDetail.value = categoryStore.currentOrder.currentOrderDetail;
                categoryStore.setActivateOrder({},false);
            }
            // console.log("-------",currentOrderDetail.value)
            getListData();
        }),

        

        watch(currentDate, () => {
            console.log(currentDate.value)
        });
        watch(currentZoneId, () => {
            zonesList.value.forEach(zone=>{
                if(zone.id === currentZoneId.value){
                    tablesList.value = zone.tables;
                    if(pageStatus.viewMode === viewModeEnum.tableBill){
                    currentTableId.value="";
                    currentTableId.value = tablesList.value[0]?.id;
                    }
                }
            })
        });
        watch(currentTableId, () => {
            console.log(currentTableId.value)
        });


        const changeViewMode = () => {
            if (pageStatus.viewMode === viewModeEnum.allBill) {
                pageStatus.viewMode = viewModeEnum.zoneBill;                
                currentZoneId.value="";
                currentZoneId.value = zonesList.value[0]?.id;
            } else if (pageStatus.viewMode === viewModeEnum.zoneBill) {
                pageStatus.viewMode = viewModeEnum.tableBill;                
                currentTableId.value="";
                currentTableId.value = tablesList.value[0]?.id;
            }else if (pageStatus.viewMode === viewModeEnum.tableBill) {
                pageStatus.viewMode = viewModeEnum.allBill;
            }
        }        
        
        const changeSelectDateMode = () => {
            if (pageStatus.selectDateMode === selectDateEnum.aDay) {
                pageStatus.selectDateMode = selectDateEnum.days;
            } else if (pageStatus.selectDateMode === selectDateEnum.days) {
                pageStatus.selectDateMode = selectDateEnum.allDay;
            } else if (pageStatus.selectDateMode === selectDateEnum.allDay) {
                pageStatus.selectDateMode = selectDateEnum.aDay;
            } 
        }

        const showBillDetail = ()=>{
            isShowBillDetail.value = !isShowBillDetail.value;
        }



        async function refreshDataFn() {
            await categoryStore.getZones();
            zonesList.value = categoryStore.zones;
            currentZoneId.value = zonesList.value[0]?.id;
            tablesList.value = zonesList.value[0]?.tables;
            currentTableId.value = tablesList.value[0]?.id;
        };

        refreshDataFn();

        watch(filterData, () => {
            listItems.value = filterDataFunction(filterData.value, tempList.value)
        });

        watch(filter, () => {
            listItems.value = [];
        })

        const handleSizeChange = (pageSize: number) => {
            pageStatus.pageSize = pageSize;
            getListData();
        }
        const handleCurrentChange = (pageIndex: number) => {
            pageStatus.currentPage = pageIndex;
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
            refreshDataFn,
            currentDate,
            zonesList,
            tablesList,
            currentZoneId,
            currentTableId,
            changeViewMode,
            viewModeEnum,
            selectDateEnum,
            changeSelectDateMode,

            showBillDetail,
            isShowBillDetail,
            itemsList,
            currentOrderDetail,
            isShowFilter,
            allColorEnum
        };
    },
};
