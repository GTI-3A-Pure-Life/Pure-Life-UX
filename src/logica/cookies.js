if(localStorage.getItem("sesion") != null) {
    document.getElementsByClassName("contenedorBoton")[0].getElementsByTagName("button")[0].remove();
    document.getElementsByClassName("contenedorBoton")[0].innerHTML += "<img id='userIcon' alt = 'Icono usuario' src = 'recursos/userIcon.png' onclick='window.location.href = `usuarioApp.html`'>";
}