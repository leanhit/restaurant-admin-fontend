import { ref, reactive, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
import { categoryApi } from '@/api/categoryApi';
import { useDataCategoryStore } from '@/stores/dataCategory';
import { useI18n } from 'vue-i18n';
import defaultImg from '@/assets/defaultImg.png';
import {
    allColorEnum,
    supportedLocales,
    currencyEnum,
    localCurrency,
    currentLanguage
} from '@/until/constant';

import { defineAsyncComponent, nextTick } from 'vue';
import SkeletonBox from '@/components/SkeletonBox.vue';

export default { 
    components: {
        Logo: defineAsyncComponent({
            loader: () => import('@/views/settings/components/Logo.vue'),
            loadingComponent: SkeletonBox,
        })
    },    
    props: ['viewSettings'],
    emits: ['onChangeView'],
    setup(props: any, context: any) {
        const { t } = useI18n();
        const categoryStore = useDataCategoryStore();
        const isLoading = ref(false);
        const selectLanguage = ref(currentLanguage);
        const selectCurrency = ref(localCurrency);
        const itemModel = ref({
            name: "",
            sologan:"",
            address:"",
            email:"",
            phone:"",
        });
        const formRef = ref<FormInstance>();
        const noEmpty = {
            required: true,
            message: t('This fiel is required'),
            trigger: 'blur',
        }
        const rules = reactive<FormRules>({
            name: [noEmpty],
            sologan: [noEmpty],
            address: [noEmpty],
            email: [noEmpty],
            phone: [noEmpty],
        });


        onMounted(() => {
            if (selectLanguage.value === null) {
                selectLanguage.value = "en";
            }

            if (selectCurrency.value === null) {
                selectCurrency.value = "$";
            }

        });



        watch(selectLanguage, () => {
            localStorage.setItem('restaurentLocale', selectLanguage.value);
            location.reload();
        });


        watch(selectCurrency, () => {
            localStorage.setItem('restaurantCurrency', selectCurrency.value);
            location.reload();
        });

        function onSubmit(formEl: FormInstance | undefined) {
            isLoading.value = true;

            if (!formEl) return
            formEl.validate((valid) => {
                if (valid) {
                    const data = {
                        ...itemModel.value
                    };
                    
                } else {
                    console.log('error submit!')
                    isLoading.value = false;
                }
            });
        };

        return {
            t,
            isLoading,
            itemModel,
            formRef,
            rules,
            defaultImg,
            allColorEnum,
            supportedLocales,
            currencyEnum,
            selectLanguage,
            selectCurrency,
            onSubmit
        };
    }
};
