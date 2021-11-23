//======================================================================================================
// .....................................................................
// MVC-estadisticasCalidadDelAire.js
// Juan Ferrera Sala 16/11/2021
// .....................................................................
//======================================================================================================
var VistaCalidadDelAire = {

    controlador: {},

    idBarSO3: {},
    idBarO3: {},
    idBarNO2: {},
    idBarSO3: {},

    idGraficaCO: {},
    idGraficaO3: {},
    idGraficaNO2: {},
    idGraficaSO3: {},
    
    idChartCO: {},
    idChartO3: {},
    idChartNO2: {},
    idChartSO3: {},

    preparar: function (barCO, barO3, barNO2, barSO3, graficaCO, graficaO3, graficaNO2, graficaSO3,chartCO,chartO3,chartNO2,chartSO3) {

        this.idBarCO = document.getElementById(barCO);
        this.idBarO3 = document.getElementById(barO3);
        this.idBarNO2 = document.getElementById(barNO2);
        this.idBarSO3 = document.getElementById(barSO3);

        this.idGraficaCO = document.getElementById(graficaCO);
        this.idGraficaO3 = document.getElementById(graficaO3);
        this.idGraficaNO2 = document.getElementById(graficaNO2);
        this.idGraficaSO3 = document.getElementById(graficaSO3);

        this.idChartCO = document.getElementById(chartCO);
        this.idChartO3 = document.getElementById(chartO3);
        this.idChartNO2 = document.getElementById(chartNO2);
        this.idChartSO3 = document.getElementById(chartSO3);

    },

    ocultarGraficas: function () {
        this.idGraficaCO.style.display = "none";
        this.idGraficaO3.style.display = "none";
        this.idGraficaNO2.style.display = "none";
        this.idGraficaSO3.style.display = "none";
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
            case this.idGraficaSO3:
                if (this.idGraficaSO3.style.display == "none") {
                    this.idGraficaSO3.style.display = "block";
                } else {
                    this.idGraficaSO3.style.display = "none";
                }
                break;

            default:
                break;
        }
    },

    // metodo representar graficas 4 arrays
    representarGraficas: function(listaCo,listaO3,listaNO2,lisitaSO3){
        this.cargarDatosEnGrafica(this.idChartCO,listaCo)
        this.cargarDatosEnGrafica(this.idChartO3,listaO3)
        this.cargarDatosEnGrafica(this.idChartNO2,listaNO2)
        this.cargarDatosEnGrafica(this.idChartSO3,lisitaSO3)
    },
    // metodo idHtml grafic 

    cargarDatosEnGrafica: function (idGrafica, datos) {
        let valores = new Array();
        let tiempo = new Array();
        datos.forEach(m => {
            valores.push(m.valor)
            tiempo.push(m.fechaHora)
        });
        console.log(valores);
        console.log(tiempo);
        const ctx = idGrafica.getContext('2d');

        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: tiempo,
                datasets: [{
                    label: 'ug/m3',
                    data: valores,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 3,
                    tension: 0.2,
                    pointRadius: 0
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    },
                }
            }
        });
    },


}// vista

var ControladorVistaCalidadDelAire = {

    vista: VistaCalidadDelAire,

    // inicia las barras
    iniciarLasBarras: async function () {

        //=================================================================================================
        // llamar a la logica obtenerMedicionesDeHastaPorUsuario
        //=================================================================================================
        let calidadAireTiempoZona = await LogicaFalsa.obtenerCalidadAirePorTiempoYZona("2021-11-23 00:00:00","2021-11-23 23:59:00","38.995591","-0.167129","18");

    
        //=================================================================================================
        // llamar a la logica obtenerMedicionesDeHastaPorUsuario
        //=================================================================================================
        let user = JSON.parse(localStorage.getItem("sesion"))
        var date = new Date();
        var strRes = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        let fechaInicio = strRes + " 00:00:00";
        let fechaFin = strRes + " 23:59:59";
        let mediciones = await LogicaFalsa.obtenerMedicionesDeHastaPorUsuario(fechaInicio, fechaFin,user.id);
        console.log(mediciones)
        let medicionesCO = new Array();
        let medicionesO3 = new Array();
        let medicionesNO2 = new Array();
        let medicionesSO2 = new Array();

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

        medicionesCO = medicionesCO.sort(this.orednarPorFecha);
        medicionesO3 = medicionesO3.sort(this.orednarPorFecha);
        medicionesNO2 = medicionesNO2.sort(this.orednarPorFecha);
        medicionesSO2 = medicionesSO2.sort(this.orednarPorFecha);

        this.vista.ocultarGraficas();
        this.vista.representarGraficas(medicionesCO,medicionesO3,medicionesNO2,medicionesSO2);

        //===============================================================================================
        //obtenerMedicionesDeHastaPorUsuario
        //===============================================================================================
        let calidadAireAQUI = await LogicaFalsa.obtenerCalidadAirePorTiempoYUsuario(fechaInicio, fechaFin,user.id);

        console.log("Hola mira que bien me va sola",calidadAireAQUI)

        
        
        let elemCO = this.vista.idBarCO;
        elemCO.value = calidadAireAQUI[0].valor;
        this.asignarColor(elemCO, calidadAireAQUI[0].valor);
        let elemO3 = this.vista.idBarO3;
        elemO3.value = calidadAireAQUI[3].valor;
        this.asignarColor(elemO3, calidadAireAQUI[3].valor);
        let elemNO2 = this.vista.idBarNO2;
        elemNO2.value = calidadAireAQUI[2].valor;
        this.asignarColor(elemNO2, calidadAireAQUI[2].valor);
        let elemSO3 = this.vista.idBarSO3;
        elemSO3.value = calidadAireAQUI[1].valor;
        this.asignarColor(elemSO3, calidadAireAQUI[1].valor);

    },
    asignarColor(barra, valor) {
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

    }


}// controlador 