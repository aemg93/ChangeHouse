<template>
  <q-layout view="lHh Lpr lFf" class="bg-dark text-white">
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

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-dark"
    >
      <q-list>
        <q-item-label header class="text-white">
          Essential Links
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
import {ref} from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

defineOptions({
  name: 'MainLayout'
})

const linksList = [
  {
    title: 'Calculadora',
    caption: '',
    icon: 'las la-exchange-rates',
    link: 'Calculadora'
  },
  {
    title: 'Tasa BCV',
    caption: '',
    icon: 'las la-chart-bar',
    link: 'TasaBCV'
  },
  {
    title: 'Historial',
    caption: '',
    icon: 'las la-clipboard',
    link: 'Historial'
  },
  {
    title: 'PerfilesDePago',
    caption: '',
    icon: 'las la-file-invoice-dollar',
    link: 'PerfilDePago'
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

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style>
.bg-dark {
  background-color: #1d1d1d;
}

.text-white {
  color: #ffffff;
}
</style>
