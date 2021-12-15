/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

var pagina_login = "http://localhost/Pure-Life-UX/src/login.html"
var pagina_registrar = "http://localhost/Pure-Life-UX/src/registrar.html"
var inputCorreoId = "#correoInicioSesion" ;
var botonLoginId = "#botonLogin";
var inputContrasenya = "#contrasenyaInicioSesion";

describe('TEST UI', () => {
 
 it("Login correcto",()=>{
    // preparacion
      cy.visit(pagina_login)
      cy.get(inputCorreoId).type('usuario@gmail.com')
      cy.get(inputContrasenya).type('1234')

      cy.get(botonLoginId).click()

      // mockear peticion inicar sesion
      cy.intercept('POST','http://localhost:8080/usuario/iniciar_sesion',{fixture:'usuario_logeado.json'})

      // obtener el body de la peticion falsa
      

      let urlEsperable = "http://localhost/Pure-Life-UX/src/usuarioApp.html"
      let tituloEsperable = "Mi perfil"
      let h1Esperable = "Bienvenido, nombre test"

      // comprobaciones
      cy.url().should('eq',urlEsperable)
      cy.title().should('eq',tituloEsperable)
      cy.get("h1:first").should('have.text',h1Esperable)
})

it("Registrarse correcto",()=>{
  // preparacion
    cy.visit(pagina_registrar)
    cy.get(".campoParaIntroducirTexto1").type('nombre')
    cy.get(".campoParaIntroducirTexto2").type('test')
    cy.get(".campoParaIntroducirTexto").eq(0).type('usuario@gmail.com')
    cy.get(".campoParaIntroducirTexto").eq(1).type('1234')
    cy.get(".campoParaIntroducirTexto").eq(2).type('1234')
    cy.get(".campoParaIntroducirTexto").eq(3).type('1234')

    cy.get(".botonIniciarSecionGrande").click()

    // mockear peticion inicar sesion
    cy.intercept('POST','http://localhost:8080/usuario/registrarse',{fixture:'usuario_registrado_mock.json'})
    cy.intercept('POST','http://localhost:8080/usuario/iniciar_sesion',{fixture:'usuario_logeado.json'})

    // obtener el body de la peticion falsa
    
    
    let urlEsperable = "http://localhost/Pure-Life-UX/src/usuarioApp.html"
    let tituloEsperable = "Mi perfil"
    let h1Esperable = "Bienvenido, nombre test"

    // comprobaciones
    cy.url().should('eq',urlEsperable)
    cy.title().should('eq',tituloEsperable)
    cy.get("h1:first").should('have.text',h1Esperable)
})


it("Comprobar graficas temporales",()=>{
  // preparacion
    // nos logeamos para entrar al perfil
    cy.visit(pagina_login)
    cy.get(inputCorreoId).type('usuario@gmail.com')
    cy.get(inputContrasenya).type('1234')

    cy.get(botonLoginId).click()

    // mockear peticion inicar sesion
    cy.intercept('POST','http://localhost:8080/usuario/iniciar_sesion',{fixture:'usuario_logeado.json'})

    // moeckeamos el obtener mediciones del usuario de hoy
    cy.intercept('GET','http://localhost:8080/mediciones/usuario?idUsuario=13&fecha_inicio=2021-11-26%2000:00:00&fecha_fin=2021-11-26%2023:59:59',{fixture:'mediciones_mockeadas.json'})
 
    // mostramos la grafica
    cy.get('progress.myBarCO').trigger("click"); // poner trigger click si el onclick esta en un event listener
    
    // comprobaciones ---------------
    cy.get('#chartCO').should('be.visible')

    cy.window().its('chart.data.labels')
    .should('have.length', 24)
})
  

  it("Comprobar calidad aire",()=>{
    // preparacion
      // nos logeamos para entrar al perfil
      cy.visit(pagina_login)
      cy.get(inputCorreoId).type('usuario@gmail.com')
      cy.get(inputContrasenya).type('1234')

      cy.get(botonLoginId).click()

      // mockear peticion inicar sesion
      cy.intercept('POST','http://localhost:8080/usuario/iniciar_sesion',{fixture:'usuario_logeado.json'})

      // moeckeamos el obtener mediciones del usuario de hoy
      cy.intercept('GET','http://localhost:8080/mediciones/usuario?idUsuario=13&fecha_inicio=2021-11-26%2000:00:00&fecha_fin=2021-11-26%2023:59:59',{fixture:'mediciones_mockeadas.json'})
 
      cy.intercept('GET','http://localhost:8080/calidad_aire/usuario?fecha_inicio=2021-11-26%2000:00:00&fecha_fin=2021-11-26%2023:59:59&idUsuario=13',{fixture:'calidad_aire_hoy_mock.json'})
      cy.intercept('GET','http://localhost:8080/calidad_aire/zona?fecha_inicio=2021-11-26%2000:00:00&fecha_fin=2021-11-26%2023:59:59&latitud=38.995591&longitud=-0.167129&radio=18',{fixture:'calidad_aire_zona_mock.json'})
  

      // comprobaciones
      cy.get("progress.amarillo")
      cy.get("img.fondoDeTarjetaVerde")
      cy.get("img.fondoDeTarjetaAmarillo")
  })

  it("Entrar al mapa", ()=>{
        // preparacion ----------------------
        cy.visit("http://localhost/Pure-Life-UX/src/index.html")
        cy.get("nav > ul > li > a:first").click()
        cy.intercept('GET',' http://localhost:8080/mediciones',{fixture:'mediciones_mockeadas.json'}).as("getMediciones")// mockear get mediciones
        let claseEsperable = "leaflet-container"
        
        cy.getIframe('iframe')

        // comprobamos si el elemento mapa tiene las clases que pone leaflet
})


})
