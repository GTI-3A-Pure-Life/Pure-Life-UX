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
    puntos: [],
    mediciones: [],
    circulos: [],


    // esconder los elementos y mostrar la lista de mediciones
    representarTodasLasMediciones: function (mediciones) {
        console.log(mediciones);

        let posiciones = mediciones.map(medicion => {
            return medicion.posMedicion
        })

        // Coger posiciones no duplicadas
        let posSet = posiciones.filter((element, index, self) =>
        index === self.findIndex((t) => (
            t.latitud == element.latitud && t.longitud == element.longitud
        ))
      )
        posSet = posSet.map(element => {
            return {pos: element, valor: []}
        })

        for (let i = 0; i < posSet.length; i++) {

            for (let j = 0; j < mediciones.length; j++) {
                if(posSet[i].pos.latitud == mediciones[j].posMedicion.latitud && posSet[i].pos.longitud == mediciones[j].posMedicion.longitud) {
                    posSet[i].valor.push(mediciones[j])
                }
            }
        }
        // Jordi porfa no me pegues uWu
        for (let i = 0; i < posSet.length; i++) {
            posSet[i].valor.sort(function(medicion1, medicion2) {
                return new Date(medicion2.fechaHora) - new Date(medicion1.fechaHora)
            })
        }
        this.mediciones = posSet;
        console.log(posSet);
        //this.mediciones = mediciones.sort( a=> {});

        //pintar los elementos por mediciones

        if (this.mediciones != null) {

            /*let max = this.getMaximoValor(this.puntos)
                  console.log(max);
      
                  var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                  }).addTo(this.map);
                  this.idw = L.idwLayer(this.puntos ,{
                          opacity: 0.5,
                          maxZoom: 18,
                          cellSize: 3,
                          exp: 3,
                          max: max
                      }).addTo(this.map);
      
                  this.cargarDatos();*/
            
            this.mediciones = posSet;
            for (let i = 0; i < posSet.length; i++) {
            this.crearMarkers(posSet[i])
                
            }
            this.cargarDatos();

        }
    },

    crearArrayPuntos: async function (lista) {
        this.puntos = []
        
        console.log("lista", lista);

        for (let i = 0; i < lista.length; i++) {
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
        }
    },

    crearMarkers: function(lista) {
            let circle = L.circle([lista.pos.latitud, lista.pos.longitud], {
                color: this.getColorCirculo(lista.valor[0].valor),
                fillColor: this.getColorCirculo(lista.valor[0].valor),
                fillOpacity: 0.5,
                radius: 20
            }).addTo(this.map);
            this.circulos.push(circle); 
    },

    getGas: function(valor) {
        if(valor == 1) {
            return "brown"
        } else if(valor == 2) {
            return "orange"
        } else if(valor == 3) {
            return "black"
        } else {
            return "grey"
        }
    },

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

    getMaximoValor: function (lista) {
        let maximo = 0;
        lista.forEach((dato) => {
            if (dato[2] > maximo) {
                maximo = dato[2];
            }
        });

        return maximo;
    },

    pintarMapa: function (mediciones) {

            this.crearMarkers(mediciones);
            this.cargarDatos();
    },

    iniciarLoader: function () {
        document.getElementById("loader").style.display = "block";
        document.getElementById("map").style.display = "none";
    },
    cargarDatos: function () {
        document.getElementById("loader").style.display = "none";
        document.getElementById("map").style.display = "block";
    },
}; // vista

var ControladorMediciones = {
    vista: VistaMediciones,
    mediciones: [],
    todosLosGases: false,

    // inicia la obtencion de todas las mediciones
    iniciarTodasObtenerMediciones: async function (ipPuerto) {
        this.vista.controlador = this;

        try {
            this.mediciones = await LogicaFalsa.obtenerTodasMediciones(ipPuerto);

            this.vista.map = L.map("map").setView([38.995591, -0.167129], 12);
            var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(this.vista.map);

            this.vista.representarTodasLasMediciones(this.mediciones);
        } catch (e) {
            console.error(e);
        }
    },

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

    filtrarPorGas: function (tipoGas) {
        this.vista.iniciarLoader();
        //this.vista.mediciones = []

        let botones = document.getElementsByClassName("botonDeGases");
        let botonActual;

        for (let i = 0; i < botones.length; i++) {
            if (botones[i].value == tipoGas) {
                botonActual = botones[i]
            }
        }

        if (botonActual.classList.contains("botonActivo") && document.getElementsByClassName("botonActivo").length != botones.length) {
            this.todosGasesActivos(botones)
            for (let i = 0; i < this.vista.circulos.length; i++) {
                this.vista.map.removeLayer(this.vista.circulos[i])
            }
        this.vista.representarTodasLasMediciones(this.mediciones)
            return;
        } else {
            this.todosGasesInactivos(botones);
            for (let i = 0; i < 4; i++) {
                if (botones[i].value == tipoGas) {
                    botones[i].classList.remove("botonInactivo");
                    botones[i].classList.add("botonActivo");
                }
            }
        }

        for (let i = 0; i < this.vista.circulos.length; i++) {
            this.vista.map.removeLayer(this.vista.circulos[i])
        }

        let medicionesFiltradas = this.mediciones.filter(element => {
            return element.tipoGas == tipoGas;
        })
        this.vista.representarTodasLasMediciones(medicionesFiltradas)
        //this.vista.pintarMapa(medicionesFiltradas);
    },

    todosGasesActivos: function(botones) {
        
        for (let i = 0; i < botones.length; i++) {
            if(botones[i].classList.contains("botonInactivo")) {
                botones[i].classList.remove("botonInactivo");
                botones[i].classList.add("botonActivo");
            }   
        }
    },

    todosGasesInactivos: function(botones) {
        for (let i = 0; i < botones.length; i++) {
            if(botones[i].classList.contains("botonActivo")) {
                botones[i].classList.add("botonInactivo");
                botones[i].classList.remove("botonActivo");
            }   
        }
    }
}; // controlador
