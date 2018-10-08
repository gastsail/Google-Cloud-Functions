// Para crear cloud functions es importante usar el SDK de Funciones
const functions = require('firebase-functions');

// Para acceder al Realtime Database necesitamos importar el SDK de Admin
const admin = require('firebase-admin');
admin.initializeApp();

// Obtenemos el texto pasado por parametro al link HTTP y lo ponemos en nuestra bas ede datos
// bajo el nodo /messages/:pushId/original
exports.addMessageSouthAmerica = functions.region('us-east1').https.onRequest((req, res) => {
    // Obtenemos el texto pasado por parametro como ?text=textoejemplo
    const original = req.query.text;

    // Mandamos ese texto al Realtime Database usando el SDK de Admin
    return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
      // Redireccione con 303 a la URL del objeto insertado en la consola de Firebase.
      //Codigos http https://cloud.google.com/storage/docs/json_api/v1/status-codes
      return res.redirect(303, snapshot.ref.toString());
    });
  });

  