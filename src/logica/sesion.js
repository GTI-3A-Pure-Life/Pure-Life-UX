if(localStorage.getItem("sesion") == null) {
    window.location.href = "index.html";
} else {
    let usuario = JSON.parse(localStorage.getItem("sesion"));

    document.getElementsByClassName("contenedorTituloYBoton")[0].getElementsByTagName("h1")[0].innerText = "Bienvenido, " + usuario.nombre;
    document.getElementById("correoApp").innerText = usuario.correo;

    if(usuario.telefono != null) {
        document.getElementById("telefonoApp").innerText = usuario.telefono;
    }
    if (usuario.posCasa != null) {
        document.getElementById("direccionCasaApp").innerText = usuario.posCasa.latitud + ", " + usuario.posCasa.longitud;
    }
    if(usuario.posTrabajo != null) {
        document.getElementById("direccionTrabajoApp").innerText = usuario.posTrabajo.latitud + ", " + usuario.posTrabajo.longitud;
    }
}

function cerrarSesion() {
    window.localStorage.clear();
    window.location.href = "index.html";
}