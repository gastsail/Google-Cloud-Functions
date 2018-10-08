const functions = require('firebase-functions'); 
const admin = require('firebase-admin'); 
admin.initializeApp(); //Iniciar firebase Admin para usar Firebase


//Funcion que chequea por datos en un nodo de la base de datos , tanto antes como despues de cambiar su valor

    exports.dbWrite = functions.database.ref('/Prueba/nombre').onWrite((change, context) => {
        const beforeData = change.before.val(); // data antes de cambiar el valor
        console.log('Nombre antes de cambiar: ', beforeData);
        const afterData = change.after.val(); // data despues de cambiar el valor
        console.log('Nombre despues de cambiar: ', afterData);

        
      });
