
import { createRouter, createWebHistory } from 'vue-router';
import UploadView from '@/views/UploadView.vue';
import DataView from '@/views/DataView.vue';
import DemoView from '@/views/DemoView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // Ruta principal: Carga de Archivos
      path: '/',
      name: 'upload',
      component: UploadView
    },
    {
      // Segunda Parte: Listado de Datos Procesados
      path: '/data',
      name: 'data-list',
      component: DataView
    },
    {
      // Primera Parte: Demostración de Bondades de Vue
      path: '/vue-demo',
      name: 'vue-demo',
      component: DemoView
    }
  ]
});

export default router;
