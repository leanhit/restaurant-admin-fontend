import { defineAsyncComponent, ref, nextTick } from 'vue';
import SkeletonBox from '@/components/SkeletonBox.vue';
import { viewNameEnum } from '@/until/constant';
import { useI18n } from 'vue-i18n';

export default {
    components: {
        ListData: defineAsyncComponent({
            loader: () => import('@/views/zoneTable/components/List.vue'),
            loadingComponent: SkeletonBox,
        }),
        AddTable: defineAsyncComponent({
            loader: () => import('@/views/zoneTable/components/AddTable.vue'),
            loadingComponent: SkeletonBox,
        }),
        EditTable: defineAsyncComponent({
            loader: () => import('@/views/zoneTable/components/AddTable.vue'),
            loadingComponent: SkeletonBox,
        }),
        AddZone: defineAsyncComponent({
            loader: () => import('@/views/zoneTable/components/AddZone.vue'),
            loadingComponent: SkeletonBox,
        }),
        EditZone: defineAsyncComponent({
            loader: () => import('@/views/zoneTable/components/AddZone.vue'),
            loadingComponent: SkeletonBox,
        }),
        CreateOrder: defineAsyncComponent({
            loader: () => import('@/views/zoneTable/components/createOrder/Create.vue'),
            loadingComponent: SkeletonBox,
        }),
        CreateBill: defineAsyncComponent({
            loader: () => import('@/views/zoneTable/components/createBill/Confirm.vue'),
            loadingComponent: SkeletonBox,
        }),
        CloneTable: defineAsyncComponent({
            loader: () => import('@/views/zoneTable/components/AddTable.vue'),
            loadingComponent: SkeletonBox,
        }),
        CloneZone: defineAsyncComponent({
            loader: () => import('@/views/zoneTable/components/AddZone.vue'),
            loadingComponent: SkeletonBox,
        }),
        MergeBill: defineAsyncComponent({
            loader: () => import('@/views/zoneTable/components/createBill/Merge.vue'),
            loadingComponent: SkeletonBox,
        }),

        Merge: defineAsyncComponent({
            loader: () => import('@/views/zoneTable/components/createBill/Merge.vue'),
            loadingComponent: SkeletonBox,
        }),
        Split: defineAsyncComponent({
            loader: () => import('@/views/zoneTable/components/createBill/Split.vue'),
            loadingComponent: SkeletonBox,
        }),
        Review: defineAsyncComponent({
            loader: () => import('@/views/zoneTable/components/createOrder/Review.vue'),
            loadingComponent: SkeletonBox,
        }),
        Confirm: defineAsyncComponent({
            loader: () => import('@/views/zoneTable/components/createBill/Confirm.vue'),
            loadingComponent: SkeletonBox,
        }),
        BillInfo: defineAsyncComponent({
            loader: () => import('@/views/zoneTable/components/createBill/Info.vue'),
            loadingComponent: SkeletonBox,
        }),
    },
    setup() {
        const { t } = useI18n();
        const isChangeViewLoading = ref(false);
        const currentComponent = ref(viewNameEnum.LISTDATA);
        const viewSettings = ref({
            viewName: viewNameEnum.LISTDATA,
            title: t('ZoneTable'),
            dataItem: null,
        });
        const changeView = (paramsObject: { viewName: string; data: any }) => {
            isChangeViewLoading.value = true;
            setTimeout(async () => {
                switch (paramsObject.viewName) {
                    case viewNameEnum.LISTDATA:
                        viewSettings.value = {
                            viewName: viewNameEnum.LISTDATA,
                            title: t('ZoneTable'),
                            dataItem: null,
                        };
                        break;
                    case viewNameEnum.ADDTABLE:
                        viewSettings.value = {
                            viewName: viewNameEnum.ADDTABLE,
                            title: t('Add Table'),
                            dataItem: paramsObject.data,
                        };
                        break;
                    case viewNameEnum.EDITTABLE:
                        viewSettings.value = {
                            viewName: viewNameEnum.EDITTABLE,
                            title: t('Edit Table'),
                            dataItem: paramsObject.data,
                        };
                        break;
                    case viewNameEnum.ADDZONE:
                        viewSettings.value = {
                            viewName: viewNameEnum.ADDZONE,
                            title: t('Add Zone'),
                            dataItem: null,
                        };
                        break;
                    case viewNameEnum.EDITZONE:
                        viewSettings.value = {
                            viewName: viewNameEnum.EDITZONE,
                            title: t('Edit Zone'),
                            dataItem: paramsObject.data,
                        };
                        break;
                    case viewNameEnum.CREATEORDER:
                        viewSettings.value = {
                            viewName: viewNameEnum.CREATEORDER,
                            title: t('Create Order'),
                            dataItem: paramsObject.data,
                        };
                        break;
                    case viewNameEnum.CREATEBILL:
                        viewSettings.value = {
                            viewName: viewNameEnum.CREATEBILL,
                            title: t('Create Bill'),
                            dataItem: paramsObject.data,
                        };
                        break;
                    case viewNameEnum.CLONEZONE:
                        viewSettings.value = {
                            viewName: viewNameEnum.CLONEZONE,
                            title: t('Clone Zone'),
                            dataItem: paramsObject.data,
                        };
                        break;
                    case viewNameEnum.CLONETABLE:
                        viewSettings.value = {
                            viewName: viewNameEnum.CLONETABLE,
                            title: t('Clone Table'),
                            dataItem: paramsObject.data,
                        };
                        break;
                    case viewNameEnum.MERGEBILL:
                        viewSettings.value = {
                            viewName: viewNameEnum.MERGEBILL,
                            title: t('Create Bill'),
                            dataItem: paramsObject.data,
                        };
                        break;

                    case viewNameEnum.MERGE:
                        viewSettings.value = {
                            viewName: viewNameEnum.MERGE,
                            title: t('Merge Order'),
                            dataItem: paramsObject.data,
                        };
                        break;;
                    case viewNameEnum.SPLIT:
                        viewSettings.value = {
                            viewName: viewNameEnum.SPLIT,
                            title: t('Split Order'),
                            dataItem: paramsObject.data,
                        };
                        break;;
                    case viewNameEnum.REVIEW:
                        viewSettings.value = {
                            viewName: viewNameEnum.REVIEW,
                            title: t('Review Bill'),
                            dataItem: paramsObject.data,
                        };
                        break;
                    case viewNameEnum.CONFIRM:
                        viewSettings.value = {
                            viewName: viewNameEnum.CONFIRM,
                            title: t('Confirm Order'),
                            dataItem: paramsObject.data,
                        };
                        break;
                    case viewNameEnum.BILLINFO:
                        viewSettings.value = {
                            viewName: viewNameEnum.BILLINFO,
                            title: t('Bill Info'),
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
