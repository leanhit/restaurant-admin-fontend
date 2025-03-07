import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
import { zonesApi } from '@/api/zonesApi';
import { tablesApi } from '@/api/tablesApi';
import { useI18n } from 'vue-i18n';
import { viewNameEnum, statusEnum, allColorEnum } from '@/until/constant';
import defaultImg from '@/assets/defaultImg.png';

export default {
    props: ['viewSettings'],
    emits: ['onChangeView'],
    setup(props: any, context: any) {
        const { t } = useI18n();
        const isAddMode = ref(true);
        const zoneId = ref("");
        const isLoading = ref(false);
        const itemModel: any = ref({
            name: "",
            description: "",
            maxSeat: 6,
            status: statusEnum.AVAILABLE
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
            maxSeat: [noEmpty],
            status: [noEmpty]
        });

        const tableStatusOptions = reactive([
            {
                label: t(statusEnum.OCCUPIED),
                value: statusEnum.OCCUPIED
            },
            {
                label: t(statusEnum.AVAILABLE),
                value: statusEnum.AVAILABLE
            }, {
                label: t(statusEnum.UNAVAILABLE),
                value: statusEnum.UNAVAILABLE
            }
        ]);

        onMounted(() => {
            if (props.viewSettings.viewName === viewNameEnum.ADDTABLE) {
                zoneId.value = props.viewSettings.dataItem.id;
                isAddMode.value = true;
            } else if (props.viewSettings.viewName === viewNameEnum.EDITTABLE) {
                itemModel.value = props.viewSettings.dataItem;
                isAddMode.value = false;
            } else if (props.viewSettings.viewName === viewNameEnum.CLONETABLE) {
                itemModel.value = props.viewSettings.dataItem;                
                zoneId.value = props.viewSettings.dataItem.zoneId;
            }
        });

        function onSubmit(formEl: FormInstance | undefined) {
            isLoading.value = true;

            if (!formEl) return
            formEl.validate((valid) => {
                if (valid) {
                    const data = {
                        ...itemModel.value
                    };
                    
                    data.zoneId=zoneId.value;

                    if (props.viewSettings.viewName == viewNameEnum.ADDTABLE) {
                        actionAddData(data);
                    } else if (props.viewSettings.viewName === viewNameEnum.EDITTABLE) {
                        actionEditData(data);
                    } else if (props.viewSettings.viewName === viewNameEnum.CLONETABLE) {
                        const cloneData ={
                            name:data.name,
                            description:data.description,
                            maxSeat:data.maxSeat,
                            status:data.status,
                        }
                        actionAddData(cloneData);
                    }else {
                        console.log(props.viewSettings.viewName);
                    }
                } else {
                    console.log('error submit!')
                    isLoading.value = false;
                }
            });
        };

        function actionAddData(data: any) {
            isLoading.value = true;
        
            tablesApi
                .addTable(data)
                .then((response: any) => {
                    if (response.data) {
                        const temp = response.data.id ?? response.data.ID ?? "";
                        console.log("newData: ", response.data, [temp]);
                        addTableToZone([temp]);
                    } else {
                        ElMessage.error(`Oops, ${response.message || "Something went wrong!"}`);
                    }
                })
                .catch((error) => {
                    console.error("API Error:", error);
                })
                .finally(() => {
                    isLoading.value = false;
                });
        }
        

        function addTableToZone(data: any) {
            
            console.log("---------", data)
            zonesApi
                .addTableToZone(zoneId.value, data)
                .then((response: any) => {
                    if (response.data) {
                        if(props.viewSettings.viewName === viewNameEnum.CLONETABLE) {
                            ElMessageBox.confirm(
                                `${t("Clone successful. Clone other?")}`, t('Confirm'), {
                                dangerouslyUseHTMLString: true,
                                confirmButtonText: t(t("Yes")),
                                cancelButtonText: t('No'),
                                type: 'warning',
                            })
                                .then(() => {
                                    ElMessage({
                                        message: t('Successful!'),
                                        type: 'success',
                                    });
                                })
                                .catch(() => {
                                    context.emit('onChangeView', {
                                        viewName: viewNameEnum.LISTDATA,
                                        data: null,
                                    });
                                });
                        }else{
                            ElMessage({
                                message: t('Successful!'),
                                type: 'success',
                            });
                            context.emit('onChangeView', {
                                viewName: viewNameEnum.LISTDATA,
                                data: null,
                            });
                        }
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

        function actionEditData(data: any) {
            const itemId = ref(props.viewSettings.dataItem.id);
            tablesApi
                .updateTable(itemId.value, data)
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
            isAddMode,
            tableStatusOptions,
            viewNameEnum,
            defaultImg,
            allColorEnum,
            onSubmit
        };
    }
};
