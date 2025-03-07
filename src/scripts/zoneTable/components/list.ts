import { useI18n } from "vue-i18n";
import { ref, reactive, watch, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { filterDataFunction, splitData } from "@/scripts/_baseScripts/search";
import { zonesApi } from "@/api/zonesApi";
import { tablesApi } from "@/api/tablesApi";
import { useDataCategoryStore } from "@/stores/dataCategory";
import { viewNameEnum, statusEnum, allColorEnum, preStepZTEnum } from "@/until/constant";

export default {
    props: ["viewSettings"],
    emits: ["onChangeView"],
    setup(props: any, context: any) {
        const { t } = useI18n();
        const categoryStore = useDataCategoryStore();
        const zoneTable = ref([]);
        const currentZoneId = ref("");
        const filterData = ref("");
        const filter = ref("ALL");
        const listItems = ref([]);
        const isLoading = ref(false);
        const tempList = ref([]);
        const isAutoReload = ref(true);

        const zoneDetail = reactive({
            id: "",
            name: "",
            description: "",
            maxSeat: 0,
            maxTable: 0,
            tableNumberAvailable: 0,
        });

        const filterTableStatusOptions = reactive([
            { label: t("All"), value: "ALL" },
            { label: t(statusEnum.OCCUPIED), value: statusEnum.OCCUPIED },
            { label: t(statusEnum.AVAILABLE), value: statusEnum.AVAILABLE },
            { label: t(statusEnum.UNAVAILABLE), value: statusEnum.UNAVAILABLE },
        ]);

        const pagePagination = reactive({
            pageSize: 15,
            currentPage: 1,
            totalItems: 0,
        });

        onMounted(() => {
            refreshDataFn();
            setInterval(() => {
                if (isAutoReload.value) refreshDataFn();
            }, 30000);
        });

        const calculateAvailableTable = (tables: any[]) => {
            zoneDetail.tableNumberAvailable = tables.filter((t) => t.status === "AVAILABLE").length;
            zoneDetail.maxTable = tables.length;
        };

        const setupData_ = () => {
            const zone = zoneTable.value.find((z) => z.id === currentZoneId.value);
            if (zone) {
                tempList.value = zone.tables || [];
                Object.assign(zoneDetail, zone);
                calculateAvailableTable(tempList.value);
                tempList.value.forEach((table) => (table.zoneId = zone.id));
            } else {
                tempList.value = [];
            }
            listItems.value = tempList.value;
        };

        const handleClick = (zoneId: string) => {
            currentZoneId.value = zoneId;
            categoryStore.setCurrentZoneId(zoneId);
        };

        async function refreshDataFn() {
            await categoryStore.getZones();
            zoneTable.value = categoryStore.zones;
            currentZoneId.value = categoryStore.currentZoneId || zoneTable.value[0]?.id || "";
        }

        const gotoCreateOrder = (table: any) => {
            context.emit("onChangeView", {
                viewName: "CreateOrder",
                data: { ...table, zoneTable: `${zoneDetail.name} - ${table.name}`, tableId: table.id, zoneId: zoneDetail.id, preStep: [preStepZTEnum.ROOT], flow: true },
            });
        };

        const checkZoneEmpty_ = (zoneId: string) => {
            const zone = zoneTable.value.find((z) => z.id === zoneId);
            if (zone?.tables?.length) {
                ElMessage({ dangerouslyUseHTMLString: true, type: "info", message: t("This zone cannot be deleted now") });
                return false;
            }
            return true;
        };

        const removeZone_ = (zoneId: string) => {
            const index = zoneTable.value.findIndex((z) => z.id === zoneId);
            if (index !== -1) zoneTable.value.splice(index, 1);
            if (zoneTable.value.length) currentZoneId.value = zoneTable.value[0].id;
        };

        const deleteZone = (item: any) => {
            if (!checkZoneEmpty_(item.id)) return;

            ElMessageBox.confirm(
                `${t("Do you really want to remove")} ${t("zone")} <strong class="text-primary">${item.name}</strong>`,
                t("Confirm"),
                { dangerouslyUseHTMLString: true, confirmButtonText: t("Yes"), cancelButtonText: t("No"), type: "warning" }
            )
                .then(() => zonesApi.deleteZone(item.id))
                .then((response) => {
                    if (response?.status === 204) {
                        ElMessage({ type: "success", message: t("Successful!") });
                        removeZone_(item.id);
                    } else {
                        throw new Error(t("An error occurred while deleting the zone. It cannot be deleted."));
                    }
                })
                .catch((error) => {
                    ElMessage({
                        dangerouslyUseHTMLString: true,
                        type: "info",
                        message: error.message || `${t("The zone")} <strong class="text-primary">${item.name}</strong> ${t("deletion command has been cancelled")}`,
                    });
                });
        };

        const removeTable_ = (tableId: string) => {
            zoneTable.value.forEach((zone) => {
                const index = zone.tables.findIndex((t) => t.id === tableId);
                if (index !== -1) zone.tables.splice(index, 1);
            });
            setupData_();
        };

        const deleteTable = (item: any) => {
            ElMessageBox.confirm(
                `${t("Do you really want to remove")} ${t("table")} <strong class="text-primary">${item.name}</strong>`,
                t("Confirm"),
                { dangerouslyUseHTMLString: true, confirmButtonText: t("Yes"), cancelButtonText: t("No"), type: "warning" }
            )
                .then(() => tablesApi.deleteTable(item.id))
                .then((response) => {
                    if (response?.status === 204) {
                        ElMessage({ type: "success", message: t("Successful!") });
                        removeTable_(item.id);
                    } else {
                        throw new Error(t("An error occurred while deleting the table. It cannot be deleted."));
                    }
                })
                .catch((error) => {
                    ElMessage({
                        dangerouslyUseHTMLString: true,
                        type: "info",
                        message: error.message || `${t("The table")} <strong class="text-primary">${item.name}</strong> ${t("deletion command has been cancelled")}`,
                    });
                });

            refreshDataFn();
        };

        const filterTable_ = () => {
            listItems.value = filter.value === "ALL" ? tempList.value : tempList.value.filter((table) => table.status === filter.value);
            calculateAvailableTable(tempList.value);
        };

        watch(filter, filterTable_);
        watch(currentZoneId, setupData_);
        watch(filterData, () => (listItems.value = filterDataFunction(filterData.value, tempList.value)));

        const handleSizeChange = (size: number) => {
            pagePagination.pageSize = size;
            listItems.value = splitData(tempList.value, pagePagination);
        };

        const handleCurrentChange = (page: number) => {
            pagePagination.currentPage = page;
            listItems.value = splitData(tempList.value, pagePagination);
        };

        return {
            t,
            pagePagination,
            handleCurrentChange,
            handleSizeChange,
            isLoading,
            listItems,
            filterData,
            refreshDataFn,
            deleteTable,
            currentZoneId,
            handleClick,
            zoneTable,
            zoneDetail,
            filterTableStatusOptions,
            filter,
            deleteZone,
            gotoCreateOrder,
            statusEnum,
            allColorEnum,
            viewNameEnum,
        };
    },
};
