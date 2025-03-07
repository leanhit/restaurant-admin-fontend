import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { defineAsyncComponent, nextTick } from 'vue';
import SkeletonBox from '@/components/SkeletonBox.vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
import { zonesApi } from '@/api/zonesApi';
import { ordersApi } from '@/api/ordersApi';
import { useDataCategoryStore } from "@/stores/dataCategory";
import { useI18n } from 'vue-i18n';
import { payTypeEnum, statusEnum, viewNameEnum, preStepZTEnum, localCurrency } from '@/until/constant';

export default {
    components: {
        Confirm: defineAsyncComponent({
            loader: () => import('@/views/zoneTable/components/createBill/Confirm.vue'),
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
        const itemModel = ref({
            name: "",
            description: "",
            maxTable: 0,
            maxSeat: 0
        });
        const createBillLabel = ref(t("Create Bill"));
        const isShowConfirm = ref(false);

        const defaultVal = {
            tableId: "",
            orderId: "",
            zoneTable: "",
            totalCost: 0,
            totalCostStr: "0.00",
            list: []
        }
        const baseOrderItems = ref(Object.assign({}, defaultVal));
        const newOrderItems_1 = ref(Object.assign({}, defaultVal));
        const newOrderItems_2 = ref(Object.assign({}, defaultVal));
        const reviewSettings = ref([{}]);
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
                } else {
                    for (let i = 0; i < props.viewSettings.dataItem.preStep.length - 1; i++) {
                        tableOrder.value.preStep.push(props.viewSettings.dataItem.preStep[i]);
                    }
                }
            }

            if (tableOrder.value.baseOrderItems) {
                baseOrderItems.value = Object.assign({}, tableOrder.value.baseOrderItems)
            } else {
                setBaseOrderItems_();
            }

            baseOrderItems.value.zoneTable = tableOrder.value.zoneTable;

            if (tableOrder.value.flow) {
                setNewOrderItems_();
            } else {
                newOrderItems_1.value = tableOrder.value.listConfirmedOrder[0];
                newOrderItems_2.value = tableOrder.value.listConfirmedOrder[1];
            }
        });



        const setReviewSetting_ = () => {
            reviewSettings.value = [];
            reviewSettings.value[0] = {
                viewName: viewNameEnum.REVIEW,
                dataItem: {
                    flow: true,
                    preStep: [...tableOrder.value.preStep, ...[preStepZTEnum.SPLITORDER]],
                    baseOrderItems: newOrderItems_1
                }
            };

            reviewSettings.value[1] = {
                viewName: viewNameEnum.REVIEW,
                dataItem: {
                    flow: true,
                    preStep: [...tableOrder.value.preStep, ...[preStepZTEnum.SPLITORDER]],
                    baseOrderItems: newOrderItems_2
                }
            };
        }

        const setBaseOrderItems_ = () => {
            orderOfTable.value = categoryStore.orderOfTable;
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
            orderItemList.value.totalCost = 0;
            orderItemList.value.list.forEach(order => {
                order.cost = order.quantity * order.price;

                //order.costStr, totalCostStr to display on view
                order.costStr = order.cost.toFixed(2)

                orderItemList.value.totalCost += order.cost;
                orderItemList.value.totalCostStr = orderItemList.value.totalCost.toFixed(2);
            });
        }

        const setNewOrderItems_ = () => {
            newOrderItems_1.value.zoneTable = baseOrderItems.value.zoneTable + " - Bill 1";
            newOrderItems_2.value.zoneTable = baseOrderItems.value.zoneTable + " - Bill 2";
            newOrderItems_1.value.list = [];
            newOrderItems_2.value.list = [];
            baseOrderItems.value.list.forEach(orderItem => {
                newOrderItems_1.value.list.push(Object.assign({}, orderItem));
                newOrderItems_2.value.list.push(Object.assign({}, orderItem));
            });

            newOrderItems_2.value.list.forEach(orderItem => {
                orderItem.quantity = 0;
                orderItem.cost = 0;
                orderItem.costStr = "0.00";
            });

            calculateTotalCost_(newOrderItems_2);
            calculateTotalCost_(newOrderItems_1);
        }

        const backFn = () => {
            tableOrder.value.flow = false;
            context.emit('onChangeView', {
                viewName: viewNameEnum.CONFIRM,
                data: tableOrder.value
            });
        }

        const createBill = () => {
            tableOrder.value.listConfirmedOrder = [];
            newOrderItems_1.value.listOrderId[0] = tableOrder.value.orderId;
            tableOrder.value.listConfirmedOrder.push(newOrderItems_1.value);

            newOrderItems_2.value.listOrderId[0] = tableOrder.value.orderId;
            tableOrder.value.listConfirmedOrder.push(newOrderItems_2.value);
            tableOrder.value.flow = true;

            tableOrder.value.preStep.push(preStepZTEnum.SPLITORDER)

            context.emit('onChangeView', {
                viewName: viewNameEnum.BILLINFO,
                data: tableOrder.value
            });
        }


        const splitItem = (order_1: boolean, itemIndex: any) => {
            //orderItem off newOrderItems_1 +
            if (order_1) {
                //Nếu quantity của item bên newOrderItems_2 > 0, tăng cho item bên newOrderItems_1 1
                if (newOrderItems_2.value.list[itemIndex].quantity > 0) {
                    newOrderItems_1.value.list[itemIndex].quantity += 1;
                    newOrderItems_2.value.list[itemIndex].quantity -= 1;
                }
            } else {
                //Nếu quantity của item bên newOrderItems_1 > 0, tăng cho item bên newOrderItems_2 1
                if (newOrderItems_1.value.list[itemIndex].quantity > 0) {
                    newOrderItems_2.value.list[itemIndex].quantity += 1;
                    newOrderItems_1.value.list[itemIndex].quantity -= 1;
                }
            }
            calculateTotalCost_(newOrderItems_1);
            calculateTotalCost_(newOrderItems_2);
        }

        const getRandomInt_ = (min: number, max: number) => {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const autoSplit = () => {
            for (let i = 0; i < baseOrderItems.value.list.length; i++) {
                const temp = baseOrderItems.value.list[i];
                const count = getRandomInt_(0, temp.quantity);
                newOrderItems_1.value.list[i].quantity = count;
                newOrderItems_2.value.list[i].quantity = temp.quantity - count;
            }

            calculateTotalCost_(newOrderItems_1);
            calculateTotalCost_(newOrderItems_2);
        }

        const resetSplit = () => {
            setNewOrderItems_();
        }

        const reviewOrder = () => {
            isShowConfirm.value = !isShowConfirm.value;
            setReviewSetting_();
        }

        return {
            t,
            isLoading,
            itemModel,
            tableOrder,
            payTypeEnum,
            moneyType,
            createBillLabel,
            baseOrderItems,
            statusEnum,
            createBill,
            backFn,
            splitItem,
            newOrderItems_1,
            newOrderItems_2,
            autoSplit,
            resetSplit,
            isShowConfirm,
            reviewSettings,
            reviewOrder
        };
    }
};
