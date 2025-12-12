<template>
  <div class="data-container">
    <h2>Archivos procesados y listados (Real-Time)</h2>

    <div v-if="isLoading" class="loading-message">
      Cargando datos de Firestore en tiempo real...
    </div>

    <div v-else-if="data.length === 0" class="empty-message">
      No hay archivos registrados en la colección 'datos_procesados'. Sube un ZIP para comenzar.
    </div>

    <div v-else class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID Documento (Firestore)</th>
            <th>Archivo</th>
            <th>ZIP Origen</th>
            <th>Procesado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in data" :key="item.id">
            <td>{{ item.id }}</td>

            <!-- Nombre del archivo descomprimido -->
            <td>{{ item.nombre_original }}</td>

            <!-- Nombre del ZIP original -->
            <td>{{item.origen_zip? item.origen_zip.split('/').pop().split('_').slice(1).join('_'): '—'}}</td>

            <!-- Fecha -->
            <td>{{ formatDate(item.timestamp) }}</td>

            <td>
              <button @click="downloadFile(item)" class="download-button">
                Descargar archivo
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
// Firebase
import { httpsCallable } from "firebase/functions";
import { functions, db } from "@/firebase/config";

// Vue
import { ref, onMounted } from "vue";

// Firestore
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

const data = ref([]);
const isLoading = ref(true);

const COLLECTION_NAME = "datos_procesados";

/**
 * Formatear fecha
 */
const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return (
    date.toLocaleDateString("es-CO") +
    " " +
    date.toLocaleTimeString("es-CO")
  );
};

/**
 * Escuchar cambios en Firestore en tiempo real.
 */
const startRealTimeListener = () => {
  const colRef = collection(db, COLLECTION_NAME);
  const q = query(colRef, orderBy("timestamp", "desc"));

  onSnapshot(
    q,
    (snapshot) => {
      isLoading.value = false;

      data.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Datos en tiempo real:", data.value);
    },
    (error) => {
      console.error("Error en snapshot:", error);
      isLoading.value = false;
      alert("Error al conectar con Firestore.");
    }
  );
};

/**
 * Descargar archivo descomprimido desde Storage
 */
const downloadFile = async (item) => {
  const key = prompt("Ingrese la clave de seguridad para descargar:");

  if (!key) {
    alert("Descarga cancelada.");
    return;
  }

  try {
    const getUrl = httpsCallable(functions, "getSignedDownloadUrl");

    const result = await getUrl({
      storagePath: item.storage_path,
      key,
    });

    const url = result.data.url;

    const cleanName = item.nombre_original;

    const response = await fetch(url);
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = cleanName;
    link.click();

    URL.revokeObjectURL(link.href);
  } catch (err) {
    console.error("Error descargando:", err);
    alert("Clave incorrecta o error generando la URL.");
  }
};

// Iniciar listener
onMounted(() => {
  startRealTimeListener();
});
</script>

<style scoped>
/* Contenedor Principal */
.data-container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  text-align: center;
}

h2 {
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 1.8em;
  border-bottom: 2px solid #42b883;
  display: inline-block;
  padding-bottom: 5px;
}

/* Mensajes */
.loading-message,
.empty-message {
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  color: #1890ff;
}
.empty-message {
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  color: #faad14;
}

/* Tabla */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}
.data-table {
  width: 100%;
  min-width: 700px;
  border-collapse: separate;
  margin-top: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
  border-radius: 8px;
}
.data-table th,
.data-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e8e8e8;
  white-space: nowrap;
}
.data-table th {
  background-color: #42b883;
  color: white;
  text-transform: uppercase;
  font-size: 0.9em;
}
.data-table tr:nth-child(even) {
  background-color: #fafafa;
}
.data-table tr:hover {
  background-color: #f0f0f0;
}

/* Botón descarga */
.download-button {
  background-color: #007bff;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 500;
}
.download-button:hover {
  background-color: #0056b3;
}
</style>
