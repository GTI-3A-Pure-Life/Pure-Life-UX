var ModeloTabla = {
    datos: {},

};

var VistaTabla = {
    tabla: document.getElementById("tblDatos").getElementsByTagName("tbody")[0],

    rellenarTabla: function(datos) {
        this.tabla.innerHTML = "<tr><th>ID</th><th>Sensor</th><th>Averiado</th><th>Poca batería</th><th>Descalibrado</th><th>Fecha</th><th>Leído</th></tr>";
        for(let i = 0; i < datos.length; i++) {

            if(!datos[i].leido) {
                console.log(datos[i])
                this.tabla.innerHTML += "<tr>" + 
                "<td>" + datos[i].id + "</td>" + 
                "<td>" + datos[i].uuidSensor + "</td>" + 
                "<td>" + datos[i].averiado + "</td>" + 
                "<td>" + datos[i].pocaBateria + "</td>" + 
                "<td>" + datos[i].descalibrado + "</td>" + 
                "<td>" + datos[i].fechaHora + "</td>" + 
                "<td><button onclick='ControladorTabla.publicarLeido("+ datos[i].id +")'>Marcar como leído</button></td></tr>";
            } else {
                this.tabla.innerHTML += "<tr>" + 
                "<td>" + datos[i].id + "</td>" + 
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
            this.modelo.datos = await LogicaFalsa.obtenerRegistros();
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
    },
    publicarLeido: async function(id){
        try {
            await LogicaFalsa.actualizar_leido(id);
            this.iniciarTabla();
        } catch (error) {
            console.log(error);
        }
    }
}

