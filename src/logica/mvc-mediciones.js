// .....................................................................
// MVC-mediciones.js
// Rubén Pardo Casanova 29/09/2021
// .....................................................................


var VistaMediciones = {

    controlador:{},

    bloqueContenedor:{},
    bloqueTabla:{},
    bloqueCargaObtenerMediciones:{},
    snackBarError:{},

    formularioUltimasMediciones:{},
    errorFormCuantas:{},

    

    // funcion que recibe los id de elementos html para controlarlos
    preparar: function(idContenedor,idTabla,idCargaObtenerMediciones,idSnackBarError, idFormUltimasMediciones, errorFormCuantas){

        this.bloqueContenedor = document.getElementById(idContenedor);
        this.bloqueTabla = document.getElementById(idTabla);
        this.bloqueCargaObtenerMediciones = document.getElementById(idCargaObtenerMediciones);
        this.snackBarError = document.getElementById(idSnackBarError);  

        this.formularioUltimasMediciones = document.getElementById(idFormUltimasMediciones);
        this.errorFormCuantas = document.getElementById(errorFormCuantas);

        this.esconderTodosLosElementosObtenerMediciones();

    },

    //-----------------------------------------
    // lista de mediciones
    //----------------------------------------

    // esconder todos los elementos html de lista medicion
    esconderTodosLosElementosObtenerMediciones:function(){
        this.bloqueCargaObtenerMediciones.style.display = "none";
        this.bloqueContenedor.style.display = "none";
        this.errorFormCuantas.style.display = "none";
    },

    // esconder los elementos y mostrar la carga
    mostrarCargarObtenerMediciones: function(){
        this.esconderTodosLosElementosObtenerMediciones();
        this.bloqueCargaObtenerMediciones.style.display = "block";
    },

    // T/F->()
    // esconde o muestra el contenido
    mostrarContenido: function(mostrar){
        this.bloqueContenedor.style.display = mostrar ? "block" : "none";
    },

    // esconder los elementos y mostrar la lista de mediciones
    representarTodasLasMediciones: function(mediciones){

        console.log("REPRESENTAR",mediciones);
        //pintar los elementos por mediciones
        
        this.bloqueTabla.innerHTML ="";
        if(mediciones !=null){
            for(let i = 0; i<mediciones.length;i++){
                
                let li = document.createElement("li")
                li.innerHTML = `${mediciones[i].sensor_id} | ${mediciones[i].usuario_id} | ${mediciones[i].medicion_valor} | ${this.formatearFecha(mediciones[i].medicion_fecha)} `
    
                this.bloqueTabla.append(li)
            }
            
        }


        this.esconderTodosLosElementosObtenerMediciones();
        this.mostrarContenido(true);
        
    },

      /**
     * Texto -> formatearFecha() -> Texto
     * @param {String} fechaAFormatear 
     * @returns fecha formateada 2021/10/7 10:50:31
     */
       formatearFecha(fechaAFormatear){
        let date = new Date(fechaAFormatear);
        let strRes = 
        (date.getFullYear()+
        "/"+(date.getMonth()+1)+
        "/"+date.getDate()+
        " "+date.getHours()+
        ":"+date.getMinutes()+
        ":"+date.getSeconds());

        return strRes;
    },

    //---------------------------------------------
    // checkFormularioUltimasMediciones() -> V/F
    // comrpueba que no haya ningun campo vacio ni incorrecto en el formulario
    // de ultimas mediciones
    //--------------------------------------
    checkFormularioUltimasMediciones:function(){
        let valid = true;

        let cuantas = this.formularioUltimasMediciones.cuantas.value;
        
        // comrpobar dni vacio
        if(cuantas <= 0){
            // mostrar error dni
            valid = false;
            this.errorFormCuantas.style.display = "block"
        }


        return valid;
    }, // check form insertar
    

    //-----------------------------------------
    // FIN lista de mediciones
    //----------------------------------------

   
    /**
     * Funcion que muestra un snack bar de error durante unos pocos segundos
     * @param {Texto} mensaje a mostrar 
     */
    representarError:function(mensaje){
        
        this.snackBarError.innerHTML = mensaje;
        this.snackBarError.className = "show";
        
        setTimeout(()=>{ this.snackBarError.classList.remove("show"); }, 3000);
    },


}// vista

var ControladorMediciones = {

    vista: VistaMediciones,
    mediciones: [],


    // inicia la obtencion de todas las mediciones 
    iniciarTodasObtenerMediciones: async function(){
        this.vista.mostrarCargarObtenerMediciones();
        this.vista.controlador = this;

        try{

            this.mediciones = await LogicaFalsa.obtenerTodasMediciones();
            
            this.vista.representarTodasLasMediciones(this.mediciones)

       }catch(e){
            console.error(e);
            this.vista.representarError(e);
        
       }



    },

     // inicia la obtencion de todas las mediciones 
     iniciarUltimasObtenerMediciones: async function(event){
        event.preventDefault();
        if(this.vista.checkFormularioUltimasMediciones()){
            this.vista.controlador = this;
            this.vista.mostrarCargarObtenerMediciones();
            try{

                this.mediciones = await LogicaFalsa.obtenerUltimasMediciones(this.vista.formularioUltimasMediciones.cuantas.value);
                
                this.vista.representarTodasLasMediciones(this.mediciones)

            }catch(e){
                    console.error(e);
                    this.vista.representarError(e);
                
            }
        }



    },




}// controlador 