<template>
  <q-page class="about-page">
    <div class="about-container">
      <h1 class="title">Acerca de Dev Nova</h1>
      <p class="subtitle">Tecnología que evoluciona contigo</p>

      <div class="about-description">
        <p>
          En <strong>Dev Nova</strong>, transformamos ideas en soluciones tecnológicas innovadoras.
          Nos especializamos en crear software y aplicaciones móviles a medida que permiten a las empresas
          crecer y adaptarse a los desafíos del mercado. Cada solución que desarrollamos está diseñada
          para evolucionar junto a tus necesidades.
        </p>
      </div>

      <div class="value-section">
        <h2 class="section-title">Nuetros Valores</h2>
        <ul class="value-list">
          <li class="value-item">
            <strong>Innovación:</strong> Siempre buscamos soluciones vanguardistas y creativas.
          </li>
          <li class="value-item">
            <strong>Calidad:</strong> Nos aseguramos de que cada proyecto cumpla con los más altos estándares.
          </li>
          <li class="value-item">
            <strong>Escalabilidad:</strong> Diseñamos sistemas pensados para crecer contigo.
          </li>
          <li class="value-item">
            <strong>Compromiso:</strong> Tu éxito es nuestra prioridad.
          </li>
        </ul>
      </div>

      <div class="mission-vision">
        <div class="mission">
          <h2 class="section-title">Nuestra Misión</h2>
          <p>
            Convertir la tecnología en un aliado fundamental para empresas y emprendedores,
            desarrollando soluciones digitales sostenibles y personalizadas que potencien su crecimiento.
          </p>
        </div>
        <div class="vision">
          <h2 class="section-title">Nuestra Visión</h2>
          <p>
            Ser reconocidos como un referente en el desarrollo de software y apps móviles,
            creando valor a través de soluciones escalables y de impacto global.
          </p>
        </div>
      </div>

      <div class="contact-container">
        <h2 class="section-title">Contáctanos</h2>
        <p>
          Si buscas una solución tecnológica a tu medida, no dudes en escribirnos:
        </p>
        <div class="contact-info">
          <p><strong>Correo:</strong> <a href="mailto:{{ contact.email }}" class="contact-link">{{ contact.email }}</a></p>
          <p><strong>Web:</strong> <a :href="contact.website" class="contact-link" target="_blank">{{ contact.website }}</a></p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";

const contact = ref({
  email: "josefo727@gmail.com",
  website: "https://jose-gutierrez.com/"
});
</script>

<style scoped>
.about-page {
  text-align: center;
  margin: 0 auto;
  padding: 0 30px;
  font-family: Arial, sans-serif;
  color: #333;
}

.title {
  font-size: 2rem;
  margin: 40px 0 20px 0;
  line-height: 3rem;
  color: #007bff;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 30px;
  font-weight: bold;
  color: #555;
}

.about-description {
  margin: 20px auto;
  max-width: 800px;
  font-size: 1rem;
  line-height: 1.8;
  color: #444;
}

.value-section {
  margin: 30px auto;
  max-width: 800px;
}

.section-title {
  font-size: 1.5rem;
  margin-top: -15px;
  margin-bottom: -5px;
  color: #007bff;
}

.value-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.value-item {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px 15px;
  margin: 10px 0;
  font-size: 1rem;
  color: #333;
}

.mission-vision {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 30px;
}

.mission, .vision {
  flex: 1 1 45%;
  margin: 10px;
  padding: 15px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.contact-container {
  margin-top: 30px;
  padding-top: 20px;
}

.contact-info {
  font-size: 1rem;
  color: #333;
}

.contact-info p {
  margin: 5px 0;
}

.contact-link {
  color: #007bff;
  text-decoration: none;
}

.contact-link:hover {
  text-decoration: underline;
}
</style>
