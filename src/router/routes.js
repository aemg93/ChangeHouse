const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: { name: 'index' }, // Redirige a la ruta Index
    children: [
      { path: 'index', name: 'index', component: () => import('pages/IndexPage.vue') },
      { path: 'settings', name: 'settings', component: () => import('pages/Settings.vue') },
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
