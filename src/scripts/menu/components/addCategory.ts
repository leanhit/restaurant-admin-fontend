import { ref, reactive, onMounted} from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
import { categoryApi } from '@/api/categoryApi';
import { useDataCategoryStore } from '@/stores/dataCategory';
import { useI18n } from 'vue-i18n';
import defaultImg from '@/assets/defaultImg.png';
import { allColorEnum , statusEnum, viewNameEnum} from '@/until/constant';

export default {
    props: ['viewSettings'],
    emits: ['onChangeView'],
    setup(props: any, context: any) {
        const { t } = useI18n();
        const categoryStore = useDataCategoryStore();
        const isLoading = ref(false);
        const itemModel = ref({
            name:"",
            availableStatus:statusEnum.AVAILABLE,
        });
        const formRef = ref<FormInstance>();
        const noEmpty = {
            required: true,
            message: t('This fiel is required'),
            trigger: 'blur',
        }
        const rules = reactive<FormRules>({
            name: [noEmpty],
            descavailableStatusription: [noEmpty],
        });
        const categoryStatusOptions = reactive([
            {
                label: t(statusEnum.HIDE),
                value: statusEnum.HIDE
            },
            {
                label: t(statusEnum.AVAILABLE),
                value: statusEnum.AVAILABLE
            }, {
                label: t(statusEnum.UNAVAILABLE),
                value: statusEnum.UNAVAILABLE
            }
        ]);
        
        onMounted(()=>{
            if(props.viewSettings.viewName === viewNameEnum.EDITCATEGORY){
                itemModel.value = props.viewSettings.dataItem;
            }
        })

        function onSubmit(formEl: FormInstance | undefined) {
            isLoading.value = true;

            if (!formEl) return
            formEl.validate((valid) => {
                if (valid) {
                    const data = {
                        ...itemModel.value
                    };

                    if (props.viewSettings.viewName == viewNameEnum.ADDCATEGORY) {
                        actionAddData(data);
                    } else if (props.viewSettings.viewName === viewNameEnum.EDITCATEGORY) {
                        actionEditData(data);
                    } else {
                        console.log(props.viewSettings.viewName);
                    }
                } else {
                    console.log('error submit!')
                    isLoading.value = false;
                }
            });
        };

        function actionAddData(data:any) {
            categoryApi
                .addCategory(data)
                .then((response: any) => {
                    if (response.data) {
                        ElMessage({
                            message: t('Successful!'),
                            type: 'success',
                        });
                        categoryStore.setCurrentCategoryId(response.data.id)
                        context.emit('onChangeView', {
                            viewName: viewNameEnum.LISTDATA,
                            data: null,
                        });
                    } else {
                        ElMessage.error(`Oops, ${response.message}`);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    isLoading.value = false;
                });
            isLoading.value = false;
        }

        function actionEditData(data:any) {
            const itemId = ref(props.viewSettings.dataItem.id);
            categoryApi
                .updateCategory(itemId.value, data)
                .then((response: any) => {
                    if (response.data) {
                        ElMessage({
                            message: t('Successful!'),
                            type: 'success',
                        });
                        context.emit('onChangeView', {
                            viewName: viewNameEnum.LISTDATA,
                            data: null,
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

            isLoading.value = false;

        }

        return {
            t,
            isLoading,
            itemModel,
            formRef,
            rules,
            categoryStatusOptions,
            defaultImg,
            allColorEnum,
            viewNameEnum,
            onSubmit
        };
    }
};
