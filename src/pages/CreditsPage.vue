<template>
  <q-page class="credits-page">
    <div class="team-container">
      <h1 class="title">Nuestro Equipo</h1>
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
  </q-page>
</template>

<script setup>
import { ref } from "vue";

const team = ref([
  {
    name: "José R. Gutierrez",
    role: "Senior FullStack Developer",
    image: new URL("./../assets/JoseG.png", import.meta.url)
  },
  {
    name: "Miguel E. González",
    role: "Mid FrontEnd Developer",
    image: new URL("./../assets/MiguelG.png", import.meta.url)
  },
  {
    name: "Cesar J. Uranga",
    role: "Junior BackEnd Developer",
    image: new URL("./../assets/JulioU.png", import.meta.url)
  },
  {
    name: "Ángel E. Moreno",
    role: "Junior FrontEnd Developer",
    image: new URL("./../assets/AngelM.png", import.meta.url)
  }
]);
</script>

<style scoped>
.credits-page {
  text-align: center;
  margin: 0 0 40px 0;
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
  font-size: 1rem;
  margin-top: -10px;
  margin-bottom: 20px;
  font-weight: bold;
  color: #555;
}

.team-container {
  margin: 0 auto;
  max-width: 800px;
}

.team-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

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

.team-image-container {
  flex: 0 0 35%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.team-image {
  width: 100px;
  height: 100px;
  /* border-radius: 50%; */
  object-fit: contain;
}

.team-text-container {
  flex: 1;
  text-align: left;
  padding-left: 15px;
}

.team-name {
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 0;
}

.team-role {
  font-size: 0.9rem;
  color: #777;
}
</style>
