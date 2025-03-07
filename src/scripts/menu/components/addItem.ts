import { ref, reactive, onMounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus';
import { categoryApi } from '@/api/categoryApi';
import { itemsApi } from '@/api/itemsApi';
import { useI18n } from 'vue-i18n';
import { useDataCategoryStore } from '@/stores/dataCategory';
import { statusEnum, allColorEnum } from '@/until/constant';
import { viewNameEnum } from '@/until/constant';
import defaultImg from '@/assets/defaultImg.png';

export default {
    props: ['viewSettings'],
    emits: ['onChangeView'],
    setup(props: any, context: any) {
        const { t } = useI18n();
        const categoryStore = useDataCategoryStore();
        const menu = ref({});
        const isLoading = ref(false);
        const isShowModal = ref(false);
        const viewName = ref("");
        const formRefAddMore = ref<FormInstance>();
        const itemPhotos = ref([""]);
        const photoIndex = ref(0);
        const itemModel: any = ref({
            categoryId: "",
            name: "",
            description: "",
            maxStock: 0,
            price: 0,
            availableStatus: "AVAILABLE",
            photos: [""]
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
            maxStock: [noEmpty],
            photos: [noEmpty],
            price: [noEmpty],
            availableStatus: [noEmpty],
            categoryId: [noEmpty]
        });

        const itemStatusOptions = reactive([
            {
                label: t(statusEnum.HIDE),
                value: statusEnum.HIDE
            },
            {
                label: t(statusEnum.AVAILABLE),
                value: statusEnum.AVAILABLE
            }, {
                label: t(statusEnum.UNAVAILABLETODAY),
                value: statusEnum.UNAVAILABLETODAY
            }, {
                label: t(statusEnum.UNAVAILABLE),
                value: statusEnum.UNAVAILABLE
            }
        ]);

        onMounted(() => {
            viewName.value = props.viewSettings.viewName;
            getMenu();
            photoIndex.value = 0;
            if (viewName.value === viewNameEnum.ADDITEM) {
                itemModel.value.categoryId = props.viewSettings.dataItem.id;
                itemPhotos.value = [""];
            } else if (viewName.value === viewNameEnum.EDITITEM) {
                itemModel.value = props.viewSettings.dataItem;
                copyImg_();

                if (itemModel.value.categoryId === "") {
                    itemModel.value.categoryId = findCategoryId_(itemModel.value.id);
                }
            } else if (viewName.value === viewNameEnum.CLONEITEM) {
                itemModel.value = props.viewSettings.dataItem;
                copyImg_();

                if (itemModel.value.categoryId === "") {
                    itemModel.value.categoryId = findCategoryId_(itemModel.value.id);
                }
            } else {
                console.log("Something went wrong")!
            }
        });

        const copyImg_ = () => {
            if (itemModel.value.photos.length > 0) {
                itemPhotos.value = [];
                itemModel.value.photos.forEach(img => {
                    const temp = img;
                    itemPhotos.value.push(temp);
                })
            } else {
                itemPhotos.value = [""];
            }
        }
        const findCategoryId_ = (itemId: string) => {
            let id = "";
            categoryStore.menu.forEach(category => {
                category.items.forEach(item => {
                    if (item.id === itemId) {
                        id = category.id;
                    }
                });
            });

            return id;
        }

        async function getMenu() {
            await categoryStore.getMenu();
            menu.value = categoryStore.menu;
        }

        function onSubmit(formEl: FormInstance | undefined) {
            isLoading.value = true;

            if (!formEl) return
            formEl.validate((valid) => {
                if (valid) {
                    const data = {
                        ...itemModel.value
                    };

                    if (viewName.value == viewNameEnum.ADDITEM) {
                        actionAddData(data);
                    } else if (viewName.value === viewNameEnum.EDITITEM) {
                        actionEditData(data);
                    } else if (viewName.value === viewNameEnum.CLONEITEM) {
                        const cloneData = {
                            availableStatus: data.availableStatus,
                            description: data.description,
                            maxStock: data.maxStock,
                            name: data.name,
                            photos: data.photos,
                            price: data.price
                        }
                        actionAddData(cloneData);
                    } else {
                        console.log(viewName.value);
                    }
                } else {
                    console.log('error submit!')
                    isLoading.value = false;
                }
            });
        };

        function actionAddData(data: any) {
            itemsApi
                .addItem(data)
                .then((response: any) => {
                    if (response.data) {
                        const newData = [response.data.id];
                        addItemToCategory(newData);
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

        function addItemToCategory(data: any) {
            categoryApi
                .addItemToCategory(itemModel.value.categoryId, data)
                .then((response: any) => {
                    if (response.data) {                        
                        if (viewName.value === viewNameEnum.CLONEITEM) {
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
            const id = ref(props.viewSettings.dataItem.id);
            itemsApi
                .updateItem(id.value, data)
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

        const handleClose = (done: () => void) => {
            done();
        }

        const removeImg = (index: number) => {
            itemPhotos.value.splice(index, 1);
        }

        const addImg = () => {
            itemPhotos.value.push("");
        }

        const addImages = () => {
            if (itemPhotos.value[0].length > 0) {
                itemModel.value.photos = [];
                let index = 0;
                itemPhotos.value.forEach(img => {
                    if (img !== "" && photoIndex.value !== 0 && index === photoIndex.value) {
                        const temp = itemPhotos.value[0];
                        itemPhotos.value[0] = itemPhotos.value[photoIndex.value];
                        itemPhotos.value[photoIndex.value] = temp;
                        photoIndex.value = 0;
                    }
                    index++;
                });

                itemPhotos.value.forEach(img => {
                    if (img !== "") {
                        itemModel.value.photos.push(img);
                    }
                })

            } else {
                console.log("aaaaaaaaa")
            }
            isShowModal.value = false;
        }

        const resetForm = (formEl: FormInstance | undefined) => {
            console.log("------", itemModel.value.photos)

            itemPhotos.value = itemModel.value.photos;
        }

        return {
            removeImg, addImg, addImages, itemPhotos,
            t,
            isLoading,
            itemModel,
            formRef,
            rules,
            itemStatusOptions,
            menu,
            isShowModal,
            onSubmit,
            statusEnum,
            allColorEnum,
            viewName,
            handleClose,
            formRefAddMore,
            resetForm,
            photoIndex,
            viewNameEnum,
            defaultImg
        };
    }
};
