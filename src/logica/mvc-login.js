//======================================================================================================
// .....................................................................
// MVC-login.js
// Pablo Enguix Llopis 16/11/2021
// .....................................................................
//======================================================================================================
var ModeloLogin = {
    usuario: {
        correo: "",
        contrasenya: ""
    },
    setDatos: function(usuario) {
        this.usuario.correo = usuario.correo;
        this.usuario.contrasenya = usuario.contrasenya;
    },

    getDatos: function() {
        return this.usuario;
    }
};

var VistaLogin = {
    correo: document.getElementById("correoInicioSesion"),
    contrasenya: document.getElementById("contrasenyaInicioSesion"),
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

var ControladorLogin = {
    modelo: ModeloLogin,
    vista: VistaLogin,
    manejador: async function() {
        // Convierte la contraseña a SHA1
        let pass = SHA1(this.vista.contrasenya.value);
        try {
            this.modelo.usuario = await LogicaFalsa.iniciar_sesion(this.vista.correo.value, pass);
            this.vista.redirigirUsuario(this.modelo.usuario);
        } catch(err) {
            if(err.message == "Error en datos") {
                alert("El usuario o la contraseña son incorrectos")
            } else if(err.message == "Error en servidor") {
                alert("Ha habido un error en el servidor, por favor, inténtelo más tarde");
            }
        }
    }
}

