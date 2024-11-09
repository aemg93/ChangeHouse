<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-dark">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="las la-bars"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="text-white"
        />

        <q-toolbar-title>
          Tasa Cambiaria
        </q-toolbar-title>

        <q-btn
          flat
          dense
          icon="las la-sync"
          aria-label="Recargar"
          @click="reloadPage"
          class="text-white"
        />
        <q-btn
          flat
          dense
          icon="las la-share-alt"
          aria-label="Compartir"
          @click="shareContent"
          class="text-white"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-dark"
    >
      <q-list>
        <q-item-label header class="text-white text-center link-menu">
         menu
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-9">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'MainLayout'
})

const linksList = [
  {
    title: 'Tasa de Cambio',
    caption: '',
    icon: 'las la-exchange-alt',
    link: 'Index'
  },
  {
    title: 'Configuracion',
    caption: '',
    icon: 'las la-cog',
    link: 'Configuracion'
  },
  {
    title: 'Informacion',
    caption: '',
    icon: 'las la-info',
    link: 'Informacion'
  },
]

const leftDrawerOpen = ref(false)
const route = useRoute()

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function reloadPage() {
  location.reload()
}

function shareContent() {
  const currentPageName = route.name || 'Página Actual';
  const currentPageUrl = window.location.href;

  if (navigator.share) {
    navigator.share({
      title: `Compartiendo: ${currentPageName}`,
      text: `Echa un vistazo a esta página: ${currentPageName}`,
      url: currentPageUrl
    }).then(() => {
      console.log('Contenido compartido exitosamente');
    }).catch((error) => {
      console.error('Error al compartir:', error);
    });
  } else {
    alert('La función de compartir no está disponible en este navegador.');
  }
}
</script>

<style scoped>
.active-link {
  background-color: #080808 !important;
  color: #40fd05 !important;
}
.link-menu {
  font-size: 2rem;
}
</style>
