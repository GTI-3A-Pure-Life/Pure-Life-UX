// .....................................................................
// MVC-mediciones.js
// Rubén Pardo Casanova 29/09/2021
// .....................................................................



var addressPoints = [
    [-37.8839, 175.3745188667, 300],
    [-37.8869090667, 175.3657417333, 250],
    [-37.8894207167, 175.4015351167, 200],
    [-37.8927369333, 175.4087452333, 150],
    [-37.90585105, 175.4453463833, 100],
    [-37.9064188833, 175.4441556833, 50],
    [-37.90584715, 175.4463564333, 0],
    [-37.9022371333, 175.47991035, 10],
    [-37.9020014833, 175.4799581667, 1],
    [-37.9020824, 175.4802630167, 2],
    [-37.9018589833, 175.4804760833, 3],
    [-37.9018211333, 175.4806769667, 4],
    [-37.9021543667, 175.4805538833, 5],
    [-37.9022658, 175.4807579333, 6],
    [-37.9024517833, 175.4806480667, 7],
    [-37.9024251167, 175.48041985, 8],
    [-37.9023317833, 175.4802119667, 9],
    [-37.9321212167, 175.4555088, 39],
    [-37.8956185167, 175.4719458667, 4],
    [-37.8954566, 175.4728120333, 20],
    [-37.8957231833, 175.4727906, 22],
    [-37.8956085833, 175.4726702, 22],
    [-37.8956460167, 175.4718485167, 300],
    ]

var VistaMediciones = {

    controlador:{},

    bloqueContenedor:{},
    bloqueTabla:{},
    bloqueCargaObtenerMediciones:{},
    snackBarError:{},

    formularioUltimasMediciones:{},
    errorFormCuantas:{},
    map:{},
    idw:{},
    loader: {},
    

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
        
        if(mediciones !=null){
            //addressPoints = this.controlador.toArray(mediciones);

            this.map = L.map('map').setView([31, 31], 10);

            var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(this.map);
        
            this.idw = L.idwLayer(addressPoints.concat(this.controlador.toArray(mediciones)),{
                    opacity: 0.5,
                    maxZoom: 18,
                    cellSize: 3,
                    exp: 3,
                    max: 300 
                }).addTo(this.map);

            this.cargarDatos();
        }


        //this.esconderTodosLosElementosObtenerMediciones();
        //this.mostrarContenido(true);
        
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

    pintarMapa: function (mediciones) {

        this.map.removeLayer(this.idw);
        let puntos = addressPoints.concat(mediciones);
        console.log(puntos);
    
        this.idw = L.idwLayer(puntos,{
                opacity: 0.5,
                maxZoom: 18,
                cellSize: 3,
                exp: 3,
                max: 300 
            }).addTo(this.map);
        setTimeout(() => {this.cargarDatos()},  500);
    },

    iniciarLoader: function () {
        document.getElementById("loader").style.display = "block";
        document.getElementById("map").style.display = "none";
    },
    cargarDatos: function() {
        document.getElementById("loader").style.display = "none";
        document.getElementById("map").style.display = "block";
    }


}// vista

var ControladorMediciones = {

    vista: VistaMediciones,
    mediciones: [],


    // inicia la obtencion de todas las mediciones 
    iniciarTodasObtenerMediciones: async function(){
        //this.vista.mostrarCargarObtenerMediciones();
        this.vista.controlador = this;

        try{

            this.mediciones = await LogicaFalsa.obtenerTodasMediciones();
            
            this.vista.representarTodasLasMediciones(this.mediciones)

       }catch(e){
            console.error(e);
            //this.vista.representarError(e);
        
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

    toArray: function(lista) {
        var arrayMediciones = [];
        let calidadInventada = 0;
        let sumaPos = 0
        for (let i = 0; i < lista.length; i++) {
            arrayMediciones[i] = new Array(3);
            arrayMediciones[i][0] = lista[i].posMedicion.latitud;
            arrayMediciones[i][1] = lista[i].posMedicion.longitud;
            arrayMediciones[i][2] = lista[i].valor;
            
        }

        return arrayMediciones;
    },

    filtrarPorGas: function(tipoGas) {
        this.vista.iniciarLoader()

        let botones = document.getElementsByClassName("botonDeGases");
        let arrayMediciones = new Array();
        for (let i = 0; i < botones.length; i++) {
            if(botones[i].value == tipoGas && botones[i].classList.contains("botonInactivo")) {
                botones[i].classList.remove("botonInactivo")
                botones[i].classList.add("botonActivo")
            }
            else {
                botones[i].classList.add("botonInactivo")
                botones[i].classList.remove("botonActivo")
            }

            if (botones[i].classList.contains("botonActivo")) {
                this.mediciones.forEach(medicion => {
                    if(medicion.tipoGas == tipoGas) {
                        console.log(medicion.tipoGas);
                        let datos = new Array(3);
                        datos[0] = medicion.posMedicion.latitud;
                        datos[1] = medicion.posMedicion.longitud;
                        datos[2] = medicion.valor;
                        arrayMediciones.push(datos);
                    }
                });
            }
        }
        this.vista.pintarMapa(arrayMediciones);
    }
}// controlador 