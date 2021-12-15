/**
 * Test automatico para probar la autentificacion de la pagina
 * @author Ruben Pardo Casanova
 * 14/12/2021
 * 
 * test_autentificacion.js
 * 
 */
const webdriver = require('selenium-webdriver')
var chrome = require('selenium-webdriver/chrome')
var path = require('chromedriver').path;
var until = require("selenium-webdriver").until;
var service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);

var driver = new webdriver.Builder()
.withCapabilities(webdriver.Capabilities.chrome())
.build();

var pagina_auth = "http://localhost/Pure-Life-UX/src/login.html"

 describe("Iniciar Sesion (asegura tener el servidor abierto)", function(){


    var inputCorreoId = "correoInicioSesion" ;
    var botonLoginId = "botonLogin";
    var inputContrasenya = "contrasenyaInicioSesion";
   

    // cargar la pagina del login cada test
    beforeEach(function () {
        driver.get( pagina_auth );
        
    })
    
  
    it("Login correcto", async ()=>{
        // preparacion
        let correo = "usuario@gmail.com";
        let contrasenya = "1234";

        // ponemos en los inputs los credenciales
        driver.findElement(webdriver.By.id(inputCorreoId)).sendKeys(correo);
        driver.findElement(webdriver.By.id(inputContrasenya)).sendKeys(contrasenya);
        // le damos a login
        await driver.findElement(webdriver.By.id(botonLoginId)).click();
        let tituloEsperable = "Bienvenido, prueba"

        // test Code
        let tituloObtenido = await driver.findElement(webdriver.By.css("h1")).getText().then((text) => {
            return text;
        });;
        
        await driver.quit();
    });


});