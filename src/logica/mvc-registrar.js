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
    terminos: document.getElementsByClassName("checkbox")[0],
//======================================================================================================
// Cuando el usuario se registra, si es un usuario normal se lleva a la app y si es administrador, a la página de admin
//
// usuario --> 
// redirigirUsuario() -->
// <--
//======================================================================================================
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

            const caracteres = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let token = '';
            for (let i = 0; i < 25; i++) {
                token += caracteres[Math.floor(Math.random() * caracteres.length )];
            }

            if(this.vista.apellidos.value != "") {
                nombre += " " + this.vista.apellidos.value;
            }
            let telefono = this.vista.telefono.value;
            if(telefono == "") {
                telefono = null;
            }
            try {
                if(!this.vista.terminos.checked){
                    alert("Tienes que aceptar los Términos y Condiciones");
                } else {
                    console.log(token);
                    this.modelo.usuario = await LogicaFalsa.registrar_usuario(nombre, this.vista.correo.value, pass, telefono, token);

                    alert("Se le ha enviado un correo electrónico de verificiación a su cuenta de correo")
                    try {
                        await LogicaFalsa.mandar_correo(nombre, this.vista.correo.value, token)
                    } catch (error) {
                        console.log(error);
                    }

                    //this.modelo.usuario = await LogicaFalsa.iniciar_sesion(this.vista.correo.value, pass)
                    //this.vista.redirigirUsuario(this.modelo.usuario);
                 }
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

