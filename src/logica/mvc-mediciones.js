// .....................................................................
// MVC-mediciones.js
// Rubén Pardo Casanova 29/09/2021
// .....................................................................

var puntosCO = [];
var puntosNO2 = [];
var puntosSO2 = [];
var puntosO3 = [];

var VistaMediciones = {
    controlador: {},

    map: {},
    idw: {},
    loader: {},
    slider: {},
    minSlider: {},
    maxSlider: {},
    valorSlider: {},
    puntos: [],
    mediciones: [],
    circulos: [],

    // .................................................................
    // esconder los elementos y mostrar la lista de mediciones
    //
    // mediciones -->
    // representarTodasLasMediciones() --> 
    // <-- Lista<MedicionCO2>
    // .................................................................
    /**
     * 
     * @param mediciones La lista de mediciones
     */
    representarTodasLasMediciones: function (mediciones) {

       /* let posiciones = mediciones.map(medicion => {
            return medicion.posMedicion
        })

        // Coger posiciones no duplicadas
        let posSet = posiciones.filter((element, index, self) =>
        index === self.findIndex((t) => (
            t.latitud == element.latitud && t.longitud == element.longitud
        ))
      )
      // Crear un Set con las posiciones y todas sus mediciones (vacías)
        posSet = posSet.map(element => {
            return {pos: element, valor: []}
        })

        // Asigna todas las mediciones de una posicióon al array de posiciones
        for (let i = 0; i < posSet.length; i++) {

            for (let j = 0; j < mediciones.length; j++) {
                if(posSet[i].pos.latitud == mediciones[j].posMedicion.latitud && posSet[i].pos.longitud == mediciones[j].posMedicion.longitud) {
                    posSet[i].valor.push(mediciones[j])
                }
            }
        }
        // Jordi porfa no me pegues uWu esto ordena por fechas
        for (let i = 0; i < posSet.length; i++) {
          posSet[i].valor.sort(function(medicion1, medicion2) {
            return medicion2.valor >= medicion1.valor
          })
            posSet[i].valor.sort(function(medicion1, medicion2) {
                return new Date(medicion2.fechaHora) - new Date(medicion1.fechaHora)
            })
            
        }



        console.log("mediciones",mediciones);
        this.mediciones = posSet.map(element=>{
          return element.valor[element.valor.length-1]
        });

        console.log("posset",posSet);*/
        this.mediciones = mediciones;

        // Si hay mediciones, crea los puntos del gas (WIP para interpolar), 
        // añade los markers de las estaciones de medida y muestra el mapa completo
        if (this.mediciones != null) {
            
            
            /*for (let i = 0; i < posSet.length; i++) {
              this.crearMarkers(posSet[i])
                
            }*/
            this.controlador.obtenerEstaciones();
            this.puntos = this.formatearMedicionesLeaflet(this.mediciones)

            
      
            var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(this.map);

            this.idw = L.idwLayer(this.puntos ,{
                    opacity: 0.4,
                    maxZoom: 18,
                    cellSize: 20,
                    exp: 5,
                    max: 350
                }).addTo(this.map);

            this.cargarDatos();
            
        }
    },

    borrarCapaInterpolacion: function(){
      this.map.removeLayer(this.idw);
    },

    // .................................................................
    // transformar mediciones en array para que lo interprete leaflet
    //
    // mediciones -->
    // formatearMedicionesLeaflet() --> 
    // <-- [[lat,lng,valor],...]
    // .................................................................
    formatearMedicionesLeaflet:  function (lista) {

        /*for (let i = 0; i < lista.length; i++) {
            if(document.getElementsByClassName("botonDeGases")[i].classList.contains("botonActivo")) {
                if(document.getElementsByClassName("botonDeGases")[i].value == 1) {
                    console.log(lista[0]);
                    this.puntos = this.puntos.push(lista[0])
                }
                if(document.getElementsByClassName("botonDeGases")[i].value == 2) {
                    this.puntos = this.puntos.push(lista[1])
                }
                if(document.getElementsByClassName("botonDeGases")[i].value == 3) {
                    this.puntos = this.puntos.push(lista[2])

                }
                if(document.getElementsByClassName("botonDeGases")[i].value == 4) {
                    this.puntos = this.puntos.push(lista[3])

                }
            }            
        }*/

       return lista.map(element=>{
          return  [element.posMedicion.latitud,element.posMedicion.longitud,element.valor]
       })
    },
    // .................................................................
    // Crea los circulos de donde se toma el gas (hay que cambiarlo para cuando interpolemos el mapa)
    //
    // lista -->
    // crearMarkers() -->
    // <--
    // .................................................................
    /**
     * 
     * @param lista La lista de medidas sobre la que crea los markers
     */
    crearMarkers: function(lista) {
            let circle = L.circle([lista.pos.latitud, lista.pos.longitud], {
                color: this.getColorCirculo(lista.valor[0].valor),
                fillColor: this.getColorCirculo(lista.valor[0].valor),
                fillOpacity: 0.5,
                radius: 20
            }).addTo(this.map);
            this.circulos.push(circle); 
    },
    // .................................................................
    // Crea los markers de las estaciones de medida oficiales
    //
    // lista -->
    // crearMarkersEstaciones() -->
    // <--
    // .................................................................
    /**
     * 
     * @param lista La lista de medidas sobre la que crea los markers
     */
    crearMarkersEstaciones: function (lista) {

        lista.forEach(element => {
            let icono = L.icon({
                iconUrl: this.getColorMarker(element[2]),
            
                iconSize:     [19, 47.5], // size of the icon
                shadowSize:   [50, 64], // size of the shadow
                iconAnchor:   [11, 47], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 62],  // the same for the shadow
                popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            });
            let marker = L.marker([element[0], element[1]], {icon: icono}).addTo(this.map);
            let color = this.getColorCirculo(element[2]);
            marker.bindPopup("<svg version='1.1' xmlns='http://www.w3.org/2000/svg' width='91' height='44.8' viewBox='0 0 12 10'><rect x='9' y='3' width='2.5' height='2.5' fill='"+ color + "' /></svg>" + "AQI " + element[2]);
        });

        
    },

    getColorMarker: function(valor) {
        if(valor >= 0 && valor <= 50) {
            return "recursos/locVerde.png"
        } else if(valor > 50 && valor <= 150) {
            return "recursos/locAmarillo.png"
        } else if(valor > 150 && valor <= 200) {
            return "recursos/locRojo.png"
        } else {
            return "recursos/locPurpura.png"
        }
    },
    // .................................................................
    // Devuelve un color para el círculo según el gas (se eliminará cuando interpolemos)
    //
    // valor -->
    // getColorCirculo() -->
    // <-- color
    // .................................................................
    /**
     * 
     * @param valor El número que identifica cada gas
     */
    getColorCirculo: function(valor) {
        if(valor >= 0 && valor <= 50) {
            return "green"
        } else if(valor > 50 && valor <= 150) {
            return "yellow"
        } else if(valor > 150 && valor <= 200) {
            return "red"
        } else {
            return "purple"
        }
    },
    // .................................................................
    // Devuelve el valor más alto de una lista (IMPLEMENTACIÓN FUTURA)
    //
    // lista -->
    // getMaximoValor() -->
    // <-- valor
    // .................................................................
    /**
     * 
     * @param valor El número que identifica cada gas
     */
    getMaximoValor: function (lista) {
        let maximo = 0;
        lista.forEach((dato) => {
            if (dato[2] > maximo) {
                maximo = dato[2];
            }
        });

        return maximo;
    },
    // .................................................................
    // Inicia la carga del mapa
    //
    // -->
    // iniciarLoader() -->
    // <-- 
    // .................................................................
    iniciarLoader: function () {
        document.getElementById("loader").style.display = "block";
        document.getElementById("map").style.display = "none";
    },
    // .................................................................
    // Muestra el mapa con sus datos
    //
    // -->
    // cargarDatos() -->
    // <-- 
    // .................................................................
    cargarDatos: function () {
        document.getElementById("loader").style.display = "none";
        document.getElementById("map").style.display = "block";
    },

    setSlider: function(valor) {
        this.slider.style.background = 'linear-gradient(90deg, #3ABB90 ' + valor + '%,#A7A7A7 ' + 0 + '%)';
    },

    setValoresSlider: function() {
        this.slider = document.getElementById("date1");
        this.minSlider = document.getElementsByClassName("startyear")[0];
        this.maxSlider = document.getElementsByClassName("endyear")[0];
        this.valorSlider = document.getElementsByClassName("setyear")[0];

        let mediciones = this.controlador.mediciones.sort(function(a, b) {
            if (a.fechaHora > b.fechaHora) {
                return 1;
            }
            if (a.fechaHora < b.fechaHora) {
                return -1;
            }
            return 0;
        })
        let hoy = new Date();
        let mesPasado = this.formatearFecha(new Date(hoy.getFullYear() +"-" + hoy.getMonth() + "-" + hoy.getDate()))
        this.slider.min = new Date(mesPasado).getTime() / 1000;
        this.slider.max = new Date(this.formatearFecha(hoy)).getTime() / 1000;
        this.slider.value = new Date().getTime() / 1000;

        this.minSlider.innerHTML = mesPasado;
        this.maxSlider.innerHTML = this.formatearFecha(new Date().toDateString());
        this.valorSlider.innerHTML = this.maxSlider.innerHTML;

    },

    formatearFecha: function(fecha) {
        let date = new Date(fecha)
        let strRes = (date.getFullYear() + "-"+ (date.getMonth()+1) + "-"+ date.getDate());

        return strRes;
    },

    actualizarSlider: function(valor, max, min) {
        document.getElementsByClassName("setyear")[0].innerHTML = this.formatearFecha(new Date(valor*1000).toDateString());
        valorRound = Math.round(((valor - min) / (max - min)) * 99)
        gradiente = 'linear-gradient(90deg, #3ABB90 ' + valorRound + '%, #A7A7A7 ' + (valorRound+1) + '%)';

        this.slider.style.background = gradiente;
    }
}; // vista

var ControladorMediciones = {
    vista: VistaMediciones,
    mediciones: [],
    todosLosGases: false,

    // .................................................................
    // inicia la obtencion de todas las mediciones
    //
    // ipPuerto -->
    // iniciarTodasObtenerMediciones() -->
    // <-- 
    // .................................................................
    /**
     * 
     * @param ipPuerto La dirección ip a la que tiene que apuntar (para poder usar la misma función en android) 
     */
    iniciarTodasObtenerMediciones: async function (ipPuerto) {
        this.vista.controlador = this;

        try {
           //this.mediciones = await LogicaFalsa.obtenerTodasMediciones(ipPuerto);
           this.mediciones = await LogicaFalsa.obtenerTodasMediciones("http://localhost:8080");

            this.vista.map = L.map("map").setView([38.995591, -0.167129], 12);
            var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(this.vista.map);
            this.vista.setValoresSlider();
            this.vista.setSlider(100);
            this.vista.representarTodasLasMediciones(this.mediciones);
            //this.vista.representarTodasLasMediciones([]);
        } catch (e) {
            console.error(e);
        }
    },

    iniciarObtenerMedicionesDeHasta: async function(ipPuerto, fecha) {
        let desde;
        let hasta;
        try {
            this.mediciones = await LogicaFalsa.obtenerTodasMediciones(ipPuerto);

            this.vista.representarTodasLasMediciones(this.mediciones);
        } catch (e) {
            console.error(e);
        }
    }
    // .................................................................
    // Obtiene las estaciones de medida de España
    //
    // -->
    // obtenerEstaciones() -->
    // <-- 
    // .................................................................
    obtenerEstaciones: async function() {
        try {
            let estaciones = await LogicaFalsa.obtenerEstacionesMedida();
            let arrayFinal = new Array(0);
            estaciones.forEach(estacion => {
                let nombre = "";
                nombre = estacion.station.name; 
                if(nombre.includes(", Spain")) {
                    arrayFinal.push([estacion.lat, estacion.lon, estacion.aqi]);
                }
            });
            this.vista.crearMarkersEstaciones(arrayFinal);
        } catch (e) {
            console.error(e);
        }
    },
    // .................................................................
    // Convierte un JSON en array
    //
    // json -->
    // toArray() -->
    // <-- array
    // .................................................................
    /**
     * 
     * @param lista La lista de objetos JSON a convertir 
     * @returns un array de mediciones con psoición, valor y gas
     */
    toArray: function (lista) {
        var arrayMediciones = [];

        for (let i = 0; i < lista.length; i++) {
            arrayMediciones[i] = new Array(3);
            arrayMediciones[i][0] = lista[i].posMedicion.latitud;
            arrayMediciones[i][1] = lista[i].posMedicion.longitud;
            arrayMediciones[i][2] = lista[i].valor;
            arrayMediciones[i][3] = lista[i].tipoGas;
        }
        return arrayMediciones;
    },
    // .................................................................
    // Permite filtrar el mapa por cada gas (hay que hacer cambios)
    //
    // tipoGas -->
    // filtrarPorGas() -->
    // <--
    // .................................................................
    /**
     * 
     * @param tipoGas La id del gas a filtrar
     * @returns 
     */
    filtrarPorGas: function (tipoGas) {
        this.vista.iniciarLoader();
        //this.vista.mediciones = []

        
        let botones = document.getElementsByClassName("botonDeGases");
        let botonActual;

        this.vista.borrarCapaInterpolacion()

        for (let i = 0; i < botones.length; i++) {
            if (botones[i].value == tipoGas) {
                botonActual = botones[i]
            }
        }

        if (tipoGas==0) {
            this.todosGasesActivos(botones);
        } else {
            this.todosGasesInactivos(botones);
            this.toggleGas(botonActual)
        }

 
            
        console.log("tipo gas",tipoGas);
        if (tipoGas == 0) {
            console.log("cuantas",this.mediciones.length);
            this.vista.representarTodasLasMediciones(this.mediciones)
            return;
        } else {
            let medicionesFiltradas = this.mediciones.filter(element => {
                return element.tipoGas == tipoGas;
            })
            console.log("cuantas",medicionesFiltradas.length);
            this.vista.representarTodasLasMediciones(medicionesFiltradas)
        }

    },
    /**
     * 
     * @param {HTMLElement[]} botones 
     * @param {HTMLElement} botonActual 
     */
    toggleGas: function(botonActual) {
        if(botonActual.classList.contains("botonInactivo")) {
            botonActual.classList.remove("botonInactivo");
            botonActual.classList.add("botonActivo");
        }
    },
    // .................................................................
    // Activa todos los gases (hay que hacer cambios)
    //
    // botones -->
    // todosGasesActivos() -->
    // <--
    // .................................................................
    /**
     * 
     * @param {HTMLElement[]} botones Los botones que controlan los filtros de los gases
     */
    todosGasesActivos: function(botones) {
        
        for (let i = 0; i < botones.length; i++) {
            if(botones[i].classList.contains("botonInactivo")) {
                botones[i].classList.remove("botonInactivo");
                botones[i].classList.add("botonActivo");
            }   
        }
    },
    // .................................................................
    // Desactiva todos los gases (hay que hacer cambios)
    //
    // botones -->
    // todosGasesInactivos() -->
    // <--
    // .................................................................
    /**
     * 
     * @param botones Los botones que controlan los filtros de los gases
     */
    todosGasesInactivos: function(botones) {
        for (let i = 0; i < botones.length; i++) {
            if(botones[i].classList.contains("botonActivo")) {
                botones[i].classList.add("botonInactivo");
                botones[i].classList.remove("botonActivo");
            }   
        }
    }
}; // controlador
