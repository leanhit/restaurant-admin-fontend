import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
import { zonesApi } from '@/api/zonesApi';
import { ordersApi } from '@/api/ordersApi';
import { useDataCategoryStore } from "@/stores/dataCategory";
import { useI18n } from 'vue-i18n';
import { payTypeEnum, statusEnum, viewNameEnum, preStepZTEnum, localCurrency } from '@/until/constant';


export default {
    props: ['viewSettings'],
    emits: ['onChangeView', 'updateOrder'],
    setup(props: any, context: any) {
        const { t } = useI18n();
        const router = useRouter();
        const categoryStore = useDataCategoryStore();
        const isLoading = ref(false);
        const payType = ref(payTypeEnum.NORMAL);
        const moneyType = ref(localCurrency);
        const isShowSelection = ref(false);
        const reviewType = ref(0);
        const defaultVal = {
            listOrderId:[""],
            tableId: "",
            orderId: "",
            zoneTable: "",
            totalCost: 0,
            totalCostStr: "0.00",
            list: []
        }
        const baseOrderItems = ref(Object.assign({}, defaultVal));
        const tableOrder = ref({});
        const orderOfTable = ref({});

        onMounted(() => {
            if (props.viewSettings.dataItem) {
                tableOrder.value = Object.assign({}, props.viewSettings.dataItem);

                tableOrder.value.preStep = [];
                if (tableOrder.value.flow) {
                    for (let i = 0; i < props.viewSettings.dataItem.preStep.length; i++) {
                        tableOrder.value.preStep.push(props.viewSettings.dataItem.preStep[i]);
                    }
                } else {//data from back
                    for (let i = 0; i < props.viewSettings.dataItem.preStep.length - 1; i++) {
                        tableOrder.value.preStep.push(props.viewSettings.dataItem.preStep[i]);
                    }
                    payType.value = tableOrder.value.payType;
                }
            }

            if (props.viewSettings.viewName === viewNameEnum.REVIEW) {
                const dataFrom = tableOrder.value.preStep[tableOrder.value.preStep.length - 1];
                if (dataFrom.value === preStepZTEnum.SPLITORDER.value) {
                    reviewType.value = 1;
                } else if (dataFrom.value === preStepZTEnum.MERGEORDER.value) {
                    reviewType.value = 2;
                } else {
                    reviewType.value = 2;
                }

                copyBaseOrderItems();
                if(reviewType.value===1){
                groupItems(true);}
            } else {
                reviewType.value = 0;
                setBaseOrderItems_(true);
            }
        });

        const copyBaseOrderItems = () => {
            baseOrderItems.value.zoneTable = tableOrder.value.baseOrderItems.zoneTable;
            baseOrderItems.value.orderId = tableOrder.value.baseOrderItems.orderId;
            baseOrderItems.value.tableId = tableOrder.value.baseOrderItems.tableId;
            baseOrderItems.value.list = [];
            tableOrder.value.baseOrderItems.list.forEach(element => {
                element.exitsPosition = [];
                baseOrderItems.value.list.push(Object.assign({}, element));
            });

            calculateTotalCost_(baseOrderItems.value);

        }

        async function setBaseOrderItems_(isLoad: boolean) {
            if (isLoad) {
                await categoryStore.getOrderOfTable(tableOrder.value.id);
                orderOfTable.value = categoryStore.orderOfTable;
            } else {

                orderOfTable.value = categoryStore.orderOfTable;
            }

            baseOrderItems.value.list = [];
            baseOrderItems.value.totalCost = 0;
            orderOfTable.value.items.forEach(order => {
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

                    baseOrderItems.value.totalCost += tempOrder.cost;
                    baseOrderItems.value.list.push(tempOrder);

                    baseOrderItems.value.totalCostStr = baseOrderItems.value.totalCost.toFixed(2);
                }
            });
        }

        const calculateTotalCost_ = (orderItemList: any) => {
            orderItemList.totalCost = 0;
            orderItemList.list.forEach(order => {
                order.cost = order.quantity * order.price;

                //order.costStr, totalCostStr to display on view
                order.costStr = order.cost.toFixed(2)

                orderItemList.totalCost += order.cost;
                orderItemList.totalCostStr = orderItemList.totalCost.toFixed(2);
            })
        }

        const createBill = () => {
            orderIsConfirm();
            isShowSelection.value = !isShowSelection.value;

            baseOrderItems.value.listOrderId[0]=tableOrder.value.orderId;

            tableOrder.value.baseOrderItems = baseOrderItems.value;
            tableOrder.value.preStep.push(preStepZTEnum.CONFIRMORDER);
            tableOrder.value.payType = payType.value;
            tableOrder.value.flow = true;
            tableOrder.value.listConfirmedOrder = [];

            switch (payType.value) {
                case payTypeEnum.NORMAL:
                    tableOrder.value.listConfirmedOrder.push(baseOrderItems.value);

                    context.emit('onChangeView', {
                        viewName: viewNameEnum.BILLINFO,
                        data: tableOrder.value
                    });
                    break;
                case payTypeEnum.SPLIT:
                    context.emit('onChangeView', {
                        viewName: viewNameEnum.SPLIT,
                        data: tableOrder.value
                    });
                    break;
                case payTypeEnum.MERGE:
                    context.emit('onChangeView', {
                        viewName: viewNameEnum.MERGE,
                        data: tableOrder.value
                    });
                    break;
                default:
                    console.log(payType)
            }
        }

        const countItem = (isPlus: boolean, item: any) => {
            if (isPlus) {
                if (item.quantity < item.maxCount) {
                    item.quantity += 1;
                    baseOrderItems.value.totalCost += item.price;
                    baseOrderItems.value.totalCostStr = baseOrderItems.value.totalCost.toFixed(2);
                }
            } else {
                if (item.quantity > 0) {
                    item.quantity -= 1;
                    baseOrderItems.value.totalCost -= item.price;
                    baseOrderItems.value.totalCostStr = baseOrderItems.value.totalCost.toFixed(2);
                }
            }
            item.cost = item.quantity * item.price;
            item.costStr = item.cost.toFixed(2);
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
                })
                calculateTotalCost_(baseOrderItems.value);

                orderIsConfirm();
            } else {
                if (reviewType.value !== 0) {
                    copyBaseOrderItems();
                } else {
                    setBaseOrderItems_(true);
                }
            }
        }

        const backFn = () => {
            tableOrder.value.flow = false;
            context.emit('onChangeView', {
                viewName: viewNameEnum.CREATEORDER,
                data: tableOrder.value
            });
        }

        const updateOrder = (isUpdate: boolean) => {
            if (isUpdate) {
                context.emit('updateOrder', baseOrderItems.value);
            } else {
                context.emit('updateOrder', false);
            }
        }

        const orderIsConfirm = () => {
            let tempArr = [];
            baseOrderItems.value.list.forEach(order => {
                if (order.quantity > 0) {
                    order.state = statusEnum.DONE;
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
            payType,
            moneyType,
            baseOrderItems,
            statusEnum,
            isShowSelection,
            createBill,
            countItem,
            groupItems,
            backFn,
            reviewType,
            updateOrder
        };
    }
};
