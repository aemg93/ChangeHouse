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
    <q-footer class="footer-bar" v-show="isFooterVisible">
      <div
        class="scrolling-message"
        ref="scrollingMessage"
        @animationiteration="incrementMessageCount"
      >
        Disfruta de nuestra app totalmente gratis y sin publicidad.
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue';
import CaptureShareComponent from '@/components/CaptureShareComponent.vue';
const isFooterVisible = ref(true);
const messageRepetitionCount = ref(0);

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

function incrementMessageCount() {
  messageRepetitionCount.value++;
  if (messageRepetitionCount.value >= 3) {
    isFooterVisible.value = false;
  }
}
</script>

<style scoped>
.page-container {
  background: #F8F9FA;
  min-height: 100vh !important;
}
.active-link {
  background-color: #080808 !important;
  color: #ffffff !important;
}
.link-menu {
  font-size: 2rem;
}
.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #3985fa;
  color: white;
  text-align: center;
  font-size: 16px;
  overflow: hidden;
  z-index: 2;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scrolling-message {
  display: inline-block;
  white-space: nowrap;
  animation: scroll-left 8s linear infinite;
}

@keyframes scroll-left {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
