import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { defineAsyncComponent, nextTick } from 'vue';
import SkeletonBox from '@/components/SkeletonBox.vue';
import type { FormInstance, FormRules } from 'element-plus'
import { zonesApi } from '@/api/zonesApi';
import { ordersApi } from '@/api/ordersApi';
import { useDataCategoryStore } from "@/stores/dataCategory";
import { useI18n } from 'vue-i18n';
import { payTypeEnum, statusEnum, viewNameEnum, preStepZTEnum ,localCurrency} from '@/until/constant';
import { elements } from 'chart.js';

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
    props: ['viewSettings'],
    emits: ['onChangeView'],
    setup(props: any, context: any) {
        const { t } = useI18n();
        const router = useRouter();
        const categoryStore = useDataCategoryStore();
        const isLoading = ref(false);
        const moneyType = ref(localCurrency);
        const createBillLabel = ref(t("Create Bill"));
        const isShowSelection = ref(false);
        const isShowConfirm = ref(false);
        const isShowReview = ref(false);
        const zonesList = ref([]);
        const zoneSelectedId = ref("");
        const currentZone = ref({});

        const defaultVal = {
            listOrderId:[""],
            tableId: "",
            orderId: "",
            zoneTable: "",
            totalCost: 0,
            totalCostStr: "0.00",
            list: []
        }
        const baseOrderItems = ref(defaultVal);
        const listOrderToMerge = ref([defaultVal]);
        const orderOfTable = ref({});
        const tableOrder = ref({});

        const confirmSettings = ref({
            viewName: viewNameEnum.REVIEW,
            dataItem: {
                flow: true,
                preStep: [""],
                baseOrderItems: baseOrderItems.value
            }
        });

        const reviewSettings = ref({
            viewName: viewNameEnum.REVIEW,
            dataItem: {}
        });

        onMounted(() => {
            listOrderToMerge.value = [];
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
                zoneSelectedId.value = tableOrder.value.zoneId;
            }

            if (tableOrder.value.baseOrderItems) {
                copyBaseOrderItems(tableOrder.value.baseOrderItems);
            } else {
                setBaseOrderItems(baseOrderItems.value, orderOfTable.value);
            }

            listOrderToMerge.value.push(baseOrderItems.value);
            
            if (!tableOrder.value.flow) {
                copyBaseOrderItems(tableOrder.value.listConfirmedOrder[0]);
                listOrderToMerge.value = tableOrder.value.listOrderToMerge;
            }
            
            loadZonesList(false);
        });


        const copyBaseOrderItems = (currentBaseOrderItems:any) => {
            baseOrderItems.value.zoneTable = currentBaseOrderItems.zoneTable;
            baseOrderItems.value.orderId = currentBaseOrderItems.orderId;
            baseOrderItems.value.tableId = currentBaseOrderItems.tableId;
            baseOrderItems.value.list = [];
            currentBaseOrderItems.list.forEach(element => {
                element.exitsPosition = [];
                baseOrderItems.value.list.push(Object.assign({}, element));
            });

            calculateTotalCost_(baseOrderItems.value);

        }

        async function loadZonesList(isLoad: boolean) {
            zoneSelectedId.value = "";
            if (isLoad) {
                await categoryStore.getZones();
            }
            zonesList.value = [];
            categoryStore.zones.forEach(temp => {
                let zone = Object.assign({}, temp);
                zone.isList = false;
                zone.tables.forEach(table => {
                    //setup first for all
                    table.isAdded = false;

                    //check
                    listOrderToMerge.value.forEach(element => {
                        if (element.tableId === table.id) {
                            table.isAdded = true;
                        }
                    });
                });


                zonesList.value.push(zone);
            });

            if (zoneSelectedId.value === "") {
                zoneSelectedId.value = tableOrder.value.zoneId;
            } else {
                zoneSelectedId.value = zoneSelectedId.value;
            }
        }

        const listTable = (zone: any) => {
            zonesList.value.forEach(zonea => {
                if (zonea.id === zone.id) {
                    zone.isList = !zone.isList;
                } else {
                    zonea.isList = false;
                }
            })

            zone.tables.forEach(table => {
                getOrder(table);
            });

        }

        async function getOrder(table: any) {
            try {
                const response = await ordersApi.getOrderOfTable(table.id);
                if (response.status == 200) {
                    table.myOrder = response.data;
                    if (table.myOrder.items) {
                        table.myOrder.items.forEach(element => {
                            categoryStore.allItem.forEach(item => {
                                if (item.id === element.itemId) {
                                    element.photos = item.photos;
                                    element.name = item.name;
                                    element.price = item.price;
                                }
                            })
                        });
                    }
                } else {
                    console.log('Error:', response.status);
                }
            } catch (err) {
                console.log('Error:', err);
            }
        }

        const addOrder = (orderTable: any,) => {
            let temp = Object.assign({}, defaultVal);

            temp.zoneTable = currentZone.value.name + " - " + orderTable.name;
            setBaseOrderItems(temp, orderTable.myOrder);
            temp.list.forEach(orderItem => {
                orderItem.zoneTable = temp.zoneTable;
            });
            listOrderToMerge.value.push(temp);
            orderTable.isAdded = true;

            updateBaseOrderItems();
        }

        const removeOrder = (orderId: any, orderOfTable: any) => {
            if (listOrderToMerge.value.length > 1) {
                for (let i = 1; i < listOrderToMerge.value.length; i++) {
                    if (listOrderToMerge.value[i].orderId === orderId)
                        listOrderToMerge.value.splice(i, 1);
                }

                updateBaseOrderItems();
                if (orderOfTable) {
                    orderOfTable.isAdded = false;
                }
                else {
                    loadZonesList(false)
                }
            }
        }

        const updateBaseOrderItems = () => {
            baseOrderItems.value = Object.assign({}, defaultVal);
            baseOrderItems.value.list = [];
            listOrderToMerge.value.forEach(element => {
                baseOrderItems.value.list = [...baseOrderItems.value.list, ...element.list]
            });

            calculateTotalCost_(baseOrderItems.value);
        }

        const setBaseOrderItems = (currentBaseOrderItems: any, currentOrderOfTable: any) => {
            currentBaseOrderItems.list = [];
            currentBaseOrderItems.totalCost = 0;
            currentOrderOfTable.items.forEach(order => {
                if ((order.state === statusEnum.ACCEPTED) || (order.state === statusEnum.FINISHED) || (order.state === statusEnum.DONE)) {
                    let tempOrder = Object.assign({}, order);
                    //this value for group item
                    tempOrder.exitsPosition = [];

                    tempOrder.cost = tempOrder.quantity * tempOrder.price;

                    //order.costStr, totalCostStr to display on view
                    tempOrder.costStr = tempOrder.cost.toFixed(2)

                    //order.maxCount to remember order.
                    const temp = tempOrder.quantity;
                    tempOrder.maxCount = temp;

                    currentBaseOrderItems.totalCost += tempOrder.cost;
                    currentBaseOrderItems.list.push(tempOrder);

                    currentBaseOrderItems.totalCostStr = currentBaseOrderItems.totalCost.toFixed(2);
                }
            });

            currentBaseOrderItems.orderId = currentOrderOfTable.id;
            currentBaseOrderItems.tableId = currentOrderOfTable.tableId;
        }

        const calculateTotalCost_ = (orderItemList: any) => {
            orderItemList.totalCost = 0;
            orderItemList.list.forEach(order => {
                order.exitsPosition = [];
                order.cost = order.quantity * order.price;

                //order.costStr, totalCostStr to display on view
                order.costStr = order.cost.toFixed(2)

                orderItemList.totalCost += order.cost;
                orderItemList.totalCostStr = orderItemList.totalCost.toFixed(2);
            })
        }

        const backFn = () => {
            tableOrder.value.flow = false;
            context.emit('onChangeView', {
                viewName: viewNameEnum.CONFIRM,
                data: tableOrder.value
            });
        }

        const createBill = () => {
            groupItems(true);
            // orderIsConfirm();
            baseOrderItems.value.listOrderId=[];
            baseOrderItems.value.listOrderId[0]=tableOrder.value.orderId;
            for(let i=1;i<listOrderToMerge.value.length;i++){
                baseOrderItems.value.listOrderId.push(listOrderToMerge.value[i].orderId);
            }
            
            tableOrder.value.listOrderToMerge = listOrderToMerge.value;
            tableOrder.value.listConfirmedOrder = [];
            tableOrder.value.listConfirmedOrder.push(baseOrderItems.value);
            
            tableOrder.value.preStep.push(preStepZTEnum.MERGEORDER);
            tableOrder.value.flow = true;

            context.emit('onChangeView', {
                viewName: viewNameEnum.BILLINFO,
                data: tableOrder.value
            });
        }

        const groupItems = (group: boolean) => {
            if (group) {
                //filt exits item
                for (let i = 0; i < baseOrderItems.value.list.length; i++) {
                    baseOrderItems.value.list[i].exitsPosition.push(i);
                    for (let j = 0; j < baseOrderItems.value.list.length; j++) {
                        if (baseOrderItems.value.list[i].itemId === baseOrderItems.value.list[j].itemId && i !== j) {
                            baseOrderItems.value.list[i].exitsPosition.push(j);
                        }
                    }
                }

                let tempArr = [];
                baseOrderItems.value.list.forEach(item => {
                    if (item.exitsPosition !== "") {
                        if (item.exitsPosition.length === 1) {
                            tempArr.push(Object.assign({}, item));
                        }
                        else {
                            let temp = Object.assign({}, item);
                            temp.quantity = 0;
                            for (let i = 0; i < temp.exitsPosition.length; i++) {
                                const index = temp.exitsPosition[i];
                                temp.quantity += baseOrderItems.value.list[index].quantity;
                                temp.state = statusEnum.DONE;
                                temp.zoneTable = tableOrder.value.zoneTable;
                                baseOrderItems.value.list[index].exitsPosition = "";
                            }
                            temp.maxCount = temp.quantity;

                            tempArr.push(temp);
                        }
                    }
                    else {

                    }
                });
                baseOrderItems.value.list = tempArr;
                baseOrderItems.value.list.forEach(item => {
                    item.exitsPosition = [];
                });


                tempArr = [];
                baseOrderItems.value.list.forEach(order => {
                    if (order.quantity > 0) {
                        tempArr.push(order);
                    }
                });
                baseOrderItems.value.list = tempArr;

                calculateTotalCost_(baseOrderItems.value);

            } else {
                updateBaseOrderItems();
            }
        }

        const showConfirm = (order: any) => {
            isShowConfirm.value = !isShowConfirm.value;
            confirmSettings.value.dataItem.flow = true;
            confirmSettings.value.dataItem.preStep = [...tableOrder.value.preStep, ...[preStepZTEnum.MERGEORDER]],
                confirmSettings.value.dataItem.baseOrderItems = order;
        }

        const showReview = (table: any) => {
            isShowReview.value = !isShowReview.value;
            table.zoneName = currentZone.value.name;
            reviewSettings.value.dataItem = table;
        }

        const showSelection = () => {
            isShowSelection.value = !isShowSelection.value
        }

        watch(zoneSelectedId, () => {
            zonesList.value.forEach(zone => {
                if (zone.id === zoneSelectedId.value) {
                    currentZone.value = zone;
                    listTable(zone)
                }
            })
        });

        const updateOrder = (data: any) => {
            if (data !== false) {
                for (let i = 1; i < listOrderToMerge.value.length; i++) {
                    if (listOrderToMerge.value[i].orderId === data.orderId) {
                        listOrderToMerge.value[i].list = data.list;
                        calculateTotalCost_(listOrderToMerge.value[i]);
                    }
                }
                updateBaseOrderItems();
            }

            isShowConfirm.value = false;
        }

        const orderIsConfirm = () => {
            let tempArr = [];
            baseOrderItems.value.list.forEach(order => {
                if (order.quantity > 0) {
                    order.state = statusEnum.DONE;
                    order.zoneTable = tableOrder.value.zoneTable;
                    tempArr.push(order);
                }
            });
            baseOrderItems.value.list = tempArr;
        }
        return {
            t,
            isLoading,
            tableOrder,
            payTypeEnum,
            moneyType,
            createBillLabel,
            baseOrderItems,
            statusEnum,
            isShowSelection,
            isShowConfirm,
            isShowReview,
            showConfirm,
            showReview,
            showSelection,
            createBill,
            backFn,
            groupItems,
            listOrderToMerge,
            zonesList,
            zoneSelectedId,
            currentZone,
            loadZonesList,
            listTable,
            addOrder,
            removeOrder,
            updateBaseOrderItems,
            confirmSettings,
            reviewSettings,
            updateOrder
        };
    }
};
