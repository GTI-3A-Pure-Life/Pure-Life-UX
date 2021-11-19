// .....................................................................
// LogicaFalsa.js
// Clase que replica la logica de negocio del servidor 
// Rubén Pardo Casanova 29/09/2021
// .....................................................................

const IP_PUERTO="http://localhost:8080"

LogicaFalsa = {


    // .................................................................
    // -->
    // obtenerTodasMediciones() --> 
    // <-- Lista<MedicionCO2>
    // .................................................................
    /**
     * 
     * @returns Una Lista<MedicionCO2> con todas las mediciones de la BD
     */
    obtenerTodasMediciones : async function() {
        let respuesta = await fetch(  IP_PUERTO+"/mediciones",{
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
                        return medicionesJSON.datos;
                     })
                    
        return respuesta;

    },


    // .................................................................
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

    registrar_usuario : async function (nombre, correo, contrasenya, telefono) {
        let respuesta = await fetch(IP_PUERTO+"/usuario/registrarse",  {
            method: "POST",
            headers : { 'User-Agent' : 'Ruben', 'Content-Type' : 'application/json' },
            body : JSON.stringify({res:{nombre:nombre, correo: correo, contrasenya: contrasenya, telefono:telefono}})
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