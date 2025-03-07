import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, TimePickPanel } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
import { zonesApi } from '@/api/zonesApi';
import { ordersApi } from '@/api/ordersApi';
import { useDataCategoryStore } from "@/stores/dataCategory";
import { useI18n } from 'vue-i18n';
import { payTypeEnum, statusEnum, viewNameEnum, localCurrency, taxPercent } from '@/until/constant';

import { defineAsyncComponent, nextTick } from 'vue';
import SkeletonBox from '@/components/SkeletonBox.vue';


export default {
    components: {
        BillPreview: defineAsyncComponent({
            loader: () => import('@/views/bill/components/BillDetail.vue'),
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
        const tableOrder = ref({});

        const isShowPreview = ref(false);
        const paymentEnum = {
            CREDIT: "Credit Card",
            DEBIT: "Debit Card",
            PAYPAL: "Paypal",
            OTHER: "Other"
        };
        const defaultItemModal = {
            firstName: "",
            lastName: "",
            email: "",
            address: "",
            cardType: paymentEnum.OTHER,
            cardName: "",
            cardNumber: 0,
            experation: "",
            cvv: ""
        }
        const itemModel = ref({
            firstName: "",
            lastName: "",
            email: "",
            address: "",
            cardType: paymentEnum.OTHER,
            cardName: "",
            cardNumber: 0,
            experation: "",
            cvv: ""
        });
        const formRef = ref<FormInstance>();
        const noEmpty = {
            required: true,
            message: t('This fiel is required'),
            trigger: 'blur',
        }
        const rules = reactive<FormRules>({
            name: [noEmpty],
            description: [noEmpty],
        });

        const defaultVal = {
            tableId: "",
            orderId: "",
            zoneTable: "",
            totalCost: 0,
            totalCostStr: "0.00",
            list: [],
        }

        const previewSettings = reactive({
            viewName: viewNameEnum.REVIEW,
            dataItem: {}
        });

        const listConfirmedOrder = ref([defaultVal]);

        const orderOfTable = ref({});

        //for bill 2
        const isTheSameInfo = ref(true);
        const currentBill = ref(0);
        const itemModel2 = ref({
            firstName: "",
            lastName: "",
            email: "",
            address: "",
            cardType: paymentEnum.OTHER,
            cardName: "",
            cardNumber: 0,
            experation: "",
            cvv: ""
        });
        const tempInfo = ref({
            firstName: "",
            lastName: "",
            email: "",
            address: "",
            cardType: paymentEnum.OTHER,
            cardName: "",
            cardNumber: 0,
            experation: "",
            cvv: ""
        });

        onMounted(() => {
            listConfirmedOrder.value = [];

            if (props.viewSettings.dataItem) {
                tableOrder.value = Object.assign({}, props.viewSettings.dataItem);
                tableOrder.value.listConfirmedOrder.forEach(element => {
                    listConfirmedOrder.value.push(orderIsConfirm(element));
                });
            }
        });


        const orderIsConfirm = (currentOrderItems: any) => {
            let confirmOrder = {
                listOrderId: currentOrderItems.listOrderId,
                totalCost: currentOrderItems.totalCost,
                totalCostStr: currentOrderItems.totalCost.toFixed(2),
                list: []
            }
            currentOrderItems.list.forEach(element => {
                if (element.quantity > 0) {
                    element.costStr = element.cost.toFixed(2);
                    confirmOrder.list.push(element)
                }
            });

            return confirmOrder;
        }

        const normalCheckout = (orderId: string) => {
            isLoading.value = true;
            ordersApi
                .checkoutOrder(orderId)
                .then((response: any) => {
                    if (response.status === 204) {
                        ElMessage({
                            message: `${t("The table's bill is now available")}`,
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


            // categoryStore.setActivateOrder(orderOfTable.value, true);
            // router.push('/bill')
        }

        const createBill = () => {
            const listOrderId = listConfirmedOrder.value[0].listOrderId;
            listOrderId.forEach(id => {
                normalCheckout(id);
            });
            
            setTimeout(() => {
                context.emit('onChangeView', {
                    viewName: 'ListData',
                    data: null,
                });
            }, 1000);
        }

        const backFn = () => {
            tableOrder.value.flow = false;
            const preStep = tableOrder.value.preStep[tableOrder.value.preStep.length - 1]
            context.emit('onChangeView', {
                viewName: preStep.value,
                data: tableOrder
            });
        }

        const showPreview = () => {
            isShowPreview.value = true;
            previewSettings.dataItem = makeData(currentBill.value);
        }

        const makeData = (index: number) => {
            const temp = tableOrder.value.zoneTable.split(' - ');
            const data = {
                billInfo: {
                    code: "Auto gen",
                    zone: temp[0],
                    table: temp[1],
                    timeIn: tableOrder.value.createdDate,
                    timeOut: new Date,
                    itemList: listConfirmedOrder.value[index].list,
                    subTotal: listConfirmedOrder.value[index].totalCostStr,
                    tax: (listConfirmedOrder.value[index].totalCost * taxPercent / 100).toFixed(2),
                    total: (listConfirmedOrder.value[index].totalCost + (listConfirmedOrder.value[index].totalCost * taxPercent / 100)).toFixed(2)
                },

                paymentInfo: {
                    card: index === 0 ? itemModel.value.cardType : itemModel2.value.cardType,
                    cardNumber: index === 0 ? itemModel.value.cardNumber : itemModel2.value.cardNumber
                }
            }

            return data
        }

        const selectBill = (billIndex: number) => {
            currentBill.value = billIndex;
        }

        watch(currentBill, () => {
            if (isShowPreview.value) {
                previewSettings.dataItem = makeData(currentBill.value);
            }
        });

        watch(isTheSameInfo, () => {
            if (isTheSameInfo.value) {
                tempInfo.value = copyItemModel(itemModel2.value);
                itemModel2.value = copyItemModel(itemModel.value)
            } else {
                itemModel2.value = copyItemModel(tempInfo.value);
            }
        });

        const copyItemModel = (obj: any) => {
            const temp =
            {
                firstName: obj.firstName,
                lastName: obj.lastName,
                email: obj.email,
                address: obj.address,
                cardType: obj.cardType,
                cardName: obj.cardName,
                cardNumber: obj.cardNumber,
                experation: obj.experation,
                cvv: obj.cvv

            }
            return temp;
        }
        return {
            t,
            formRef,
            rules,
            isLoading,
            tableOrder,
            paymentEnum,
            createBillLabel,
            statusEnum,
            isShowPreview,
            moneyType,
            createBill,
            showPreview,
            backFn,
            itemModel,
            listConfirmedOrder,
            previewSettings,
            isTheSameInfo,
            itemModel2,
            selectBill,
            currentBill
        };
    }
};
