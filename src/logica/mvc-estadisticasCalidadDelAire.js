//======================================================================================================
// .....................................................................
// MVC-estadisticasCalidadDelAire.js
// Juan Ferrera Sala 16/11/2021
// .....................................................................
//======================================================================================================
var VistaCalidadDelAire = {

    controlador: {},

    idBarSO2: {},
    idBarO3: {},
    idBarNO2: {},
    idBarSO2: {},

    idGraficaCO: {},
    idGraficaO3: {},
    idGraficaNO2: {},
    idGraficaSO2: {},
    
    idChartCO: {},
    idChartO3: {},
    idChartNO2: {},
    idChartSO2: {},

    preparar: function (barCO, barO3, barNO2, barSO2, 
        graficaCO, graficaO3, graficaNO2, graficaSO2, 
        chartCO, chartO3, chartNO2, chartSO2) {

        this.idBarCO = document.getElementById(barCO);
        this.idBarO3 = document.getElementById(barO3);
        this.idBarNO2 = document.getElementById(barNO2);
        this.idBarSO2 = document.getElementById(barSO2);

        this.idGraficaCO = document.getElementById(graficaCO);
        this.idGraficaO3 = document.getElementById(graficaO3);
        this.idGraficaNO2 = document.getElementById(graficaNO2);
        this.idGraficaSO2 = document.getElementById(graficaSO2);

        this.idChartCO = document.getElementById(chartCO);
        this.idChartO3 = document.getElementById(chartO3);
        this.idChartNO2 = document.getElementById(chartNO2);
        this.idChartSO2 = document.getElementById(chartSO2);

    },

    ocultarGraficas: function () {
        this.idGraficaCO.style.display = "none";
        this.idGraficaO3.style.display = "none";
        this.idGraficaNO2.style.display = "none";
        this.idGraficaSO2.style.display = "none";
    },

    toggleGrafica: function (idGrafica) {
        let grafica = document.getElementById(idGrafica);

        switch (grafica) {
            case this.idGraficaCO:
                if (this.idGraficaCO.style.display == "none") {
                    this.idGraficaCO.style.display = "block";
                } else {
                    this.idGraficaCO.style.display = "none";
                }
                break;
            case this.idGraficaO3:
                if (this.idGraficaO3.style.display == "none") {
                    this.idGraficaO3.style.display = "block";
                } else {
                    this.idGraficaO3.style.display = "none";
                }
                break;
            case this.idGraficaNO2:
                if (this.idGraficaNO2.style.display == "none") {
                    this.idGraficaNO2.style.display = "block";
                } else {
                    this.idGraficaNO2.style.display = "none";
                }
                break;
            case this.idGraficaSO2:
                if (this.idGraficaSO2.style.display == "none") {
                    this.idGraficaSO2.style.display = "block";
                } else {
                    this.idGraficaSO2.style.display = "none";
                }
                break;

            default:
                break;
        }
    },

    // metodo representar graficas 4 arrays
    representarGraficas: function(listaCO,listaO3,listaNO2,listaSO2){
        this.cargarDatosEnGrafica(this.idChartCO,listaCO)
        this.cargarDatosEnGrafica(this.idChartO3,listaO3)
        this.cargarDatosEnGrafica(this.idChartNO2,listaNO2)
        this.cargarDatosEnGrafica(this.idChartSO2,listaSO2)
    },
    // metodo idHtml grafic 

    cargarDatosEnGrafica: function (idGrafica, datos) {
        let valores = new Array();
        let tiempo = new Array();
        let colors = new Array();
        datos.forEach(m => {
            valores.push(m.valor)
            colors.push(this.obtenerColorHexPorValor(m.valor))
            let horaStr = m.fecha.getHours()>=10 ? m.fecha.getHours() : "0"+m.fecha.getHours();
            fecha = " "+horaStr+":00    ";
            tiempo.push(fecha)
        });

        const ctx = idGrafica.getContext('2d');
        // lineas limite de peligro
        const annotation = {
            annotations: {
              line1: {
                type: 'line',
                yMin: 50,
                yMax: 50,
                borderColor: this.obtenerColorHexPorValor(150),
                borderWidth: 2,
                borderDash: [5],
              },
              line2: {
                type: 'line',
                yMin: 150,
                yMax: 150,
                borderColor: this.obtenerColorHexPorValor(200),
                borderWidth: 2,
                borderDash: [5],
              },
              line3: {
                type: 'line',
                yMin: 200,
                yMax: 200,
                borderColor: this.obtenerColorHexPorValor(300),
                borderWidth: 2,
                borderDash: [5],
              }
            }
          };
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: tiempo,
                datasets: [{
                    label: 'AQI',
                    data: valores,
                    backgroundColor: colors,
                    borderWidth: 1,
                    pointRadius: 0
                }]
            },
            options: {
                scales: {
                    y: {
                        suggestedMax: 300,
                        beginAtZero: true
                    },
                },
                plugins: {
                    legend: {
                      display: false
                    },
                    annotation
                  }
            }
        });
    },


    obtenerColorHexPorValor: function(valor) {
        if(valor >= 0 && valor <= 50) {
            return '#3ABB90'
        } else if(valor > 50 && valor <= 150) {
            return '#ffc300'
        } else if(valor > 150 && valor <= 200) {
            return '#e43939'
        } else {
            return '#86003b'
        }
    }

}// vista

var ControladorVistaCalidadDelAire = {

    vista: VistaCalidadDelAire,

    // inicia las barras
    iniciarLasBarras: async function () {

        //=================================================================================================
        // llamar a la logica obtenerMedicionesDeHastaPorUsuario
        //=================================================================================================

        let user = JSON.parse(localStorage.getItem("sesion"))
        var date = new Date();
        var strRes = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        let fechaInicio = strRes + " 00:00:00";
        let fechaFin = strRes + " 23:59:59";

        fechaInicio = "2021-11-26 00:00:00"
        fechaFin = "2021-11-26 23:59:59"

        let mediciones = await LogicaFalsa.obtenerMedicionesDeHastaPorUsuario(fechaInicio, fechaFin,13/*user.id*/);
        let medicionesCO = new Array();
        let medicionesSO2 = new Array();
        let medicionesNO2 = new Array();
        let medicionesO3 = new Array();

       
        

        for(let i = 0; i< mediciones.length; i++){
            switch (mediciones[i].tipoGas) {
                case 1:
                        medicionesCO.push(mediciones[i]);
                    break;
                case 2:
                        medicionesNO2.push(mediciones[i]);
                    break;
                case 3:
                        medicionesSO2.push(mediciones[i]);
                    break;
                case 4:
                     medicionesO3.push(mediciones[i]);
                    break;
                default:
                    break;
            }
        }
        
        
        medicionesCO = this.transformarMedicionesAArrayMedicionesPorHora24Horas(medicionesCO)
        medicionesNO2 = this.transformarMedicionesAArrayMedicionesPorHora24Horas(medicionesNO2)
        medicionesO3 = this.transformarMedicionesAArrayMedicionesPorHora24Horas(medicionesO3)
        medicionesSO2 = this.transformarMedicionesAArrayMedicionesPorHora24Horas(medicionesSO2)
       
        this.vista.ocultarGraficas();
        this.vista.representarGraficas(medicionesCO,medicionesSO2,medicionesNO2,medicionesSO2);

        //===============================================================================================
        //obtenerCalidadAirePorTiempoYUsuario
        //===============================================================================================

        let calidadAireAQI = await LogicaFalsa.obtenerCalidadAirePorTiempoYUsuario(fechaInicio, fechaFin,13/*user.id*/);
        let elemCO = this.vista.idBarCO;
        elemCO.value = calidadAireAQI[0].valor;
        this.asignarColorBarras(elemCO, calidadAireAQI[0].valor);
        let elemNO2 = this.vista.idBarNO2;
        elemNO2.value = calidadAireAQI[1].valor;
        this.asignarColorBarras(elemNO2, calidadAireAQI[1].valor);
        let elemSO2 = this.vista.idBarSO2;
        elemSO2.value = calidadAireAQI[2].valor;
        this.asignarColorBarras(elemSO2, calidadAireAQI[2].valor);
        let elemO3 = this.vista.idBarO3;
        elemO3.value = calidadAireAQI[3].valor;
        this.asignarColorBarras(elemO3, calidadAireAQI[3].valor);

        let textosAQI = document.getElementsByClassName("myProgress")[0].getElementsByTagName("span");

        textosAQI[0].innerText = "AQI " + elemCO.value;
        textosAQI[1].innerText = "AQI " + elemO3.value;
        textosAQI[2].innerText = "AQI " + elemNO2.value;
        textosAQI[3].innerText = "AQI " + elemSO2.value;

        //=================================================================================================
        // llamar a la logica obtenerMedicionesDeHastaPorUsuario
        //=================================================================================================
        let tarjetas = document.getElementsByClassName("contenedorTarjetas");
       
        if(user.posCasa != null) {
            
        let calidadAireCasa = await LogicaFalsa.obtenerCalidadAirePorTiempoYZona(fechaInicio,fechaFin,user.posCasa.latitud,user.posCasa.longitud,"18");
        this.asignarColorTarjetas(tarjetas[0], this.getMaximoAQI(calidadAireCasa))
        }else{
            tarjetas[0].getElementsByTagName("p")[0].innerText = "No tienes asignada la ubicación de tu casa";
            tarjetas[0].getElementsByTagName("p")[1].style.display = "none";
        }
        if(user.posTrabajo   != null) {
        let calidadAireTrabajo = await LogicaFalsa.obtenerCalidadAirePorTiempoYZona(fechaInicio,fechaFin,user.posTrabajo.latitud,user.posTrabajo.longitud,"18");
        this.asignarColorTarjetas(tarjetas[1], this.getMaximoAQI(calidadAireTrabajo))
        }else{
            tarjetas[1].getElementsByTagName("p")[0].innerText = "No tienes asignada la ubicación de tu trabajo";
            tarjetas[1].getElementsByTagName("p")[1].style.display = "none";
        }
        let calidadAireExterior = this.getMaximoAQI(calidadAireAQI);
        this.asignarColorTarjetas(tarjetas[2], calidadAireExterior)
        this.resumenCalidadAire(calidadAireExterior);
    },

    asignarColorBarras: function(barra, valor) {
        if(valor >= 0 && valor <= 50) {
            barra.classList.add("verde");
        } else if(valor > 50 && valor <= 150) {
            barra.classList.add("amarillo");
        } else if(valor > 150 && valor <= 200) {
            barra.classList.add("rojo");
        } else {
            barra.classList.add("morado");
        }
    },

    resumenCalidadAire: function(valor) {
        let resumen = document.getElementById("calidadMediaHoyApp");
        if(valor >= 0 && valor <= 50) {
            resumen.innerText = "Buena"
        } else if(valor > 50 && valor <= 150) {
            resumen.innerText = " Moderada";
        } else if(valor > 150 && valor <= 200) {
            resumen.innerText = " Mala";
        } else {
            resumen.innerText = " Muy mala";
        }
    },

    getMaximoAQI: function(lista) {
        let maximo = 0;
        lista.forEach( gas=> {
            if(gas.valor > maximo) {
                maximo = gas.valor;
            }
        });
        return maximo;
    },

    asignarColorTarjetas: function(tarjeta, valor) {
        if(valor >= 0 && valor <= 50) {
            tarjeta.getElementsByTagName("img")[0].classList.add("fondoDeTarjetaVerde");
            tarjeta.getElementsByTagName("p")[0].innerText += " Buena";
        } else if(valor > 50 && valor <= 150) {
            tarjeta.getElementsByTagName("img")[0].classList.add("fondoDeTarjetaAmarillo");
            tarjeta.getElementsByTagName("p")[0].innerText += " Moderada";
        } else if(valor > 150 && valor <= 200) {
            tarjeta.getElementsByTagName("img")[0].classList.add("fondoDeTarjetaRojo");
            tarjeta.getElementsByTagName("p")[0].innerText += " Mala";
        } else {
            tarjeta.getElementsByTagName("img")[0].classList.add("fondoDeTarjetaMorado");
            tarjeta.getElementsByTagName("p")[0].innerText += " Muy mala";
        }
        tarjeta.getElementsByTagName("p")[1].innerText += " " + valor;
    },

    ordenarPorFecha: function(medicion1,medicion2){

        let fecha1 = new Date(medicion1.fechaHora);

        let fecha2 = new Date(medicion2.fechaHora);
        if (fecha1 > fecha2) {
            return 1;
          }
          if (fecha1< fecha2) {
            return -1;
          }
          // a must be equal to b
          return 0;

    },

    transformarMedicionesAArrayMedicionesPorHora24Horas: function(mediciones) {
        let horas = 24;
        let mediciones24Horas = new Array();
        let dateHoy = new Date(Date.now());
        fechaHoy = dateHoy.getFullYear()+"-"+dateHoy.getMonth()+"-"+dateHoy.getDate();
        fechaHoy = "2021-11-16";//TODO quitar
        // inicializar array
        for(let i = 0; i<horas; i++){
            let fecha = fechaHoy;
            // multiplo de 60, solo hora
            let horaStr = i>=10 ? i : "0"+i;
            fecha += " "+horaStr+":00:00";
            mediciones24Horas.push({fecha:new Date(fecha),valor:0});
        }

        console.log("mediciones 24 hora", mediciones24Horas)
        // poner los valores en cada uno de los minutos correspondientes, si hay varios en el mismo
        // media aritmetica

        let anteriorHora = -1;
        let contadorMedicionesMismaHora = 1;
        let media = 1;
        
        mediciones.forEach(m=>{
            let hora = new Date(m.fechaHora).getHours();
            console.log("hora",new Date(m.fechaHora).getHours())
            console.log("FECHA24", "----------------------------------------------");
            console.log("FECHA24", "transformarMedicionesAArrayMedicionesPorMinuto24Horas: indice: "+hora);
            console.log("FECHA24", "transformarMedicionesAArrayMedicionesPorMinuto24Horas: valor: "+m.valor);

            if(anteriorHora != hora){
                anteriorHora = hora;
                contadorMedicionesMismaHora = 1;
                media = m.valor;
                mediciones24Horas[hora].valor = m.valor;

            }
            else{

                let valorAnterior = mediciones24Horas[hora].valor;
                console.log("FECHA24", "transformarMedicionesAArrayMedicionesPorMinuto24Horas: valor anterior: "+valorAnterior+"");

                console.log("FECHA24", "transformarMedicionesAArrayMedicionesPorMinuto24Horas: media anterior: "+media+"");
                console.log("FECHA24", "transformarMedicionesAArrayMedicionesPorMinuto24Horas: hay : "+contadorMedicionesMismaHora+" mediciones");
                contadorMedicionesMismaHora++;
                let nuevaMedia = (contadorMedicionesMismaHora*media - valorAnterior + m.valor)/ contadorMedicionesMismaHora;
                console.log("FECHA24", "transformarMedicionesAArrayMedicionesPorMinuto24Horas: nueva media: "+nuevaMedia+"");

                media = nuevaMedia;
                mediciones24Horas[hora].valor = (nuevaMedia);

            }
        })

        /*console.log("GRAFICA", "transformarMedicionesAArrayMedicionesPorHora24Horas------------------------------");

        for(let m  in  mediciones24Horas){
            console.log("GRAFICA", "Fecha: "+mediciones24Horas[m].fecha+ " - valor: "+mediciones24Horas[m].valor);
        }
        console.log("GRAFICA", "transformarMedicionesAArrayMedicionesPorHora24Horas------------------------------");*/

        return mediciones24Horas;
    }



}// controlador 