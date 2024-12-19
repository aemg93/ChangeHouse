<template>
  <q-page class="flex flex-center bg-grey-3">
    <div style="max-width: 600px; width: 100%; padding: 20px;">
      <h6 class="text-center text-primary">Descargo de Responsabilidad</h6>

      <p class="q-mt-md q-mb-sm">La finalidad de esta aplicación es ofrecer una herramienta informativa y conveniente para facilitar el acceso a tasas de cambio entre monedas en cualquier momento en que sea necesario. Sin embargo, es importante tener en cuenta lo siguiente:</p>

      <q-card class="q-mt-md q-pb-md bg-white shadow-2 informative-block">
        <q-card-section>
          <h6 class="text-secondary">1. Propósito Informativo</h6>
          <p>Esta aplicación ha sido diseñada exclusivamente con el objetivo de proporcionar información actualizada y precisa sobre los valores oficiales y alternativos de las tasas de cambio entre monedas.</p>
        </q-card-section>

        <q-card-section>
          <h6 class="text-secondary">2. No Fomento de Tasas Paralelas</h6>
          <p>En ningún caso esta aplicación promueve, respalda ni incentiva el uso de tasas de cambio distintas a aquellas oficialmente reconocidas por las autoridades correspondientes. Cualquier información adicional incluida, como tasas alternativas o paralelas, tiene únicamente fines referenciales para conocimientos generales.</p>
        </q-card-section>

        <q-card-section>
          <h6 class="text-secondary">3. Uso Bajo Responsabilidad del Usuario</h6>
          <p>El uso de los datos proporcionados por esta aplicación queda a la entera discreción y responsabilidad del usuario. Esta aplicación no tiene control ni responsabilidad sobre las decisiones que puedan tomarse basadas en la información presentada.</p>
        </q-card-section>

        <q-card-section>
          <h6 class="text-secondary">4. Precisiones sobre la Información</h6>
          <p>La información mostrada en esta aplicación es obtenida de fuentes consideradas confiables. Sin embargo, no garantizamos la absoluta precisión, integridad ni disponibilidad de los datos presentados, ya que pueden estar sujetos a cambios o variaciones sin previo aviso.</p>
        </q-card-section>

        <q-card-section>
          <h6 class="text-secondary">5. Cumplimiento Normativo</h6>
          <p>Esta aplicación no pretende en ningún caso infringir regulaciones locales, nacionales o internacionales relacionadas con el uso, intercambio o conocimiento de tasas de cambio. Los usuarios de esta aplicación son responsables de asegurarse de cumplir con las normativas legales aplicables en su jurisdicción.</p>
        </q-card-section>

        <q-card-section>
          <h6 class="text-secondary">6. Finalidad Limitada</h6>
          <p>La aplicación debe entenderse únicamente como una herramienta de consulta. No está diseñada ni destinada para ningún uso financiero, comercial, especulativo ni como sustituto de asesoramiento profesional en materia económica o financiera.</p>
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
h6 {
  margin-bottom: 0;
  margin-top: 0;
  font-weight: bold;
}

.informative-block p {
  text-align: justify;
  margin-bottom: -20px;
}

.full-width {
  width: 100%;
}
</style>
