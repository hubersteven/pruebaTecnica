# Prueba Técnica 2025 — Vue + Firebase + Emuladores

![Banner](https://img.shields.io/badge/Vue-3.0-42b883?style=for-the-badge&logo=vuedotjs)
![Firebase](https://img.shields.io/badge/Firebase-Emulators-ffca28?style=for-the-badge&logo=firebase)
![Status](https://img.shields.io/badge/Estado-Completado-brightgreen?style=for-the-badge)

Este repositorio contiene una aplicación desarrollada como parte de la **Prueba Técnica**, utilizando:

- **Vue 3 + Vite**
- **Firebase Hosting**
- **Cloud Functions**
- **Firestore**
- **Firebase Storage**
- **Firebase Emulator Suite (100% funcional)**

El sistema permite **subir, procesar, descomprimir y descargar archivos ZIP**, totalmente operativo dentro de los emuladores de Firebase.

---

# Descripción General

El proyecto se divide en dos partes:


##  Primera Parte — Vue + Hosting

- Sitio desarrollado con **Vue 3**.
- Uso de **componentes**, **props**, **reactividad**, **eventos**, etc.
- Demostración visual de **4 características de Vue** mediante tarjetas.
- Proyecto compilado con **Vite**.
- Deploy en **Firebase Hosting** usando la carpeta `public/` como raíz.

##  Segunda Parte — Procesamiento automático de ZIP

Implementación completa de un flujo automatizado:

1. El usuario sube un archivo ZIP.
2. El ZIP se guarda en Storage en `zips_to_process/`.
3. Una **Cloud Function (onFinalize)**:
   - Descarga el ZIP.
   - Lo descomprime con `adm-zip`.
   - Sube cada archivo extraído a `unzipped_files/`.
   - Registra metadatos en Firestore (`datos_procesados`).
4. El frontend escucha en tiempo real con `onSnapshot()`.
5. Los archivos pueden descargarse con **su nombre original**, mediante:
   - Una Cloud Function segura (`getSignedDownloadUrl`)
   - Validación de clave
   - Generación de URL temporal

---

# Nota Importante Sobre Producción

El sitio está desplegado en:

**https://pruebatecnica-2025.web.app**

El Hosting funciona correctamente, PERO:

###  Las Cloud Functions NO pueden desplegarse sin plan Blaze  
(Firebase requiere tarjeta para habilitar CloudBuild en funciones).

 Por lo tanto:

- El procesamiento ZIP  
- La descompresión  
- Las URL firmadas  

**Solo funcionan dentro de los EMULADORES**, que es exactamente lo que pide la prueba técnica.

---

#  Cómo Ejecutar el Proyecto (Frontend + Emuladores)

##  1. Clonar el repositorio

```
git clone https://github.com/hubersteven/pruebaTecnica.git
cd pruebaTecnica
```

## 2. Instalar dependencias del frontend (Vue)

```
npm install
```

## 3. Instalar dependencias de Cloud Functions

```
cd functions
npm install
cd ..
```

## 4. Iniciar Firebase Emulator Suite

```
firebase emulators:start
```

Emuladores activos:

|Servicio|Puerto|
|---|---|
|Firestore|8080|
|Storage|9199|
|Functions|5001|
|Hosting|5000|
|Emulator UI|4000|

## 5. Ejecutar Vue en modo desarrollo

En otra terminal:

```
npm run dev
```

Accesos:

**http://localhost:5173**
 → Modo desarrollo

**http://localhost:5000**
 → Hosting emulado

---

# Flujo de Procesamiento ZIP

1. Sube un archivo ZIP desde la interfaz.
2. El ZIP va a: `zips_to_process/`
3. La Cloud Function lo descomprime automáticamente.
4. Archivos extraídos: `unzipped_files/`
5. Metadatos guardados en Firestore: `datos_procesados/`
6. La vista /data muestra todo en tiempo real.
7. Puedes descargar cada archivo con su nombre original.

---

# Build del sitio (solo Hosting)

```
npm run build
firebase deploy --only hosting
```


Sitio publicado:

**https://pruebatecnica-2025.web.app**

---

# Estructura del Proyecto

```
pruebaTecnica/
│── .vscode
│   ├── extensions.json
│   └──settings.json
│── dist
│   ├──assets
│   	├──AboutView-CR60oo4l.js
│   	├──AboutView-DhlS7raN.css
│   	├──index-B_kKuri4.js
│   	└──index-CkrsojA4.css
│   ├──favicon.ico
│   └──index.html
│── functions
│   ├── node_modules
│   ├── .gitignore
│   ├── index.js
│   └──package.json
│   	├── .eslintrc.js
│   	└──package-lock.json
│── node_modules
│── public
│   └──favicon.ico
│── src
│   ├── assets
│   	├──base.css
│   	├──logo.svg
│   	└──main.css
│   ├── components
│   	├──icons
│   		├──IconCommunity.vue
│   		├──IconDocumentation.vue
│   		├──IconEcosystem.vue
│   		├──IconSupport.vue
│   		└──IconTooling.vue
│   	├──FeatureCard.vue
│   	├──HelloWorld.vue
│   	├──TheWelcome.vue
│   	└──WelcomeItem.vue
│   ├── firebase
│   	└──config.js
│   ├── router
│   	└──index.js
│   ├── views
│   	├──AboutView.vue
│   	├──DataView.vue
│   	├──DemoView.vue
│   	└──UploadView.vue
│   ├── App.vue
│   └──main.js
│── .firebaserc
│── .gitattributes
│── .gitignore
│── firebase.json
│── firestore-debug.log
│── firestore.indexes.json
│── firestore.rules
│── index.html
│── package.json
│   ├── .editorconfig
│   ├── eslint.config.js
│   └──package-lock.json
│── README.md
│── storage.rules
└── vite.config.js
│   └──jsconfig.json
```

---

# Capturas

## 1. Vista tarjetas Vue

[![Captura-de-pantalla-2025-12-12-202436.png](https://i.postimg.cc/ryxdr5Qd/Captura-de-pantalla-2025-12-12-202436.png)](https://postimg.cc/7bPYvJvD)

[![Captura-de-pantalla-2025-12-12-202449.png](https://i.postimg.cc/pXBJKwqm/Captura-de-pantalla-2025-12-12-202449.png)](https://postimg.cc/dLLCYxMF)

## 2. Vista de subida de ZIP

[![Captura-de-pantalla-2025-12-12-204751.png](https://i.postimg.cc/nrFCxPBh/Captura-de-pantalla-2025-12-12-204751.png)](https://postimg.cc/HcNp436q)

[![Captura-de-pantalla-2025-12-12-204808.png](https://i.postimg.cc/pX1pNkdZ/Captura-de-pantalla-2025-12-12-204808.png)](https://postimg.cc/F7393y3d)

[![Captura-de-pantalla-2025-12-12-204818.png](https://i.postimg.cc/qvPqqRyQ/Captura-de-pantalla-2025-12-12-204818.png)](https://postimg.cc/9DBCNcxq)

## 3. Vista `/data` con archivos procesados

[![Captura-de-pantalla-2025-12-12-205011.png](https://i.postimg.cc/nc5cSzRV/Captura-de-pantalla-2025-12-12-205011.png)](https://postimg.cc/ppfHp2M3)

## 4. Emulator UI: Firestore `(datos_procesados)`

[![Captura-de-pantalla-2025-12-12-210559.png](https://i.postimg.cc/rwkWZQZ3/Captura-de-pantalla-2025-12-12-210559.png)](https://postimg.cc/qz1zzXTx)

## 5. Emulator UI: Storage `(zips_to_process y unzipped_files)`

[![Captura-de-pantalla-2025-12-12-212425.png](https://i.postimg.cc/ncwgv9dk/Captura-de-pantalla-2025-12-12-212425.png)](https://postimg.cc/Czkc05pB)

## 6. Consola del emulador mostrando `processZipUpload`

[![Captura-de-pantalla-2025-12-12-212713.png](https://i.postimg.cc/CKCc6R4t/Captura-de-pantalla-2025-12-12-212713.png)](https://postimg.cc/NyM8KfS7)

## 7. Archivo descargado con su nombre original

[![Captura-de-pantalla-2025-12-12-212849.png](https://i.postimg.cc/hGG0M2fh/Captura-de-pantalla-2025-12-12-212849.png)](https://postimg.cc/CRWDxHCV)

[![Captura-de-pantalla-2025-12-12-212951.png](https://i.postimg.cc/qMLnY8fc/Captura-de-pantalla-2025-12-12-212951.png)](https://postimg.cc/KR1R3384)

[![Captura-de-pantalla-2025-12-12-213016.png](https://i.postimg.cc/cH4PR7N3/Captura-de-pantalla-2025-12-12-213016.png)](https://postimg.cc/rd3hcrsy)

---

# Estado del Proyecto

- Hosting funcionando
- Emuladores funcionando
- Procesamiento ZIP funcional
- Descarga con nombre original
- Cumple todos los requisitos de la Prueba Técnica

---

# Autor

Huber  Steven Arroyave Rojas

Proyecto desarrollado como parte de la Prueba Técnica.
