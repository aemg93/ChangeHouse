const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: { name: 'Index' }, // Redirige a la ruta Index
    children: [
      { path: 'Index', name: 'Index', component: () => import('pages/IndexPage.vue') },
      { path: 'My-Rate', name: 'TasaBCV', component: () => import('pages/MyRate.vue') },
      { path: 'My-Record', name: 'Historial', component: () => import('pages/MyRecord.vue') },
      { path: 'Payment-Profiles', name: 'PerfilDePago', component: () => import('pages/PaymentProfiles.vue') },
      { path: 'My-Configuration', name: 'Configuracion', component: () => import('pages/MyConfiguration.vue') },
      { path: 'My-Information', name: 'Informacion', component: () => import('pages/MyInformation.vue') },
    ]
  },

  // Siempre dejar esto como el último
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
