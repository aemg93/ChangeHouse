const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'MyCalculator', name:'Calculadora',  component: () => import('pages/calculator/MyCalculator.vue') },
      { path: 'MyRate.vue', name:'TasaBCV', component: () => import('pages/MyRate.vue') },
      { path: 'MyRecord', name:'Historial', component: () => import('pages/MyRecord.vue') },
      { path: 'PaymentProfiles', name:'PerfilDePago', component: () => import('pages/PaymentProfiles.vue') },
      { path: 'MyConfiguration', name:'Configuracion', component: () => import('pages/MyConfiguration.vue') },
      { path: 'MyInformation', name:'Informacion', component: () => import('pages/MyInformation.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
