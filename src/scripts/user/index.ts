import { defineAsyncComponent, ref, nextTick } from 'vue';
import SkeletonBox from '@/components/SkeletonBox.vue';
import { useI18n } from 'vue-i18n';

export default {
    components: {
        ListData: defineAsyncComponent({
            loader: () => import('@/views/user/components/List.vue'),
            loadingComponent: SkeletonBox,
        }),
        AddUser: defineAsyncComponent({
            loader: () => import('@/views/user/components/AddUser.vue'),
            loadingComponent: SkeletonBox,
        }),
        EditUser: defineAsyncComponent({
            loader: () => import('@/views/user/components/AddUser.vue'),
            loadingComponent: SkeletonBox,
        }),
    },
    setup() {
        const { t } = useI18n();
        const isChangeViewLoading = ref(false);
        
        const viewNameEnum = {
            LISTDATA: 'ListData',
            ADDUSER: 'AddUser',
            EDITUSER: 'EditUser'
            }
            const currentComponent = ref(viewNameEnum.LISTDATA);
            const viewSettings = ref({
                viewName: viewNameEnum.LISTDATA,
                title: t('User'),
                dataItem: null,
            });
            
        const changeView = (paramsObject: { viewName: string; data: any }) => {
            isChangeViewLoading.value = true;
            setTimeout(async () => {
                switch (paramsObject.viewName) {
                    case viewNameEnum.LISTDATA:
                        viewSettings.value = {
                            viewName: viewNameEnum.LISTDATA,
                            title: t('User'),
                            dataItem: null,
                        };
                        break;
                    case viewNameEnum.ADDUSER:
                        viewSettings.value = {
                            viewName: viewNameEnum.ADDUSER,
                            title: t('Add User'),
                            dataItem: paramsObject.data,
                        };
                        break;
                    case viewNameEnum.EDITUSER:
                        viewSettings.value = {
                            viewName: viewNameEnum.EDITUSER,
                            title: t('Edit User'),
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
