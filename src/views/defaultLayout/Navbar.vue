<script lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { supportedLocales, currentLanguage } from '@/until/constant';

export default {
    setup() {
        const { t } = useI18n();
        const currentLocale = ref(currentLanguage);
        if (currentLocale.value === null) {
            currentLocale.value = "en";
        }

        const currentFlag = ref("currentLocale[0].flag");
        const setFlag = () => {
            supportedLocales.forEach(locale => {
                if (locale.value === currentLocale.value) {
                    currentFlag.value = locale.flag;
                }
            });
        }
        setFlag();

        const changeLocale = (newLocale: string) => {
            localStorage.setItem('restaurentLocale', newLocale);
            setFlag();
            location.reload();
        }

        onMounted(() => {
            const recaptchaScript = document.createElement("script");
            recaptchaScript.setAttribute(
                "src",
                "/js/app.js"
            );
            document.head.appendChild(recaptchaScript);
        });
        return {
            t,
            changeLocale,
            currentLocale,
            currentFlag,
            supportedLocales,
        }
    }
}
</script>
<template>
    <nav class="navbar-custom">

    <ul class="list-inline float-right mb-0">
        <!-- language-->
        <!-- <li class="list-inline-item hide-phone app-search">
                                    <form role="search" class="">
                                        <input type="text" placeholder="Search..." class="form-control">
                                        <a href=""><i class="fa fa-search"></i></a>
                                    </form>
                                </li> -->
        <li class="list-inline-item dropdown notification-list hide-phone">
            <a class="nav-link dropdown-toggle arrow-none waves-effect text-white" data-toggle="dropdown" href="#"
                role="button" aria-haspopup="false" aria-expanded="false">
                <img :src="currentFlag" class="ml-2" height="16" alt="" />
            </a>
            <div class="dropdown-menu dropdown-menu-right language-switch">
                <a class="dropdown-item" href="#" v-for="locale in supportedLocales" :key="locale.value"
                    @click="changeLocale(locale.value)">
                    <img :src="locale.flag" alt="" height="16" /><span> {{ locale.label }}
                    </span></a>
            </div>
        </li>

        <!-- <li class="list-inline-item dropdown notification-list">
                                    <a class="nav-link dropdown-toggle arrow-none waves-effect" data-toggle="dropdown"
                                        href="#" role="button" aria-haspopup="false" aria-expanded="false">
                                        <i class="ti-email noti-icon"></i>
                                        <span class="badge badge-danger noti-icon-badge">5</span>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right dropdown-arrow dropdown-menu-lg">
                                        
                                        <div class="dropdown-item noti-title">
                                            <h5><span class="badge badge-danger float-right">745</span>Messages</h5>
                                        </div>

                                        
                                        <a href="javascript:void(0);" class="dropdown-item notify-item">
                                            <div class="notify-icon"><img src="/images/users/avatar-2.jpg" alt="user-img"
                                                    class="img-fluid rounded-circle" /> </div>
                                            <p class="notify-details"><b>Charles M. Jones</b><small class="text-muted">Dummy
                                                    text of the printing and typesetting industry.</small></p>
                                                        </a>

                                        
                                                        <a href="javascript:void(0);" class="dropdown-item notify-item">
                                                            <div class="notify-icon"><img src="/images/users/avatar-3.jpg" alt="user-img"
                                                                    class="img-fluid rounded-circle" /> </div>
                                                            <p class="notify-details"><b>Thomas J. Mimms</b><small class="text-muted">You
                                                        have 87 unread messages</small></p>
                                        </a>

                                        
                                        <a href="javascript:void(0);" class="dropdown-item notify-item">
                                            <div class="notify-icon"><img src="/images/users/avatar-4.jpg" alt="user-img"
                                                    class="img-fluid rounded-circle" /> </div>
                                            <p class="notify-details"><b>Luis M. Konrad</b><small class="text-muted">It is a
                                                    long established fact that a reader will</small></p>
                                        </a>

                                        
                                        <a href="javascript:void(0);" class="dropdown-item notify-item">
                                            View All
                                        </a>

                                    </div>
                                            </li>

                                                <li class="list-inline-item dropdown notification-list">
                                                    <a class="nav-link dropdown-toggle arrow-none waves-effect" data-toggle="dropdown"
                                                        href="#" role="button" aria-haspopup="false" aria-expanded="false">
                                                        <i class="ti-bell noti-icon"></i>
                                                        <span class="badge badge-success noti-icon-badge">23</span>
                                                    </a>
                                                    <div class="dropdown-menu dropdown-menu-right dropdown-arrow dropdown-menu-lg">
                                        
                                                        <div class="dropdown-item noti-title">
                                                            <h5><span class="badge badge-danger float-right">87</span>Notification</h5>
                                                        </div>

                                        
                                                        <a href="javascript:void(0);" class="dropdown-item notify-item">
                                                            <div class="notify-icon bg-primary"><i class="mdi mdi-cart-outline"></i></div>
                                                            <p class="notify-details"><b>Your order is placed</b><small
                                                                    class="text-muted">Dummy text of the printing and typesetting
                                                                    industry.</small></p>
                                                        </a>

                                        
                                                        <a href="javascript:void(0);" class="dropdown-item notify-item">
                                                            <div class="notify-icon bg-success"><i class="mdi mdi-message"></i></div>
                                                            <p class="notify-details"><b>New Message received</b><small
                                                                    class="text-muted">You have 87 unread messages</small></p>
                                                        </a>

                                        
                                                        <a href="javascript:void(0);" class="dropdown-item notify-item">
                                                            <div class="notify-icon bg-warning"><i class="mdi mdi-martini"></i></div>
                                                            <p class="notify-details"><b>Your item is shipped</b><small
                                                                    class="text-muted">It is a long established fact that a reader
                                                                    will</small></p>
                                                        </a>

                                        
                                                        <a href="javascript:void(0);" class="dropdown-item notify-item">
                                                            View All
                                                        </a>

                                                    </div>
                                                </li> -->

            <li class="list-inline-item dropdown notification-list">
                <a class="nav-link dropdown-toggle arrow-none waves-effect nav-user" data-toggle="dropdown" href="#"
                    role="button" aria-haspopup="false" aria-expanded="false">
                    <img src="/images/users/avatar-1.jpg" alt="user" class="rounded-circle">
                </a>
                <!-- <div class="dropdown-menu dropdown-menu-right profile-dropdown ">
                                        
                                                        <div class="dropdown-item noti-title">
                                                            <h5>Welcome</h5>
                                                        </div>
                                                        <a class="dropdown-item" href="#"><i
                                                                class="mdi mdi-account-circle m-r-5 text-muted"></i> Profile</a>
                                                        <a class="dropdown-item" href="#"><i class="mdi mdi-wallet m-r-5 text-muted"></i> My
                                                            Wallet</a>
                                                        <a class="dropdown-item" href="#"><span
                                                                class="badge badge-success float-right">5</span><i
                                                                class="mdi mdi-settings m-r-5 text-muted"></i> Settings</a>
                                                        <a class="dropdown-item" href="#"><i
                                                                class="mdi mdi-lock-open-outline m-r-5 text-muted"></i> Lock screen</a>
                                                        <div class="dropdown-divider"></div>
                                                        <a class="dropdown-item" href="#"><i class="mdi mdi-logout m-r-5 text-muted"></i>
                                                            Logout</a>
                                                    </div> -->
            </li>

        </ul>

        <ul class="list-inline menu-left mb-0">
            <li class="float-left">
                <button class="button-menu-mobile open-left waves-light waves-effect">
                    <i class="mdi mdi-menu"></i>
                </button>
            </li>
        </ul>

        <div class="clearfix"></div>

    </nav>
</template>

