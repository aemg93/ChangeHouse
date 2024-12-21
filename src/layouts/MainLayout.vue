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
        <template v-if="$route.name === 'index'">
          <CaptureShareComponent />
        </template>
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

    <q-page-container class="page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue';
import CaptureShareComponent from '@/components/CaptureShareComponent.vue';

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
  },
  {
    title: 'Nuestros Servicios',
    caption: '',
    icon: 'las la-laptop-code',
    link: 'services'
  },
  {
    title: 'Acerca de',
    caption: '',
    icon: 'las la-info-circle',
    link: 'about-us'
  },
  {
    title: 'Descargo de Responsabilidad',
    caption: '',
    icon: 'las la-exclamation-triangle',
    link: 'disclaimer'
  },
];

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

</script>

<style scoped>
.page-container {
  background: #F8F9FA;
}
.active-link {
  background-color: #080808 !important;
  color: #ffffff !important;
}
.link-menu {
  font-size: 2rem;
}
</style>
