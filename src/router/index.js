import { createRouter, createWebHistory } from 'vue-router'
import PropertiesList from '@/components/PropertiesList.vue'
import AllTenants from '@/components/AllTenants.vue'
import TenantsList from '@/components/TenantsList.vue'
import Landing from '@/components/Landing.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Landing,
 
    },
    {
      path: '/properties',
      name: 'properties',
      component: PropertiesList,
      children: [
        {
          // UserProfile will be rendered inside User's <router-view>
          // when /user/:id/profile is matched
          path: 'myTenants',
          component: TenantsList,
        }]
    },
    {
      path: '/tenants',
      name: 'tenants',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: AllTenants
    }
  ]
})

export default router
