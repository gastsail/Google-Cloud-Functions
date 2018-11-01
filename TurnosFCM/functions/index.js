const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

//Primero agarramos el trigger onWrite para que cada vez que un turno cambia, podamos obtener su valor
exports.sendClientesNotification = functions.database.ref('/farmacia/turno')
    .onWrite((snapshot, context) => {

        //Guardamos ese valor del turno en la const numeroTurno luego de que cambia, por eso usamos after.
        const numeroTurno = snapshot.after.val();
        console.log('Turno: '+numeroTurno);

        //Creamos una referencia root a nuestra base de datos, para poder hacer una query al nodo clientes
        const promesaClientes = snapshot.before.ref.root;
        //Esta query , retorna una promesa por el .once, por lo cual se necesita un .then y un return
        //En este caso, solicitamos todos lsos clientes del nodo, y si no se pudieron traer, se muestra un catch con un error
        promesaClientes.child('/farmacia/clientes').once('value').then((snapshot)=>{

            //Creamos una const que va a ser los valores que le vamos a pasar a la promesa debajo para retornar.
            //Voy a necesiar usar un promise.all por que van a ser mas de una promesa para poder manejar la notificacion
        const clientes = snapshot.forEach(data => {
            
            //Luego de loopear dentro del nodo de los cientes, selecciono dentro de cada uno su device_token y el numero a notificar.
             const key = data.key;
              const device_token = data.child('device_token').val();
              const numeroNotificar = data.child('notificar').val();
              console.log('El usuario: '+ key + ' tiene un device_token: '+device_token+' y '+ ' se le debe notificar en el numero: '+ numeroNotificar );

              //Si el numero de ese cliente, coinside con el numero de turno, le enviamos una notificacion, sino retornamos que no se le debe mandar una notificacion
          if(numeroNotificar === numeroTurno){
            const payload = {
                "data": {
                    "title": "Su turno ah llegado",
                    "body": "el turno "+numeroNotificar+" es el siguiente a ser atendido.",
                    "icon": "ic_launcher",
                    "sound": "default",
                    "click_action": "delete_token"
                  }
            };
            
            return admin.messaging().sendToDevice(device_token,payload);
        }else{
            return console.log('No notificar al usuario: '+ device_token + ' por que no coinside su turno '+numeroNotificar+' con el turno '+numeroTurno);
        }
               
            });

            //Retornamos la promesa que ejecuta el forEach para leer a los clientes y obtener sus datos.
            return clientes;
              
            //Retornamos un catch en caso de cualquier problema con la promesa clientes
        }).catch(error => {
             console.log('Error en la promesa para conseguir los clientes.');
            });
        


    });