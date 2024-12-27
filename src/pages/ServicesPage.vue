<template>
  <q-page class="services-page">
    <div class="services-container">
      <h1 class="title">Soluciones Personalizadas</h1>
      <p class="subtitle">Potenciamos tu negocio con servicios de desarrollo e integración a medida.</p>

      <ul class="services-list">
        <li class="service-item">Desarrollo Web, Móvil y E-commerce</li>
        <li class="service-item">Integración de APIs en ERP</li>
        <li class="service-item">CRM Personalizados y desarrollados a medida</li>
        <li class="service-item">Soluciones completas para SAP, VTEX y más</li>
        <li class="service-item">Automatización y optimización de procesos empresariales</li>
        <li class="service-item">Métodos de pago personalizados y recursos técnicos</li>
        <li class="service-item">Capacitación y documentación técnica para desarrolladores</li>
      </ul>

      <div class="contact-container">
        <p class="note">Convierte tu idea en una solución a medida. Contáctanos:</p>
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
  mobile: "+57 302 617 81 55",
  website: "https://jose-gutierrez.com/"
});
</script>

<style scoped>
.services-page {
  text-align: center;
  margin-top: -20px;
  padding: 0 30px;
  font-family: Arial, sans-serif;
  color: #333;
}

.title {
  font-size: 2rem;
  margin: 40px 0 20px 0;
  line-height: 3rem;
}

.subtitle {
  font-size: 1rem;
  margin-bottom: 20px;
  color: #555;
}

.services-container {
  margin: 0 auto;
}

.services-list {
  text-align: left;
  margin: 20px auto;
  padding: 0;
  list-style-type: none;
}

.service-item {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px 20px;
  margin: 10px 0;
  color: #333;
  transition: background 0.3s ease;
}

.service-item:hover {
  background: #f0f8ff;
}

.contact-container {
  margin-top: 20px;
}

.note {
  font-size: 0.8rem;
  color: #555;
  margin-bottom: 10px;
  font-weight: 700;
}

.contact-info {
  font-size: 1rem;
  color: #333;
  p {
    margin-bottom: 0;
  }
}

.contact-link {
  color: #007bff;
  text-decoration: none;
}

.contact-link:hover {
  text-decoration: underline;
}
</style>
