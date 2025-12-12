<template>
  <div class="demo-page-container">

    <header class="demo-header">
      <h2> 1. Demostración de Bondades de Vue 3</h2>
      <p class="header-subtitle">
        Ejemplos interactivos para ilustrar la reactividad, propiedades computadas, enlace doble y la reutilización con props.
      </p>
    </header>

    <div class="feature-grid">

      <div class="feature-card">
        <h3>1. Reactividad con "ref"</h3>
        <p>El contador se actualiza en tiempo real al hacer clic.</p>
        <div class="card-content">
          <p>Contador: <span class="data-display">{{ count }}</span></p>
          <button @click="count++" class="demo-button success-button">
            Aumentar Contador
          </button>
        </div>
      </div>

      <div class="feature-card">
        <h3>2. Propiedad Computada</h3>
        <p>Calcula el área automáticamente al cambiar el lado A o B.</p>
        <div class="card-content">
          <label>Lado A:</label>
          <input type="number" v-model.number="ladoA" min="1">

          <label>Lado B:</label>
          <input type="number" v-model.number="ladoB" min="1">

          <p class="computed-result">Área Calculada: <span class="data-display">{{ areaCalculada }}</span></p>
        </div>
      </div>

      <div class="feature-card">
        <h3>3. Enlace Doble ("v-model")</h3>
        <p>El input y el texto se sincronizan automáticamente.</p>
        <div class="card-content">
          <label>Escribe Aquí:</label>
          <input type="text" v-model="mensajeVModel" placeholder="Escriba algo...">
          <p class="vmodel-result">Valor Sincronizado: <span class="data-display">{{ mensajeVModel }}</span></p>
        </div>
      </div>

      <div class="feature-card">
        <h3>4. Reutilización con "Props"</h3>
        <p>Muestra el mismo componente "FeatureCard" con datos distintos.</p>
        <div class="card-content">
            <FeatureCard
              title="Tarjeta #1"
              :value="5000"
              color="#42b883"
            />
            <FeatureCard
              title="Tarjeta #2"
              :value="125"
              color="#007bff"
            />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import FeatureCard from '@/components/FeatureCard.vue';

// Reactividad (ref)
const count = ref(0);

//Propiedades Computadas (computed)
const ladoA = ref(10);
const ladoB = ref(5);
const areaCalculada = computed(() => {
  return ladoA.value * ladoB.value;
});

// Enlace Doble (v-model)
const mensajeVModel = ref("Texto inicial");
</script>

<style scoped>

.demo-page-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

/* Encabezado */
.demo-header {
  text-align: center;
  margin-bottom: 50px;
}
.demo-header h2 {
  color: #2c3e50;
  font-size: 2.5em;
  margin-bottom: 10px;
}
.header-subtitle {
  color: #555;
  font-size: 1.1em;
}

/* GRILLA DE TARJETAS */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

/* Tarjeta Individual */
.feature-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); /* Sombra de elevación */
  transition: transform 0.3s;
  border-top: 5px solid #42b883; /* Línea de acento Verde Vue */
}

.feature-card:hover {
  transform: translateY(-5px); /* Efecto sutil al pasar el ratón */
}

.feature-card h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.4em;
  font-weight: 700;
  border-bottom: 1px dashed #eee;
  padding-bottom: 5px;
}

.card-content {
  margin-top: 15px;
}

/* Elementos de Formulario y Datos */
label {
  display: block;
  margin-top: 10px;
  font-weight: 500;
  color: #555;
}

input[type="number"], input[type="text"] {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.data-display {
  font-weight: 700;
  color: #007bff; /* Azul para resaltar los datos reactivos */
  font-size: 1.1em;
}

/* Botones */
.demo-button {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.success-button {
  background-color: #42b883;
  color: white;
}
.success-button:hover {
  background-color: #369c73;
}

.computed-result, .vmodel-result {
    margin-top: 15px;
    padding-top: 10px;
    border-top: 1px solid #eee;
}
</style>
