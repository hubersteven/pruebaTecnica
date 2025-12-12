<template>
  <div class="upload-container">
    <h2>Subir Archivo ZIP de Datos</h2>
    
    <input type="file" @change="handleFileChange" accept=".zip" class="file-input" />
    
    <button @click="uploadFile" :disabled="!selectedFile || isUploading" class="upload-button">
      {{ isUploading ? 'Subiendo...' : 'Procesar y Subir' }}
    </button>

    <div v-if="uploadProgress > 0 && uploadProgress < 100" class="progress-bar">
      Progreso: {{ uploadProgress.toFixed(0) }}%
    </div>

    <p v-if="uploadMessage" :class="{ success: isSuccess, error: isError }">{{ uploadMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { storage } from '@/firebase/config'; // Importa Storage
import { ref as storageRef, uploadBytesResumable } from 'firebase/storage';

const selectedFile = ref(null);
const isUploading = ref(false);
const uploadProgress = ref(0);
const uploadMessage = ref('');
const isSuccess = ref(false);
const isError = ref(false);

const handleFileChange = (event) => {
    const file = event.target.files[0];
    const isZipFile = 
        file && 
        (file.name.toLowerCase().endsWith('.zip') || 
         file.type === 'application/zip' || 
         file.type === 'application/x-zip-compressed');

    if (isZipFile) {
        selectedFile.value = file;
        uploadMessage.value = `Archivo seleccionado: ${file.name}`;
        isSuccess.value = false;
        isError.value = false;
        uploadProgress.value = 0;
    } else {
        selectedFile.value = null;
        uploadMessage.value = 'Por favor, selecciona un archivo ZIP válido.';
        isError.value = true;
    }
};

const uploadFile = () => {
  if (!selectedFile.value) return;

  isUploading.value = true;
  uploadMessage.value = 'Iniciando subida...';
  isSuccess.value = false;
  isError.value = false;

  // Crear una referencia en Firebase Storage
  // Usamos un timestamp para asegurar un nombre único
  const timestamp = Date.now();
  const filePath = `zips_to_process/${timestamp}_${selectedFile.value.name}`;
  const fileRef = storageRef(storage, filePath);

  //Iniciar la tarea de subida
  const uploadTask = uploadBytesResumable(fileRef, selectedFile.value);

  // Monitorear el progreso y estado
  uploadTask.on(
    'state_changed',
    (snapshot) => {
      // Calcular y actualizar el progreso
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      uploadProgress.value = progress;
      uploadMessage.value = `Subiendo... ${progress.toFixed(0)}%`;
    },
    (error) => {
      // Manejo de errores de subida
      console.error("Error de subida:", error);
      uploadMessage.value = `Error al subir el archivo: ${error.message}`;
      isError.value = true;
      isUploading.value = false;
    },
    () => {
      // Subida completada con éxito
      uploadProgress.value = 100;
      uploadMessage.value = '¡Subida completada! El procesamiento en el backend comenzará pronto.';
      isSuccess.value = true;
      isUploading.value = false;
      // Aquí el archivo se sube a Storage, lo que disparará la Cloud Function 
    }
  );
};
</script>

<style scoped>
.upload-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  text-align: center;
}
h2 {
  color: #42b883;
  margin-bottom: 25px;
}
.file-input {
  display: block;
  width: 100%;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.upload-button {
  background-color: #42b883;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: bold;
}
.upload-button:disabled {
  background-color: #a4d4bc;
  cursor: not-allowed;
}
.progress-bar {
  margin-top: 15px;
  padding: 10px;
  background-color: #e9ecef;
  border-radius: 5px;
}
.success {
  color: #28a745;
  font-weight: bold;
}
.error {
  color: #dc3545;
  font-weight: bold;
}
</style>