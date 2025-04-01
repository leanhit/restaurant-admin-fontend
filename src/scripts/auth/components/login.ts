import { useI18n } from 'vue-i18n';
import { ref, onMounted } from "vue";
import { usersApi } from "@/api/usersApi";
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
    props: ["viewSettings"],
    emits: ["onChangeView"],
    setup(props: any, context: any) {
        const { t } = useI18n();
        const registerActive = ref(false);
        const nameLogin = ref("");
        const nameReg = ref("");
        const passwordLogin = ref("");
        const emailReg = ref("");
        const passwordReg = ref("");
        const confirmReg = ref("");
        const emptyFields = ref(false);

        function doLogin() {
            if (nameLogin.value === "" || passwordLogin.value === "") {
                alert("Please fill in all fields");
                emptyFields.value = true;
            } else {
                const data = {
                    username: nameLogin.value,
                    password: passwordLogin.value
                };

                usersApi.login(data).then((response) => {
                    if (response.data.token) {
                        localStorage.setItem("accessToken", response.data.token); // Lưu token
                        window.location.href = "/dashboard"; // Chuyển hướng
                    } else {
                        ElMessage.error(`Oops, ${response.data.message}`);
                    }
                }).catch((error) => {
                    console.error(error);
                });
            }
        }

        function doRegister() {
            const data = {
                username: nameReg.value,
                email: emailReg.value,
                password: passwordReg.value
            };

            if (emailReg.value === "" || passwordReg.value === "" || confirmReg.value === "") {
                emptyFields.value = true;
            } else {
                if (nameLogin.value === "" || passwordLogin.value === "") {
                    alert("Please fill in all fields");
                    emptyFields.value = true; // Gán giá trị cho reactive state
                } else {
                    const data = {
                        name: nameLogin.value,
                        email: emailReg.value,
                        password: passwordLogin.value
                    };

                    usersApi
                        .register(data)
                        .then((response: any) => {
                            console.log("response:", response.data);
                            alert("response:", response.data);
                            if (response.data) {
                                ElMessage({
                                    message: t('Successful!'),
                                    type: 'success',
                                });
                            } else {
                                ElMessage.error(`Oops, ${response.data.message}`);
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
                alert("You are now registered");
            }
        }

        return {
            t,
            registerActive,
            nameLogin,
            nameReg,
            passwordLogin,
            emailReg,
            passwordReg,
            confirmReg,
            emptyFields,
            doLogin,
            doRegister
        };
    },
};
