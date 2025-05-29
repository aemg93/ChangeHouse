const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: { name: 'index' }, // Redirige a la ruta Index
    children: [
      { path: 'index', name: 'index', component: () => import('pages/IndexPage.vue') },
      { path: 'settings', name: 'settings', component: () => import('pages/SettingsPage.vue') },
      { path: 'about-us', name: 'about-us', component: () => import('pages/AboutUs.vue') },
      { path: 'services', name: 'services', component: () => import('pages/ServicesPage.vue') },
      { path: 'credits', name: 'credits', component: () => import('@/pages/CreditsPage.vue') },
      { path: 'disclaimer', name: 'disclaimer', component: () => import('@/pages/DisclaimerPage.vue') },
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
