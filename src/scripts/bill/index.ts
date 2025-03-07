import { defineAsyncComponent, ref, nextTick } from 'vue';
import SkeletonBox from '@/components/SkeletonBox.vue';
import { useI18n } from 'vue-i18n';

export default {
    components: {
        ListData: defineAsyncComponent({
            loader: () => import('@/views/bill/components/List.vue'),
            loadingComponent: SkeletonBox,
        }),
        AddBill: defineAsyncComponent({
            loader: () => import('@/views/bill/components/AddBill.vue'),
            loadingComponent: SkeletonBox,
        }),
        EditBill: defineAsyncComponent({
            loader: () => import('@/views/bill/components/AddBill.vue'),
            loadingComponent: SkeletonBox,
        }),
        BillDetail: defineAsyncComponent({
            loader: () => import('@/views/bill/components/BillDetail.vue'),
            loadingComponent: SkeletonBox,
        }),
    },
    setup() {
        const { t } = useI18n();
        const isChangeViewLoading = ref(false);
        const currentComponent = ref('ListData');
        const viewSettings = ref({
            viewName: 'ListData',
            title: t('Bill'),
            dataItem: null,
        });
        const changeView = (paramsObject: { viewName: string; data: any }) => {
            isChangeViewLoading.value = true;
            setTimeout(async () => {
                switch (paramsObject.viewName) {
                    case 'ListData':
                        viewSettings.value = {
                            viewName: 'ListData',
                            title: t('Bill'),
                            dataItem: null,
                        };
                        break;
                    case 'AddBill':
                        viewSettings.value = {
                            viewName: 'AddBill',
                            title: t('Add Bill'),
                            dataItem: paramsObject.data,
                        };
                        break;
                    case 'EditBill':
                        viewSettings.value = {
                            viewName: 'EditBill',
                            title: t('Edit Bill'),
                            dataItem: paramsObject.data,
                        };
                        break;
                    case 'BillDetail':
                        viewSettings.value = {
                            viewName: 'BillDetail',
                            title: t('Bill Detail'),
                            dataItem: paramsObject.data,
                        };
                        break;
                }
                await nextTick();
                currentComponent.value = paramsObject.viewName;
                isChangeViewLoading.value = false;
            }, 100);
        };
        return {
            isChangeViewLoading,
            currentComponent,
            viewSettings,
            changeView,
        };
    },
};
