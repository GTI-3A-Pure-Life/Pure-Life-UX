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
        
        /*cy.wait('@iniciarSesion').then((interception) => {
            assert.equal(interception.response.body, bodyFalso)
        })*/

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
      
      /*cy.wait('@iniciarSesion').then((interception) => {
          assert.equal(interception.response.body, bodyFalso)
      })*/

      let urlEsperable = "http://localhost/Pure-Life-UX/src/usuarioApp.html"
      let tituloEsperable = "Mi perfil"
      let h1Esperable = "Bienvenido, nombre test"

      // comprobaciones
      cy.url().should('eq',urlEsperable)
      cy.title().should('eq',tituloEsperable)
      cy.get("h1:first").should('have.text',h1Esperable)
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
