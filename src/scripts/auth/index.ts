import { defineAsyncComponent, ref, nextTick } from 'vue';
import SkeletonBox from '@/components/SkeletonBox.vue';
import { useI18n } from 'vue-i18n';

export default {
    components: {
        Login: defineAsyncComponent({
            loader: () => import('@/views/auth/components/Login.vue'),
            loadingComponent: SkeletonBox,
        })
    },
    setup() {
        const { t } = useI18n();
        const isChangeViewLoading = ref(false);
        
        const viewNameEnum = {
            LOGIN: 'Login'
            }
            const currentComponent = ref(viewNameEnum.LOGIN);
            const viewSettings = ref({
                viewName: viewNameEnum.LOGIN,
                title: t('Login'),
                dataItem: null,
            });
            
        const changeView = (paramsObject: { viewName: string; data: any }) => {
            isChangeViewLoading.value = true;
            setTimeout(async () => {
                switch (paramsObject.viewName) {
                    case viewNameEnum.LOGIN:
                        viewSettings.value = {
                            viewName: viewNameEnum.LOGIN,
                            title: t('Login'),
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
