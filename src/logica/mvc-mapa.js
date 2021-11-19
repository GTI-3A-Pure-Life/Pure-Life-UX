// .....................................................................
// MVC-mapa.js
// Juan Ferrera Sala 16/11/2021
// .....................................................................

//======================================================================================================
var VistaMapa = {

    controlador:{},
    bloqueMapa:{},
    idMapa:{},

    preparar: function(idContenedor){

        this.bloqueMapa = document.getElementById(idContenedor);
        this.idMapa = idContenedor;
        

    },

    //-----------------------------------------
    // FIN Vista mapa
    //----------------------------------------

    /**
     * Funcion que muestra un snack bar de error durante unos pocos segundos
     * @param {Texto} mensaje a mostrar 
     
     representarError:function(mensaje){
        
        this.snackBarError.innerHTML = mensaje;
        this.snackBarError.className = "show";
        
        setTimeout(()=>{ this.snackBarError.classList.remove("show"); }, 3000);
    },
    */

}// vista

var ControladorMapas = {

    vista: VistaMapa,

    // inicia el mapa
    iniciarMapa: async function(){

        this.vista.bloqueMapa = L.map(this.vista.idMapa).setView([39.0, -0.2], 13); 

        try{

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
        }).addTo(this.vista.bloqueMapa);

       }catch(e){
            console.error(e);
        
       }

    }

}// controlador 

