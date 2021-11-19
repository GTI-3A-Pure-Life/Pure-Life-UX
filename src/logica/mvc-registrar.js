// .....................................................................
// MVC-registrar.js
// Pablo Enguix Llopis 18/11/2021
// .....................................................................

var ModeloRegistrar = {
    usuario: {
        nombre: "",
        correo: "",
        contrasenya: "",
        telefono: ""
    },
    setDatos: function(usuario) {
        this.usuario.nombre = usuario.nombre;
        this.usuario.correo = usuario.correo;
        this.usuario.contrasenya = usuario.contrasenya;
        this.usuario.telefono = usuario.telefono;
    },

    getDatos: function() {
        return this.usuario;
    }
};

var VistaRegistrar = {
    // Coge los bloques del html
    nombre: document.getElementsByClassName("contenedorNombreYApellidos")[0].getElementsByTagName("input")[0],
    apellidos: document.getElementsByClassName("contenedorNombreYApellidos")[0].getElementsByTagName("input")[1],
    correo: document.getElementsByClassName("campoParaIntroducirTexto")[0],
    contrasenya: document.getElementsByClassName("campoParaIntroducirTexto")[1],
    confirmarContrasenya: document.getElementsByClassName("campoParaIntroducirTexto")[2],
    telefono: document.getElementsByClassName("campoParaIntroducirTexto")[3],

    redirigirUsuario : function(usuario) {
        if(usuario.rol == 1) {
            location.href = "usuarioApp.html";
            window.localStorage.setItem("sesion", JSON.stringify(usuario))
        } else if (usuario.rol == 2) {
            location.href = "adminApp.html";
            window.localStorage.setItem("sesion", JSON.stringify(usuario))
        }
    }
}

var ControladorRegistrar = {
    modelo: ModeloRegistrar,
    vista: VistaRegistrar,
    manejador: async function() {
        if(this.vista.contrasenya.value == this.vista.confirmarContrasenya.value) {
            let pass = SHA1(this.vista.contrasenya.value);
            let nombre = this.vista.nombre.value;
            if(this.vista.apellidos.value != "") {
                nombre += " " + this.vista.apellidos.value;
            }
            let telefono = this.vista.telefono.value;
            if(telefono == "") {
                telefono = null;
            }
            try {
                this.modelo.usuario = await LogicaFalsa.registrar_usuario(nombre, this.vista.correo.value, pass, telefono);

                this.modelo.usuario = await LogicaFalsa.iniciar_sesion(this.vista.correo.value, pass)
                this.vista.redirigirUsuario(this.modelo.usuario);
            } catch(err) {
                if(err.message == "Error en datos") {
                    alert("Los datos introducidos no son válidos o ya están en uso")
                } else if(err.message == "Error en servidor") {
                    alert("Ha habido un error en el servidor, por favor, inténtelo más tarde");
                }
            }
        } else {
            alert("Las contraseñas no coinciden");
        }
        
    }
}

