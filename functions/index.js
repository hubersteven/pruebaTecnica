const functions = require("firebase-functions");
const admin = require("firebase-admin");
const path = require("path");
const os = require("os");
const fs = require("fs");
const AdmZip = require("adm-zip");
const mime = require("mime-types");
const { Storage } = require("@google-cloud/storage");
const { Timestamp } = require("firebase-admin/firestore");

// Inicializar Firebase Admin
admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();
const storageClient = new Storage();

// Constantes
const UPLOAD_FOLDER = "zips_to_process";
const COLLECTION_NAME = "datos_procesados";

// Cargar clave segura
const functionsConfig = functions.config();
const DOWNLOAD_KEY =
  functionsConfig.app?.download_key ||
  process.env.DOWNLOAD_KEY ||
  null;

console.log("USANDO DOWNLOAD_KEY DEL EMULADOR:", DOWNLOAD_KEY);

exports.processZipUpload = functions.storage.object().onFinalize(async (object) => {

  const filePath = object.name;
  const fileName = path.basename(filePath);

  // Solo procesar ZIPs dentro de zips_to_process
  if (!filePath.startsWith(UPLOAD_FOLDER) || !filePath.endsWith(".zip")) {
    console.log(`Skipping file: ${fileName} (Not a ZIP in ${UPLOAD_FOLDER}).`);
    return null;
  }

  console.log(`Procesando ZIP: ${filePath}`);

  const tempZipPath = path.join(os.tmpdir(), fileName);

  try {
    // Descargar ZIP a carpeta temporal
    await storage.bucket().file(filePath).download({ destination: tempZipPath });
    console.log(`ZIP descargado a: ${tempZipPath}`);

    const zip = new AdmZip(tempZipPath);
    const entries = zip.getEntries();
    console.log(`Entradas en ZIP: ${entries.length}`);

    const batch = db.batch();

    for (const entry of entries) {
      if (entry.isDirectory || entry.entryName.includes("__MACOSX")) continue;

      const rawData = entry.getData();
      const fileNameInsideZip = entry.entryName;

      // Nombre único para evitar colisiones
      const uniqueId = `${Date.now()}_${Math.floor(Math.random() * 100000)}`;
      const uniqueName = `${uniqueId}_${fileNameInsideZip}`;
      const storagePath = `unzipped_files/${uniqueName}`;

      const contentType = mime.lookup(fileNameInsideZip) || "application/octet-stream";

      // Subir archivo descomprimido
      await storage.bucket().file(storagePath).save(rawData, {
        metadata: { contentType }
      });

      console.log(`→ Subido: ${storagePath} (${contentType})`);

      // Registrar en Firestore
      const docRef = db.collection(COLLECTION_NAME).doc();

      batch.set(docRef, {
        nombre_original: fileNameInsideZip,
        storage_path: storagePath,
        mime: contentType,
        origen_zip: filePath,
        timestamp: Timestamp.now()
      });
    }

    await batch.commit();
    console.log("Todo insertado en Firestore correctamente.");

  } catch (err) {
    console.error("Error en processZipUpload:", err);

  } finally {
    if (fs.existsSync(tempZipPath)) fs.unlinkSync(tempZipPath);
  }

  return null;
});

exports.getSignedDownloadUrl = functions.https.onCall(async (data) => {
  const { storagePath, nombreOriginal, key } = data;

  // Validar clave
  if (!key || key !== DOWNLOAD_KEY) {
    throw new functions.https.HttpsError("permission-denied", "Clave incorrecta.");
  }

  const bucket = storage.bucket();

  // Emulador → no soporta headers → link directo
  if (process.env.FUNCTIONS_EMULATOR === "true") {
    console.log("Emulador detectado → URL simulada");

    return {
      url: `http://localhost:9199/v0/b/${bucket.name}/o/${encodeURIComponent(
        storagePath
      )}?alt=media`
    };
  }

  // PRODUCCIÓN → Signed URL con filename personalizado
  const file = storageClient.bucket(bucket.name).file(storagePath);

  const [signedUrl] = await file.getSignedUrl({
    action: "read",
    version: "v4",
    expires: Date.now() + 5 * 60 * 1000,
    responseDisposition: `attachment; filename="${nombreOriginal}"`
  });

  return { url: signedUrl };
});
