import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
import { zonesApi } from '@/api/zonesApi';
import { useDataCategoryStore } from '@/stores/dataCategory';
import { useI18n } from 'vue-i18n';
import {localCurrency,taxPercent} from '@/until/constant';
import moment from 'moment';

export default {
    props: ['viewSettings'],
    emits: ['onChangeView'],
    setup(props: any, context: any) {
        const { t } = useI18n();
        const categoryStore = useDataCategoryStore();
        const moneyType=ref(localCurrency);

        const itemModel = reactive({
            restaurantInfo: {
                name: "",
                address: "",
                sologan: ""
            },
            billInfo: {
                code: "",
                zone: "",
                table: "",
                timeIn: "",
                timeOut: "",
                itemList: [],
                subTotal:"",
                tax:"",
                total:""
            },
            paymentInfo: {
                card: "",
                cardNumber: 0
            }
        });

        onMounted(() => {
            itemModel.restaurantInfo.name = categoryStore.restaurantInfo.name;
            itemModel.restaurantInfo.address = categoryStore.restaurantInfo.address;
            itemModel.restaurantInfo.sologan = categoryStore.restaurantInfo.sologan;

            console.log(localCurrency,moneyType.value)

            if (props?.viewSettings?.dataItem) {
                itemModel.billInfo.code = props.viewSettings.dataItem.billInfo.code;
                itemModel.billInfo.zone = props.viewSettings.dataItem.billInfo.zone;
                itemModel.billInfo.table = props.viewSettings.dataItem.billInfo.table;
                itemModel.billInfo.timeIn = props.viewSettings.dataItem.billInfo.timeIn;
                itemModel.billInfo.timeOut = props.viewSettings.dataItem.billInfo.timeOut;
                itemModel.billInfo.itemList = props.viewSettings.dataItem.billInfo.itemList;

                itemModel.billInfo.subTotal = props.viewSettings.dataItem.billInfo.subTotal;
                itemModel.billInfo.tax = props.viewSettings.dataItem.billInfo.tax;
                itemModel.billInfo.total = props.viewSettings.dataItem.billInfo.total;

                itemModel.paymentInfo.card = props.viewSettings.dataItem.paymentInfo.card;
                itemModel.paymentInfo.cardNumber = props.viewSettings.dataItem.paymentInfo.cardNumber;
            }
        });

        const formatDateTime = (dateTime: Date) => {
            if (!dateTime) dateTime = new Date();
            return moment(dateTime).calendar(null, {
                sameDay: 'DD/MM/YYYY HH:mm:ss',
                lastDay: 'DD/MM/YYYY HH:mm:ss',
                nextDay: 'DD/MM/YYYY HH:mm:ss',
                lastWeek: 'DD/MM/YYYY HH:mm:ss',
                sameElse: 'DD/MM/YYYY HH:mm:ss',
            });
        }

        return {
            t,
            itemModel,
            moneyType,
            taxPercent,
            formatDateTime
        };
    }
};
