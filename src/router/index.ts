import { createRouter, createWebHistory } from 'vue-router';
import ZoterDefault from "@/layouts/ZoterDefault.vue";
import Login from "@/views/auth/Index.vue"; // Trang đăng nhập

const routes = [
    {
        path: "/login",
        name: "login",
        component: Login,
    },
    {
        path: "/",
        component: ZoterDefault,
        name: "LayoutZoter",
        redirect: "/home",
        meta: { requiresAuth: true }, // Cần đăng nhập
        children: [
            { path: "/home", name: "home", component: () => import("@/views/dashboard/Index.vue") },
            { path: "/menu", name: "menu", component: () => import("@/views/menu/Index.vue") },
            { path: "/zone-table", name: "zoneTable", component: () => import("@/views/zoneTable/Index.vue") },
            { path: "/bill", name: "bill", component: () => import("@/views/bill/Index.vue") },
            { path: "/activate-order-items", name: "activate", component: () => import("@/views/order/activate/Index.vue") },
            { path: "/all-order", name: "all", component: () => import("@/views/order/all/Index.vue") },
            { path: "/dashboard", name: "dashboard", component: () => import("@/views/dashboard/Index.vue") },
            { path: "/settings", name: "settings", component: () => import("@/views/settings/Index.vue") }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

// 🚀 **Navigation Guard - Kiểm tra đăng nhập trước khi vào trang**
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem("accessToken"); // Kiểm tra token

    if (to.meta.requiresAuth && !isAuthenticated) {
        next("/login"); // Nếu chưa đăng nhập, quay về login
    } else if (to.path === "/login" && isAuthenticated) {
        next("/dashboard"); // Nếu đã đăng nhập mà vào login, chuyển hướng sang dashboard
    } else {
        next(); // Tiếp tục vào trang
    }
});

export default router;
