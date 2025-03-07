import { useI18n } from 'vue-i18n';
import { ref, onMounted } from "vue";
import { usersApi } from "@/api/usersApi";
import { ElMessage, ElMessageBox  } from 'element-plus';
import { useDataCategoryStore } from "@/stores/dataCategory";

export default {
    props: ["viewSettings"],
    emits: ["onChangeView"],
    setup(props: any, context: any) {
        const { t } = useI18n();
        const categoryStore = useDataCategoryStore();
        const listItems = ref([]);
        const isLoading = ref(false);
        onMounted(() => {
            refreshDataFn();
        });

        async function refreshDataFn() {
            await categoryStore.getUsers();
            listItems.value = categoryStore.users;
            console.log('listItems:', listItems.value);
        };
        
        const deleteUser = (item: any) => {
            ElMessageBox.confirm(
                `${t("Do you realy remove")} ${t("user")} <strong class="text-primary">${item.Email}</strong>`, t('Confirm'), {
                dangerouslyUseHTMLString: true,
                confirmButtonText: t("Yes"),
                cancelButtonText: t("No"),
                type: 'warning',
            })
                .then(() => {
                    usersApi
                        .deleteUser(item.ID)
                        .then((respond) => {
                            console.log('respond:', respond);
                            if (respond) {
                                if (respond.status == 200) {
                                    ElMessage({
                                        dangerouslyUseHTMLString: false,
                                        type: 'success',
                                        message: t("Successful!"),
                                    });
                                } else {
                                    ElMessage({
                                        dangerouslyUseHTMLString: true,
                                        type: 'info',
                                        message: `${t("An error occurred while deleting")} ${t("table")} <strong class="text-primary">${item.name}</strong>. ${t("It cannot be deleted")}`,
                                    });
                                }
                            }
                        })
                        .catch(() => {
                            ElMessage({
                                dangerouslyUseHTMLString: true,
                                type: 'info',
                                message: t("Successful!"),
                            })
                        });
                })
                .catch(() => {
                    ElMessage({
                        dangerouslyUseHTMLString: true,
                        type: 'info',
                        message: `${t("The user")} <strong class="text-primary">${item.Email}</strong> ${t("deletion command has been cancelled")}`,
                    })
                });

            refreshDataFn();
        };

        return {
            t,
            isLoading,
            listItems,
            refreshDataFn,
            deleteUser
        };
    },
};
