import { ref, onMounted } from "vue";
import { useI18n } from 'vue-i18n';
import moment from 'moment';

export default {
    props: ["selectSettings"],
    emits: ["timeResult"],
    setup() {
        const { t } = useI18n();
        const filterData = ref("");
        const filter = ref("");
        const listItems = ref([]);
        const isLoading = ref(false)
        const selectSettings = ref({});

        onMounted(() => {
        });

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

        return {
            t,
            isLoading,
            listItems,
            filterData,
            filter,
            formatDateTime,
            selectSettings
        };
    },
};
