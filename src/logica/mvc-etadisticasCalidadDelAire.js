//======================================================================================================
// .....................................................................
// MVC-estadisticasCalidadDelAire.js
// Juan Ferrera Sala 16/11/2021
// .....................................................................
//======================================================================================================
var VistaCalidadDelAire = {

    controlador:{},
    idBarSO3:{},
    idBarO3:{},
    idBarNO2:{},
    idBarSO3:{},
    idGraficaCO:{},
    idGraficaO3:{},
    idGraficaNO2:{},
    idGraficaSO3:{},

    preparar: function(barCO,barO3,barNO2,barSO3,graficaCO, graficaO3, graficaNO2, graficaSO3){

        this.idBarCO = document.getElementById(barCO);
        this.idBarO3 = document.getElementById(barO3);
        this.idBarNO2 = document.getElementById(barNO2);
        this.idBarSO3 = document.getElementById(barSO3);
        
        this.idGraficaCO = document.getElementById(graficaCO);
        this.idGraficaO3 = document.getElementById(graficaO3);
        this.idGraficaNO2 = document.getElementById(graficaNO2);
        this.idGraficaSO3 = document.getElementById(graficaSO3);
        
    },

    ocultarGraficas: function(){
        this.idGraficaCO.style.display = "none";
        this.idGraficaO3.style.display = "none";
        this.idGraficaNO2.style.display = "none";
        this.idGraficaSO3.style.display = "none";
    }, 

    toggleGrafica: function(idGrafica) {
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
    }

}// vista

var ControladorVistaCalidadDelAire = {

    vista: VistaCalidadDelAire,

    // inicia las barras
    iniciarLasBarras: function(){
        
        let elemCO = this.vista.idBarCO;
        elemCO.value = 100;
        let elemO3 = this.vista.idBarO3;
        elemO3.value = 50;
        let elemNO2 = this.vista.idBarNO2;
        elemNO2.value = 70;
        let elemSO3 = this.vista.idBarSO3;
        elemSO3.value = 20;

        this.vista.ocultarGraficas();

    },

}// controlador 