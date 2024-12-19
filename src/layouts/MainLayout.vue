<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-dark">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="las la-bars"
          aria-label="Manú principal"
          @click="toggleLeftDrawer"
          class="text-white"
        />

        <q-toolbar-title>
          {{ appName }}
        </q-toolbar-title>
        <q-btn
          flat
          dense
          icon="las la-share-alt"
          aria-label="Compartir la tasa de cambio"
          @click="shareContent"
          class="text-white"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class=""
    >
      <q-list>
        <q-item-label header class="text-black text-center link-menu">
         Menú principal
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container class="">
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

const appName = process.env.APP_NAME;

const linksList = [
  {
    title: 'Tasa de Cambio',
    caption: '',
    icon: 'las la-exchange-alt',
    link: 'index'
  },
  {
    title: 'Ajustes',
    caption: '',
    icon: 'las la-cog',
    link: 'settings'
  }
]

const leftDrawerOpen = ref(false)
const route = useRoute()

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
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
  color: #ffffff !important;
}
.link-menu {
  font-size: 2rem;
}
</style>
