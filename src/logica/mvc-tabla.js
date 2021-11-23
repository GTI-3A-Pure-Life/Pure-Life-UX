var ModeloTabla = {
    datos: {},

};

var VistaTabla = {
    tabla: document.getElementById("tblDatos").getElementsByTagName("tbody")[0],

    rellenarTabla: function(datos) {
        for(let i = 0; i < datos.length; i++) {
            if(!datos[i].leido) {
                this.tabla.innerHTML += "<tr>" + 
                "<td>" + (i+1) + "</td>" + 
                "<td>" + datos[i].uuidSensor + "</td>" + 
                "<td>" + datos[i].averiado + "</td>" + 
                "<td>" + datos[i].pocaBateria + "</td>" + 
                "<td>" + datos[i].descalibrado + "</td>" + 
                "<td>" + datos[i].fechaHora + "</td>" + 
                "<td><button>Marcar como leído</button></td></tr>";
            } else {
                this.tabla.innerHTML += "<tr>" + 
                "<td>" + (i+1) + "</td>" + 
                "<td>" + datos[i].uuidSensor + "</td>" + 
                "<td>" + datos[i].averiado + "</td>" + 
                "<td>" + datos[i].pocaBateria + "</td>" + 
                "<td>" + datos[i].descalibrado + "</td>" + 
                "<td>" + datos[i].fechaHora + "</td>" + 
                "<td><button disabled>Marcar como leído</button></td></tr>";
            }
        }
    },
}

var ControladorTabla = {
    modelo: ModeloTabla,
    vista: VistaTabla,
    iniciarTabla: async function() {
        try {
            this.modelo.datos = await LogicaFalsa.obetenerRegistros();
            this.modelo.datos = this.ordenarTablaPorLeidos(this.modelo.datos)
            console.log(this.modelo.datos);
            this.vista.rellenarTabla(this.modelo.datos);
        } catch(err) {
            console.log(err);
        }
    },
    ordenarTablaPorLeidos: function(datos) {
        return datos.sort(function(a, b) {
            if (a.leido > b.leido) {
                return 1;
            }
            if(a.leido < b.leido) {
                return -1;
            }
            return 0;
        });
    }
}

