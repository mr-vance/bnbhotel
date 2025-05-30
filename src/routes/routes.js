import Vue from 'vue';
import VueRouter from 'vue-router';
import DashboardLayout from '@/views/Layout/DashboardLayout.vue';
import AuthLayout from '@/views/Pages/AuthLayout.vue';
import NotFound from '@/views/NotFoundPage.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: 'dashboard',
    component: DashboardLayout,
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import(/* webpackChunkName: "app" */ '../views/Dashboard.vue')
      },
      {
        path: '/clients',
        name: 'Clients',
        component: () => import(/* webpackChunkName: "app" */ '../views/Clients.vue')
      },
      {
        path: '/quotes',
        name: 'Quotes',
        component: () => import(/* webpackChunkName: "app" */ '../views/RegularTables.vue')
      },
      {
        path: '/invoices',
        name: 'Invoices',
        component: () => import(/* webpackChunkName: "app" */ '../views/RegularTables.vue')
      }
    ]
  },
  {
    path: '/',
    redirect: 'login',
    component: AuthLayout,
    children: [
      {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "auth" */ '../views/Pages/Login.vue')
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import(/* webpackChunkName: "auth" */ '../views/Pages/Register.vue')
      },
      { path: '*', component: NotFound }
    ]
  }
];

export default routes;