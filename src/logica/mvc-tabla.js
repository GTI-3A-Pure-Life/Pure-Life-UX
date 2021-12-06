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
                "<td class = 'nombreSensor'>" + datos[i].uuidSensor + "</td>" + 
                "<td class = 'Averiado'>" + datos[i].averiado + "</td>" + 
                "<td>" + datos[i].pocaBateria + "</td>" + 
                "<td class = 'Descalibrado'>" + datos[i].descalibrado + "</td>" + 
                "<td class = 'Fecha'>" + datos[i].fechaHora + "</td>" + 
                "<td><button onclick='ControladorTabla.publicarLeido("+ datos[i].id +")'>Marcar como leído</button></td></tr>";
            } else {
                this.tabla.innerHTML += "<tr>" + 
                "<td>" + datos[i].id + "</td>" + 
                "<td>" + datos[i].uuidSensor + "</td>" + 
                "<td class = 'Averiado'>" + datos[i].averiado + "</td>" + 
                "<td>" + datos[i].pocaBateria + "</td>" + 
                "<td class = 'Descalibrado'>" + datos[i].descalibrado + "</td>" + 
                "<td class = 'Fecha'>" + datos[i].fechaHora + "</td>" + 
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

function createPDFAveriados() {
    var tabla = document.getElementById('tblDatos');
    let tablaM ="<table><tbody>";
    var sensores = tabla.getElementsByClassName("nombreSensor")
    var estado = tabla.getElementsByClassName("Averiado");
    var fecha = tabla.getElementsByClassName("Fecha");
    let ultimoSensor = "";

      for (let i = 0; i < tabla.rows.length; i++) {
        tablaM += "<tr>";
        
        if (i==0) {
            tablaM += "<th>" + tabla.rows[i].cells[1].innerHTML + "</th>" + 
            "<th>" + tabla.rows[i].cells[5].innerHTML + "</th>";
        } else {
            
            averiado = estado[i-1]
            fechaDeUno = fecha[i-1]
            sensorActual = sensores[i - 1].innerText;
            if(averiado != undefined && averiado.innerHTML=="1"){
                let fechaDate = new Date(fechaDeUno.innerText)
                let horas = (Date.now() - fechaDate.getTime())/1000/60/24
                if( i> 0 && horas>=24 && ultimoSensor != sensorActual){
                    ultimoSensor = sensorActual;
                    console.log("la i", i)

                    tablaM += "<td>" + tabla.rows[i].cells[1].innerText + "</td>" + 
                    "<td>" + tabla.rows[i].cells[5].innerText + "</td>";
                }
            } else if(averiado.innerHTML =="0") {
                ultimoSensor = sensorActual;
            }
        }
        tablaM += "</tr>";
      }
      tablaM += "</tbody></table>";

    var style = "<style>";
    style = style + "table {width: 100%;font: 17px Calibri;}";
    style = style + "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
    style = style + "padding: 2px 3px;text-align: center;}";
    style = style + "</style>";

    // CREATE A WINDOW OBJECT.
    var win = window.open('', '', 'height=700,width=700');

    win.document.write('<html><head>');
    win.document.write(style);          // ADD STYLE INSIDE THE HEAD TAG.
    win.document.write('</head><body>');
    win.document.write('<h1>Sensores averiados de más de 24 horas</h1>');
    win.document.write(tablaM);       // THE TABLE CONTENTS INSIDE THE BODY TAG.
    win.document.write('</body></html>');

    win.document.close(); 	// CLOSE THE CURRENT WINDOW.

    win.print();    // PRINT THE CONTENTS.
}


function createPDFDescalibrados() {
    var tabla = document.getElementById('tblDatos');
    let tablaM ="<table><tbody>";
    var sensores = tabla.getElementsByClassName("nombreSensor")
    var estado = tabla.getElementsByClassName("Descalibrado");
    var fecha = tabla.getElementsByClassName("Fecha");
    let ultimoSensor = "";

      for (let i = 0; i < tabla.rows.length; i++) {
        tablaM += "<tr>";
        
        if (i==0) {
            tablaM += "<th>" + tabla.rows[i].cells[1].innerHTML + "</th>" + 
            "<th>" + tabla.rows[i].cells[5].innerHTML + "</th>";
        } else {
            
            descalibrado = estado[i-1]
            fechaDeUno = fecha[i-1]
            sensorActual = sensores[i - 1].innerText;
            if(descalibrado != undefined && descalibrado.innerHTML=="1"){
                let fechaDate = new Date(fechaDeUno.innerText)
                let horas = (Date.now() - fechaDate.getTime())/1000/60/24

                if( i> 0 && horas>=4 && ultimoSensor != sensorActual){
                    ultimoSensor = sensorActual;
                    console.log("la i", i)
                    
                    tablaM += "<td>" + tabla.rows[i].cells[1].innerText + "</td>" + 
                    "<td>" + tabla.rows[i].cells[5].innerText + "</td>";
                }
            } else if (descalibrado.innerHTML == "0") {
                ultimoSensor = sensorActual;
            }
        }
        tablaM += "</tr>";
      }
      tablaM += "</tbody></table>";

    var style = "<style>";
    style = style + "table {width: 100%;font: 17px Calibri;}";
    style = style + "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
    style = style + "padding: 2px 3px;text-align: center;}";
    style = style + "</style>";

    // CREATE A WINDOW OBJECT.
    var win = window.open('', '', 'height=700,width=700');

    win.document.write('<html><head>');
    win.document.write(style);          // ADD STYLE INSIDE THE HEAD TAG.
    win.document.write('</head><body>');
    win.document.write('<h1>Sensores descalibrados de más de 4 horas</h1>');
    win.document.write(tablaM);       // THE TABLE CONTENTS INSIDE THE BODY TAG.
    win.document.write('</body></html>');

    win.document.close(); 	// CLOSE THE CURRENT WINDOW.

    win.print();    // PRINT THE CONTENTS.
}
