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
        this.mediciones = this.controlador.toArray(mediciones);
        this.mediciones.forEach((medicion) => {
            switch (medicion[3]) {
                case 1:
                    puntosCO.push([medicion[0], medicion[1], medicion[2], medicion[3]]);
                    break;
                case 2:
                    puntosNO2.push([medicion[0], medicion[1], medicion[2], medicion[3]]);
                    break;
                case 3:
                    puntosSO2.push([medicion[0], medicion[1], medicion[2], medicion[3]]);
                    break;
                case 4:
                    puntosO3.push([medicion[0], medicion[1], medicion[2], medicion[3]]);
                    break;

                default:
                    break;
            }
        });

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
            this.map = L.map("map").setView([38.995591, -0.167129], 12);
            var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(this.map);
            
            this.crearArrayPuntos(this.mediciones);
            this.crearMarkers(this.puntos)
            this.cargarDatos();

        }
    },

    crearArrayPuntos: async function (lista) {
        this.puntos = []
        
        for (let i = 0; i < document.getElementsByClassName("botonDeGases").length; i++) {
            if (document.getElementsByClassName("botonDeGases")[i].classList.contains("botonActivo")) {
                if(document.getElementsByClassName("botonDeGases")[i].value == 1) {
                    this.puntos = this.puntos.concat(puntosCO);
                }
                if(document.getElementsByClassName("botonDeGases")[i].value == 2) {
                    this.puntos = this.puntos.concat(puntosNO2);
                }
                if(document.getElementsByClassName("botonDeGases")[i].value == 3) {
                    this.puntos = this.puntos.concat(puntosSO2);
                }
                if(document.getElementsByClassName("botonDeGases")[i].value == 4) {
                    this.puntos = this.puntos.concat(puntosO3);
                 }
            }
        }
    },

    crearMarkers: function(lista) {
        
        let gases = document.getElementsByClassName("botonActivo").length;
        let lista1 = lista
        for (let i = 0; i < gases; i++) {
            let listaProv = []
            let gas = 0;
            for (let j = 0; j < lista1.length; j++) {
                if(gases != 1) {
                    if (lista1.length != gases) {
                        if(lista1[j] != undefined && lista1[j][3] != gas) {
                        
                            listaProv.push(lista1[j]);
                            lista1.splice(lista1.indexOf(lista1[j]), 1);
                            gas = lista1[j][3];
                        }
                    } else {
                        listaProv = lista1;
                        break;
                    }
                }
                else {
                    listaProv = lista1;
                }
            }
            if(gases != 1) {
                let maximo = 0;
            let elementoMaximo;
            listaProv.forEach(element => {
                if (element[2] > maximo) {
                    elementoMaximo = element;
                    maximo = element[2];
                }
            });
            let circle = L.circle([elementoMaximo[0], elementoMaximo[1]], {
                color: this.getColorCirculo(elementoMaximo[2]),
                fillColor: this.getGas(elementoMaximo[3]),
                fillOpacity: 0.5,
                radius: 5000
            }).addTo(this.map);
            this.circulos.push(circle); 
            }
            else {
                listaProv.forEach(element => {
                let circle = L.circle([element[0], element[1]], {
                    color: this.getColorCirculo(element[2]),
                    fillColor: this.getGas(element[3]),
                    fillOpacity: 0.5,
                    radius: 5000
                }).addTo(this.map);
                this.circulos.push(circle); 
                });
            }
        }
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

    pintarMapa: function () {

            this.crearArrayPuntos(this.mediciones);
            this.crearMarkers(this.puntos)
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
        this.vista.mediciones = []

        let botones = document.getElementsByClassName("botonDeGases");
        let botonActual;

        for (let i = 0; i < botones.length; i++) {
            if (botones[i].value == tipoGas) {
                botonActual = botones[i]
            }
        }

        if (botonActual.classList.contains("botonActivo") && document.getElementsByClassName("botonActivo").length != botones.length) {
            this.todosGasesActivos(botones)
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
        this.vista.pintarMapa();
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
