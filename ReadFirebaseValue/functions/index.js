const functions = require('firebase-functions'); 
const admin = require('firebase-admin'); 
admin.initializeApp(); //init firebase admin

    exports.dbWrite = functions.database.ref('/Prueba/nombre').onWrite((change, context) => {
        const beforeData = change.before.val(); // data before the write
        console.log('Nombre antes de cambiar: ', beforeData);
        const afterData = change.after.val(); // data after the write
        console.log('Nombre despues de cambiar: ', afterData);

        //para escribir algo a la base de datos uso promesas y tengo que retornarlas y catchearlas

        
      });
