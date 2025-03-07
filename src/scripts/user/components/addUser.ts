import { ref, reactive, onMounted, watch} from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { usersApi } from '@/api/usersApi';
import defaultImg from '@/assets/defaultImg.png';

export default {
    props: ['viewSettings'],
    emits: ['onChangeView'],
    setup(props: any, context: any) {
        const { t } = useI18n();
        const isLoading = ref(false);
        const itemModel = ref({
            email:"",
            password:"",
            repassword: "",
        });
        const formRef = ref<FormInstance>();
        const noEmpty = {
            required: true,
            message: t('This fiel is required'),
            trigger: 'blur',
        }
        const rules = reactive<FormRules>({
            email: [noEmpty],
            password: [noEmpty],
            repassword: [noEmpty],
        });

        onMounted(()=>{
            if(props.viewSettings.dataItem){
                itemModel.value = props.viewSettings.dataItem;
                
            console.log("---->1 editUser",itemModel.value);
            }
        });
        watch(() => props.viewSettings.dataItem, (newValue) => {
            if (newValue) {
              itemModel.value = newValue;
              console.log("Updated itemModel:", itemModel.value);
            }
          }, { immediate: true });

        function onSubmit(formEl: FormInstance | undefined) {
            //isLoading.value = true;
            if (!formEl) return
            formEl.validate((valid) => {
                if (valid) {
                    const data = {
                        email: itemModel.value.email,
                        password: itemModel.value.password
                    };
                    if (props.viewSettings.viewName == 'AddUser') {
                        actionAddData(data);
                    } else if (props.viewSettings.viewName === 'EditUser') {
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
            console.log("---->2",data);
            usersApi
                .createUser(data)
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
            usersApi
                .updateUser(data)
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
            onSubmit
        };
    }
};
