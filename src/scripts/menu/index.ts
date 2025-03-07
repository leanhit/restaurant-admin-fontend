import { defineAsyncComponent, ref, nextTick } from 'vue';
import SkeletonBox from '@/components/SkeletonBox.vue';
import { useI18n } from 'vue-i18n';

export default {
    components: {
        ListData: defineAsyncComponent({
            loader: () => import('@/views/menu/components/List.vue'),
            loadingComponent: SkeletonBox,
        }),
        AddItem: defineAsyncComponent({
            loader: () => import('@/views/menu/components/AddItem.vue'),
            loadingComponent: SkeletonBox,
        }),
        EditItem: defineAsyncComponent({
            loader: () => import('@/views/menu/components/AddItem.vue'),
            loadingComponent: SkeletonBox,
        }),
        AddCategory: defineAsyncComponent({
            loader: () => import('@/views/menu/components/AddCategory.vue'),
            loadingComponent: SkeletonBox,
        }),
        EditCategory: defineAsyncComponent({
            loader: () => import('@/views/menu/components/AddCategory.vue'),
            loadingComponent: SkeletonBox,
        }),
        CloneItem: defineAsyncComponent({
            loader: () => import('@/views/menu/components/AddItem.vue'),
            loadingComponent: SkeletonBox,
        }),
        CloneCategory: defineAsyncComponent({
            loader: () => import('@/views/menu/components/AddCategory.vue'),
            loadingComponent: SkeletonBox,
        }),
    },
    setup() {
        const { t } = useI18n();
        const isChangeViewLoading = ref(false);
        const currentComponent = ref('ListData');
        const viewSettings = ref({
            viewName: 'ListData',
            title: t('Menu'),
            dataItem: null,
        });
        const changeView = (paramsObject: { viewName: string; data: any }) => {
            isChangeViewLoading.value = true;
            setTimeout(async () => {
                switch (paramsObject.viewName) {
                    case 'ListData':
                        viewSettings.value = {
                            viewName: 'ListData',
                            title: t("Menu"),
                            dataItem: null,
                        };
                        break;
                    case 'AddItem':
                        viewSettings.value = {
                            viewName: 'AddItem',
                            title: t('Add Item'),
                            dataItem: paramsObject.data,
                        };
                        break;
                    case 'EditItem':
                        viewSettings.value = {
                            viewName: 'EditItem',
                            title: t('Edit Item'),
                            dataItem: paramsObject.data,
                        };
                        break;
                    case 'AddCategory':
                        viewSettings.value = {
                            viewName: 'AddCategory',
                            title: t('Add Category'),
                            dataItem: null,
                        };
                        break;
                    case 'EditCategory':
                        viewSettings.value = {
                            viewName: 'EditCategory',
                            title: t('Edit Category'),
                            dataItem: paramsObject.data,
                        };
                        break;
                    case 'CloneItem':
                        viewSettings.value = {
                            viewName: 'CloneItem',
                            title: t('Clone Item'),
                            dataItem: paramsObject.data,
                        };
                        break;
                    case 'CloneCategory':
                        viewSettings.value = {
                            viewName: 'CloneCategory',
                            title: t('Clone Category'),
                            dataItem: null,
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
