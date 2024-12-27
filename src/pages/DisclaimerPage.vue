<template>
  <q-page class="flex flex-center services-page">
    <div style="max-width: 600px; width: 100%; padding: 20px;">
      <h5 class="text-center title">Descargo de Responsabilidad</h5>

      <p class="q-mt-md q-mb-none">
        Esta aplicación fue diseñada como una herramienta informativa para acceder a tasas de cambio actualizadas.
      </p>

      <p class="q-mb-sm q-mt-sm">
        A continuación, señalamos consideraciones importantes sobre su uso:
      </p>

      <q-card class="q-mt-md q-pb-md bg-white shadow-2 informative-block">
        <q-card-section>
          <h6 class="text-secondary">1. Propósito Exclusivamente Informativo</h6>
          <p>
            La finalidad de esta aplicación es proporcionar información actualizada sobre tasas de cambio. No está destinada para fines financieros, comerciales, especulativos ni como sustituto de asesoramiento profesional en materia económica o financiera.
          </p>
        </q-card-section>

        <q-card-section>
          <h6 class="text-secondary">2. Fuentes y Precisión de los Datos</h6>
          <p>
            Los datos de esta aplicación se obtienen de fuentes confiables, pero no garantizamos su absoluta precisión, integridad ni disponibilidad, ya que pueden variar sin previo aviso. El usuario debe evaluar la información según sus necesidades.
          </p>
        </q-card-section>

        <q-card-section>
          <h6 class="text-secondary">3. Uso Responsable</h6>
          <p>
            El uso de esta aplicación queda bajo la completa responsabilidad del usuario. No promovemos ni avalamos el uso de tasas alternativas distintas a las oficialmente reconocidas. Asimismo, es responsabilidad del usuario garantizar el cumplimiento de las normativas legales en su jurisdicción.
          </p>
        </q-card-section>
      </q-card>

      <q-btn
        label="Entendido"
        color="primary"
        unelevated
        class="q-mt-lg full-width"
        @click="navigateBack"
      />
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateBack = () => {
  router.push('/');
};
</script>

<style scoped>
.services-page {
  margin-top: -20px;
  padding: 0 20px;
  font-family: Arial, sans-serif;
  color: #333;
}

.title {
  font-size: 2rem;
  margin: 40px 0 20px 0;
  line-height: 3rem;
  color: #007bff;
}

h6 {
  margin-bottom: 0;
  margin-top: 0;
  font-weight: bold;
}

.informative-block p {
  margin-bottom: -20px;
}

.full-width {
  width: 100%;
}
</style>
