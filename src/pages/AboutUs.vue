<template>
  <q-page class="about-page">
    <div class="team-container">
      <h1 class="title">Acerca de Nosotros</h1>
      <p class="subtitle">Este proyecto fue desarrollado por un equipo talentoso:</p>

      <div class="team-grid">
        <div v-for="member in team" :key="member.name" class="team-card">
          <div class="team-image-container">
            <img :src="member.image" :alt="member.name" class="team-image" />
          </div>
          <div class="team-text-container">
            <h3 class="team-name">{{ member.name }}</h3>
            <p class="team-role">{{ member.role }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="contact-container">
      <p class="note">
        Para desarrollos e integraciones, contáctanos:
      </p>
      <div class="contact-info">
        <p><strong>Correo:</strong> <a href="mailto:{{ contact.email }}" class="contact-link">{{ contact.email }}</a></p>
        <p><strong>Móvil:</strong> <a href="tel:{{ contact.mobile }}" class="contact-link">{{ contact.mobile }}</a></p>
        <p><strong>Web:</strong> <a :href="contact.website" class="contact-link" target="_blank">{{ contact.website }}</a></p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";

// Datos del equipo
const team = ref([
  {
    name: "José R. Gutierrez",
    role: "FullStack Senior",
    image: "https://via.placeholder.com/150"
  },
  {
    name: "Julio C. Uranga",
    role: "Backend Junior",
    image: "https://via.placeholder.com/150"
  },
  {
    name: "Ángel E. Moreno",
    role: "FullStack Junior",
    image: "https://via.placeholder.com/150"
  }
]);

// Datos de contacto
const contact = ref({
  email: "josefo727@gmail.com",
  mobile: "+57 302 617 81 55",
  website: "https://jose-gutierrez.com"
});
</script>

<style scoped>
/* Estilos generales */
.about-page {
  text-align: center;
  padding: 30px;
  font-family: Arial, sans-serif;
  color: #333;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #555;
}

/* Contenedor del equipo */
.team-container {
  margin: 0 auto;
  max-width: 800px;
}

.team-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Diseño flexbox para la tarjeta */
.team-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.team-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

/* Imagen alineada a la izquierda */
.team-image-container {
  flex: 0 0 40%; /* Ocupa el 40% del ancho */
  display: flex;
  justify-content: center;
  align-items: center;
}

.team-image {
  width: 120px;
  height: 120px;
  border-radius: 50%; /* Imagen circular */
  object-fit: cover;
}

/* Texto alineado a la derecha */
.team-text-container {
  flex: 1; /* El texto ocupa el restante 60% */
  text-align: left;
  padding-left: 20px;
}

.team-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.team-role {
  font-size: 1rem;
  color: #777;
}

/* Contenedor de contacto */
.contact-container {
  margin-top: 40px;
}

.note {
  font-size: 1rem;
  color: #555;
  margin-bottom: 15px;
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
