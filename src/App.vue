<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav class="main-nav">

        <RouterLink to="/" class="nav-link">
          <span class="nav-icon"></span> Carga ZIP
        </RouterLink>

        <RouterLink to="/vue-demo" class="nav-link">
          <span class="nav-icon"></span> Vue 3 Demo
        </RouterLink>

        <RouterLink to="/data" class="nav-link">
          <span class="nav-icon"></span> Datos Procesados
        </RouterLink>

      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
/* ESTILOS DE LA OPCIÓN 1: MINIMALISTA Y PROFESIONAL */
header {
  line-height: 1.5;
  background-color: #ffffff;
  border-bottom: 1px solid #eee;
  padding: 15px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Sombra sutil */
}

.wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.main-nav {
  display: flex;
  justify-content: center;
  gap: 25px;
}

.nav-link {
  /* Estructura para icono y texto */
  display: flex;
  align-items: center;
  gap: 8px;

  color: #555;
  text-decoration: none;
  font-weight: 600;
  padding: 8px 15px;
  border-radius: 6px;
  transition: background-color 0.3s, color 0.3s;
}

.nav-icon {
  font-size: 1.1em;
  line-height: 1;
}

/* Estilos para el enlace activo (Verde Vue) */
.nav-link.router-link-active {
  background-color: #42b883;
  color: white;
  box-shadow: 0 2px 5px rgba(66, 184, 131, 0.4);
}

.nav-link:hover:not(.router-link-active) {
  background-color: #f0f0f0;
  color: #2c3e50;
}
</style>
