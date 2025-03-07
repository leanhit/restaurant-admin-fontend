import { ref, reactive, onMounted} from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
import { zonesApi } from '@/api/zonesApi';
import { useDataCategoryStore } from '@/stores/dataCategory';
import { useI18n } from 'vue-i18n';
import defaultImg from '@/assets/defaultImg.png';
import { allColorEnum } from '@/until/constant';

export default {
    props: ['viewSettings'],
    emits: ['onChangeView'],
    setup(props: any, context: any) {
        const { t } = useI18n();
        const categoryStore = useDataCategoryStore();
        const isLoading = ref(false);
        const itemModel = ref({
            name:"",
            description:"",
            maxTable: 0,
            maxSeat:0
        });
        const formRef = ref<FormInstance>();
        const noEmpty = {
            required: true,
            message: t('This fiel is required'),
            trigger: 'blur',
        }
        const rules = reactive<FormRules>({
            name: [noEmpty],
            description: [noEmpty],
        });

        onMounted(()=>{
            if(props.viewSettings.dataItem){
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

                    if (props.viewSettings.viewName == 'AddZone') {
                        actionAddData(data);
                    } else if (props.viewSettings.viewName === 'EditZone') {
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
            zonesApi
                .addZone(data)
                .then((response: any) => {
                    if (response.data) {
                        ElMessage({
                            message: t('Successful!'),
                            type: 'success',
                        });
                        categoryStore.setCurrentZoneId(response.data.id);
                        context.emit('onChangeView', {
                            viewName: 'ListData',
                            data: null,
                        });
                    } else {
                        ElMessage.error(`Oops, ${response.data.message}`);
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
            zonesApi
                .updateZone(itemId.value, data)
                .then((response: any) => {
                    if (response.data) {
                        ElMessage({
                            message: t('Successful!'),
                            type: 'success',
                        });
                        context.emit('onChangeView', {
                            viewName: 'ListData',
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
            defaultImg,
            allColorEnum,
            onSubmit
        };
    }
};
