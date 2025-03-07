import { ref, reactive, watch, onMounted } from "vue";
import { useDataCategoryStore } from "@/stores/dataCategory";
import { statusEnum, allColorEnum, localCurrency, viewNameEnum } from "@/until/constant";
import { useI18n } from 'vue-i18n';
import defaultImg from "@/assets/defaultImg.png";
import { defineAsyncComponent, nextTick } from 'vue';
import SkeletonBox from '@/components/SkeletonBox.vue';

import { Line, Pie, Bar } from 'vue-chartjs'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement 
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    ArcElement, Tooltip, Legend,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    BarElement
    )

export default {    
    components: {
        TimeSelect: defineAsyncComponent({
            loader: () => import('@/views/dashboard/components/TimeSelect.vue'),
            loadingComponent: SkeletonBox,
        }),
         Line, Pie, Bar 
    },    
    props: ["viewSettings"],
    emits: ["onChangeView"],
    setup() {
        const { t } = useI18n();
        const categoryStore = useDataCategoryStore();
        const moneyType = ref(localCurrency);
        

        const headData = ref([{
            name: "",
            value: 0,
            percent: "string",
            compareWith: "",
            url: ""
        }]);

        const data = {
            labels: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
            datasets: [{
                data: [860, 1140, 1060, 1060, 1070, 1110, 1330, 2210, 7830, 2478],
                borderColor: "red",
                fill: false
            }, {
                data: [1600, 1700, 1700, 1900, 2000, 2700, 4000, 5000, 6000, 7000],
                borderColor: "green",
                fill: false
            }, {
                data: [300, 700, 2000, 5000, 6000, 4000, 2000, 1000, 200, 100],
                borderColor: "blue",
                fill: false
            }]
        }

        const options = {
            responsive: true,
            maintainAspectRatio: false
        }

        //----------------------
        const data1 =  {
            labels: [statusEnum.DONE, statusEnum.REJECTED, statusEnum.CANCELLED, statusEnum.FAILED],
            datasets: [
              {
                backgroundColor: [allColorEnum.DONE, allColorEnum.REJECTED, allColorEnum.CANCELLED, allColorEnum.FAILED],
                data: [150, 20, 3, 10]
              }
            ]
          }
        const options1 =  {
            responsive: true,
            maintainAspectRatio: false
        
        }
        //-------------------------------------------
        const data3 = {
            labels: [
              t('January'),
              t('February'),
              t('March'),
              t('April'),
              t('May'),
              t('June'),
              t('July'),
              t('August'),
              t('September'),
              t('October'),
              t('November'),
              t('December')
            ],
            datasets: [
              {
                label: t('Data One'),
                backgroundColor: allColorEnum.DONE,
                data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
              }
            ]
          }

          const options3 = {
            responsive: true,
            maintainAspectRatio: false
          }
          

        onMounted(() => {
            headData.value = [];
            headData.value.push({
                name: t("Today Money"),
                value: 19666.3,
                percent: "20%",
                compareWith: t("Yesterday"),
                url: defaultImg
            });

            headData.value.push({
                name: t("Today Order"),
                value: 19666.3,
                percent: "20%",
                compareWith: t("Yesterday"),
                url: defaultImg
            });

            headData.value.push({
                name: t("Today Order"),
                value: 19666.3,
                percent: "20%",
                compareWith: t("Yesterday"),
                url: defaultImg
            });

            headData.value.push({
                name: t("Today Order"),
                value: 19666.3,
                percent: "20%",
                compareWith: t("Yesterday"),
                url: defaultImg
            });
        });

        const getTimeSelect=(data:any)=>{
            console.log(data)
        }

        return {
            t,
            headData,
            data,
            options,
            data1,
            options1,
            data3,
            options3,
            getTimeSelect,
            moneyType
        }
    }
}