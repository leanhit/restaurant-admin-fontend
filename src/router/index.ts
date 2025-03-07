import { createRouter, createWebHistory } from 'vue-router';
import ZoterDefault from "@/layouts/ZoterDefault.vue";
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
			component: ZoterDefault,
			name: "LayoutZoter",
			redirect: "/home",
            children: [                
                {
                    path: '/home',
                    name: 'home',
                    component: () => import('@/views/dashboard/Index.vue'),
                    // component: () => import('@/views/HomeView.vue'),
                },
                {
                    path: '/menu',
                    name: 'menu',
                    component: () => import('@/views/menu/Index.vue'),
                },
                {
                    path: '/zone-table',
                    name: 'zoneTable',
                    component: () => import('@/views/zoneTable/Index.vue'),                 
                },                
                {
                    path: '/bill',
                    name: 'bill',
                    component: () => import('@/views/bill/Index.vue'),
                },                
                {
                    path: '/activate-order-items',
                    name: 'activate',
                    component: () => import('@/views/order/activate/Index.vue'),
                },             
                {
                    path: '/all-order',
                    name: 'all',
                    component: () => import('@/views/order/all/Index.vue'),
                },                                   
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/dashboard/Index.vue'),
                    // component: () => import('@/views/HomeView.vue'),
                },                                
                {
                    path: '/settings',
                    name: 'settings',
                    component: () => import('@/views/settings/Index.vue'),
                },
                {
                    path: '/user',
                    name: 'user',
                    component: () => import('@/views/user/Index.vue'),
                },
            ]
        }
    ],
});
export default router;
