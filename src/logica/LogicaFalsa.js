// .....................................................................
// LogicaFalsa.js
// Clase que replica la logica de negocio del servidor 
// Rubén Pardo Casanova 29/09/2021
// .....................................................................

//const { report } = require("process");

const IP_PUERTO="http://localhost:8080"

//const IP_PUERTO ="http://localhost:8080"

LogicaFalsa = {


    // .................................................................
    // Obtiene todas las mediciones
    // -->
    // obtenerTodasMediciones() --> 
    // <-- Lista<MedicionCO2>
    // .................................................................
    /**
     * 
     * @returns Una Lista<MedicionCO2> con todas las mediciones de la BD
     */
    obtenerTodasMediciones : async function(ipDestino) {
        let respuesta = await fetch(  ipDestino+"/mediciones",{
                      headers : { 'User-Agent' : 'Ruben', 'Content-Type' : 'application/json' },
                     }).then(response=>{

                         if(response.status == 204){
                            //ok pero vacío
                            return {datos:[]};
                         }else if(response.status == 200){
                            // ok con contenido 
                            return response.json();
                         }else{
                         
                            // error
                            throw Error("Error en get mediciones")
                         }
                         
                        
                     }).then(medicionesJSON=>{
                        return medicionesJSON;
                     })
                    
        return respuesta;

    },

     // .................................................................
    // Obtiene las mediciones en un rango temporal
    // -->
    // obtenerTodasMediciones() --> 
    // <-- Lista<MedicionCO>
    // .................................................................
    /**
     * 
     * @returns Una Lista<MedicionCO2> con todas las mediciones de la BD
     */
     obtenerMedicionesDeHasta : async function(fechaIni,fechaFin) {
        let respuesta = await fetch(  IP_PUERTO+"/mediciones/"+fechaIni+"/"+fechaFin,{
                      headers : { 'User-Agent' : 'Ruben', 'Content-Type' : 'application/json' },
                     }).then(response=>{

                         if(response.status == 204){
                            //ok pero vacío
                            return {datos:[]};
                         }else if(response.status == 200){
                            // ok con contenido 
                            return response.json();
                         }else{
                         
                            // error
                            throw Error("Error en get mediciones")
                         }
                         
                        
                     }).then(medicionesJSON=>{
                        return medicionesJSON;
                     })
                    
        return respuesta;

    },


    // .................................................................
    // Obtiene las últimas mediciones
    // cuantas:N -->
    // obtenerTodasMediciones() --> 
    // <-- Lista<MedicionCO2>
    // .................................................................
    /**
     * 
     * @param {N} cuantas Numero de las ultimas mediciones a obtener
     * @returns Una Lista<MedicionCO2> con las ultimas N mediciones de la BD
     */
    obtenerUltimasMediciones : async function(cuantas) {
        let respuesta = await fetch(  IP_PUERTO+"/mediciones/ultimas/"+cuantas,{
                      headers : { 'User-Agent' : 'Ruben', 'Content-Type' : 'application/json' },
                     }).then(response=>{

                         if(response.status == 204){
                            //ok pero vacío
                            return {datos:[]};
                         }else if(response.status == 200){
                            // ok con contenido 
                            return response.json();
                         }else{
                            // error
                            throw Error("Error en get mediciones")
                         }
                         
                        
                     }).then(medicionesJSON=>{
                        
                      
                        // convertir el texto recibido por rest a JSON
                        /*for(let i = 0; i<medicionesSTR_JSON.datos.length; i++){
                            medicionesJSON[i] = JSON.parse(medicionesSTR_JSON.datos[i])
                        }*/

                         return medicionesJSON.datos;
                     })
                    
        return respuesta;

    },

    // .................................................................
    // Inicia sesión en la app
    // correo, contraseña -->
    // iniciar_sesion() --> 
    // <-- 
    // .................................................................
    /**
     * 
     * @param correo El correo del usuario
     * @param contrasenya La coontraseña del usuario (cifrada)
     * @returns Si se ha podido iniciar sesión o no
     */
    iniciar_sesion : async function (correo, contrasenya) {
        
        let respuesta = await fetch(IP_PUERTO+"/usuario/iniciar_sesion",  {
            method: "POST",
            headers : { 'User-Agent' : 'Ruben', 'Content-Type' : 'application/json' },
            body : JSON.stringify({res:{correo:correo, contrasenya: contrasenya}})
        }).then(response => {
            if(response.status == 200) {
                return response.json();
            } else if (response.status == 401) {
                throw Error("Error en datos");
            } else if (response.status == 500) {

                throw Error("Error en servidor");
            }
        });
        return respuesta;
        
    },
    // .................................................................
    // Permite al usuario registrarse en la app
    // nombre, correo, contraseña, telefono -->
    // iniciar_sesion() --> 
    // <-- 
    // .................................................................
    /**
     * 
     * @param nombre El nombre del usuario 
     * @param correo El correo del usuario 
     * @param contrasenya La coontraseña del usuario 
     * @param telefono El número de teléfono del usuario 
     * @returns Si el registro se ha podido realizar o no
     */
    registrar_usuario : async function (nombre, correo, contrasenya, telefono, token) {
        let respuesta = await fetch(IP_PUERTO+"/usuario/registrarse",  {
            method: "POST",
            headers : { 'User-Agent' : 'Ruben', 'Content-Type' : 'application/json' },
            body : JSON.stringify({res:{nombre:nombre, correo: correo, contrasenya: contrasenya, telefono:telefono, token: token}})
        }).then(response => {
            if(response.status == 200) {
                return response.json();
            } else if (response.status == 400) {
                throw Error("Error en datos");
            } else if (response.status == 500) {
                throw Error("Error en servidor");
            }
        });
        return respuesta;
        
    },

    mandar_correo: async function(nombre, correo, token) {
        console.log("entra");
        let respuesta = await fetch(IP_PUERTO+"/usuario/mandar_correo", {
            method: "POST",
            headers : { 'User-Agent' : 'Ruben', 'Content-Type' : 'application/json' },
            body : JSON.stringify({res:{nombre: nombre, correo: correo, token: token}})
        }).then(response => {
            if(response.status == 200) {
                return response.json();
            } else if (response.status == 400) {
                throw Error("Error en datos");
            } else if (response.status == 500) {
                throw Error("Error en servidor");
            }
        })
        return respuesta;
    },

    //==============================================================================================================================
    // Marca como leído un registro del sensor
    // @author Florescu, Lorena-Ioana
    // @version 24/11/2021
    //==============================================================================================================================
    /**
     * 
     * @param id El registro que se ha leído 
     * @returns Si la petición se realizó correctamente o no
     */

    actualizar_leido : async function (id) {
        let respuesta = await fetch(IP_PUERTO+"/registro_estado_sensor/leido",  {
            method: "PUT",
            headers : { 'User-Agent' : 'Ruben', 'Content-Type' : 'application/json' },
            body : JSON.stringify({res:{id:id}})
        }).then(response => {
            if(response.status == 200) {
                return response.json();
            } else if (response.status == 500) {
                throw Error("Error en servidor");
            }
        });
        return respuesta;
        
    },
//==============================================================================================================================
// Obtiene una lista de mediciones en una fecha concreta de un usuario
//
// fechaInicio, fechaFin, idUsuario -->
// obtenerMedicionesDeHastaPorUsuario() -->
// <-- Lista<Medicion>
//==============================================================================================================================
/**
 * 
 * @param fechaInicio La fecha desde donde empiezan las medidas
 * @param fechaFin La fecha hasta donde acabam las medidas
 * @param idUsuario El usuario del cual se cogen las medidas
 * @returns Las mediciones del usuario en ese espacio de tiempo
 */
    obtenerMedicionesDeHastaPorUsuario : async function(fechaInicio,fechaFin,idUsuario){
        let respuesta = await fetch(IP_PUERTO+"/mediciones/usuario?idUsuario="+idUsuario+"&fecha_inicio="+fechaInicio+"&fecha_fin="+fechaFin,{
                      headers : { 'User-Agent' : 'Ruben', 'Content-Type' : 'application/json' },
        }).then(response => {
            if(response.status == 200) {
                return response.json()
            } else if (response.status == 204) {
                return[];
            }else if (response.status == 400) {
                throw Error("Error en datos");
            } else if (response.status == 500) {
                throw Error("Error en servidor");
            }
        });
        return respuesta
    },
//==============================================================================================================================
// Obtiene la calidad del aire de una zona en un tiempo determinado
//
// fechaInicio, fechaFin, latitud, longitud, radio -->
// obtenerCalidadAirePorTiempoYZona() -->
// <-- medicion
//==============================================================================================================================
/**
 * 
 * @param fechaInicio La fecha desde donde empiezan las medidas
 * @param fechaFin La fecha hasta donde acaban las medidas
 * @param latitud  La latitud de la coordenada que servirá como centro
 * @param longitud La longitud de la coordenada que servirá como centro
 * @param radio El radio con el cual se formará un círculo cuyo centro es la posición anterior
 * @returns 
 */
    obtenerCalidadAirePorTiempoYZona : async function(fechaInicio,fechaFin, latitud,longitud, radio) {

        let respuesta = await fetch(IP_PUERTO+"/calidad_aire/zona?fecha_inicio="+fechaInicio+"&fecha_fin="+fechaFin+"&latitud="+latitud+"&longitud="+longitud+"&radio="+radio,{
            headers : { 'User-Agent' : 'Ruben', 'Content-Type' : 'application/json' },
        }).then(response =>{
            if(response.status == 200) {
                return response.json()
            } else if (response.status == 204) {
                return[];
            }else if (response.status == 400) {
                throw Error("Error en datos");
            } else if (response.status == 500) {
                throw Error("Error en servidor");
            }
        });
            return respuesta
    },

//==============================================================================================================================
// Obtiene todos los registros de los estados de los sensores
//
// -->
// obtenerRegistros() -->
// <-- Lista<RegistroEstadoSensor>
//==============================================================================================================================

    obtenerRegistros : async function() {
        let respuesta = await fetch(IP_PUERTO+"/registro_estado_sensor",{
            headers : { 'User-Agent' : 'Ruben', 'Content-Type' : 'application/json' },
        }).then(response =>{
            if(response.status == 200) {
                return response.json();
            } else if (response.status == 204) {
                return[];
            }else if (response.status == 400) {
                throw Error("Error en datos");
            } else if (response.status == 500) {
                throw Error("Error en servidor");
            }
        });
            return respuesta;
    },
//==============================================================================================================================
// Obtiene la calidad del aire de un usuario en un tiempo determinado
//
// fechaInicio,fechaFin, idUsuario -->
// obtenerCalidadAirePorTiempoYUsuario() -->
// <-- medicion
//==============================================================================================================================
obtenerCalidadAirePorTiempoYUsuario : async function(fechaInicio,fechaFin, idUsuario) {

    let respuesta = await fetch(IP_PUERTO+"/calidad_aire/usuario?fecha_inicio="+fechaInicio+"&fecha_fin="+fechaFin+"&idUsuario="+idUsuario,{
        headers : { 'User-Agent' : 'Ruben', 'Content-Type' : 'application/json' },
    }).then(response =>{
        if(response.status == 200) {
            return response.json()
        } else if (response.status == 204) {
            return[];
        }else if (response.status == 400) {
            throw Error("Error en datos");
        } else if (response.status == 500) {
            throw Error("Error en servidor");
        }
    });
        return respuesta
},

//==============================================================================================================================
// Obtiene las estaciones de medida oficiales
//
// -->
// obtenerEstacionesMedida() -->
// <-- Lista<Texto>
//==============================================================================================================================
obtenerEstacionesMedida: async function() {
    let respuesta = await fetch("https://api.waqi.info/map/bounds/?latlng=43.112382,4.121760,27.074341,-18.587159&token=7c7d70d4cd3fed72c7756498fbecc70b8b5e7193")
    .then(response => {
        if(response.status == 200) {
            return response.json()
        } else if (response.status == 204) {
            return[];
        }else if (response.status == 400) {
            throw Error("Error en datos");
        } else if (response.status == 500) {
            throw Error("Error en servidor");
        }
    });
        return respuesta.data;
},

obtenerCiudadPorUsuario: async function(usuarioId) {
    let respuesta = await fetch(IP_PUERTO+"/ciudad/usuario?idUsuario="+usuarioId, {
        headers : { 'User-Agent' : 'Ruben', 'Content-Type' : 'application/json' },
    }).then(response => {
        if(response.status == 200) {
            return response.json()
        } else if (response.status == 204) {
            return[];
        }else if (response.status == 400) {
            throw Error("Error en datos");
        } else if (response.status == 500) {
            throw Error("Error en servidor");
        }
    });
    return respuesta;
},

obtenerMedicionesPorZona: async function(lat, lng, radio) {
    let respuesta = await fetch(IP_PUERTO+"/mediciones/zona?latitud="+lat+"&longitud="+lng+"&radio="+radio, {
        headers : { 'User-Agent' : 'Ruben', 'Content-Type' : 'application/json' },
    }).then(response => {
        if(response.status == 200) {
            return response.json()
        } else if (response.status == 204) {
            return[];
        }else if (response.status == 400) {
            throw Error("Error en datos");
        } else if (response.status == 500) {
            throw Error("Error en servidor");
        }
    });
    return respuesta;
},
// .................................................................
// cerrar() -->
// .................................................................
    cerrar:function() {
        return new Promise( (resolver, rechazar) => {
        this.laConexion.close( (err)=>{
                ( err ? rechazar(err) : resolver() )
            })
        })
    }, // ()
} // class