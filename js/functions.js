/************************************ CLASES ************************************/
class Wallet {
    constructor (wallet) {
        this.currency = wallet.currency;
        this.amount = wallet.amount;
    }

    agregar(cantidad) { // COMPRE UNIDADES
        this.amount = this.amount + cantidad;
    }
    
    quitar(cantidad) { // VENDI UNIDADES
        this.amount = this.amount - cantidad;
    }

    tengoDisponible(cantidad) {
        if(cantidad > this.amount){
            return false;
        }
        return true;
    }
}

class Currency {
    constructor (currency) {
        this.name = currency.name;
        this.symbol = currency.symbol;
        this.price = currency.price;
    }

    calcularValorDeCompra(cantidad){
        return cantidad * this.calcularCotizacionCompra();
    }
    
    calcularValorDeVenta(cantidad){
        return cantidad * this.calcularCotizacionVenta();
    }
    
    calcularCotizacionCompra() {
        return this.price * (100 + spread) / 100;
    }

    calcularCotizacionVenta() {
        return this.price * (100 - spread) / 100;
    }
}



/************************************ VARIABLES ************************************/
// SPREAD -> NÚMERO ENTERO QUE INDICA EL SPREAD DE LAS CRYPTO
let spread = 5;
// USUARIO
// TENENCIA (LISTADO DE DIVISAS)
// SIMBOLO
// CANTIDAD -> NÚMERO FLOTANTE
// HISTORIAL DE TRANSACCIONES (NICE TO HAVE) -> LISTADO DE STRING (PARA NO COMPLEJIZARLA)
// LISTADO DE DIVISAS
const divisas = [
    new Currency({ name: "Dólar", symbol: "USD", price: 1 }),
    new Currency({ name: "Bitcoin", symbol: "BTC", price: 29950.20 }),
    new Currency({ name: "Ethereum", symbol: "ETH", price: 1812.35 }),
    new Currency({ name: "BNB", symbol: "BNB", price: 300.21 })
];

const wallets = [
    new Wallet({ currency: divisas.find(divisa => divisa.symbol === "USD"), amount: 5000 }),
    new Wallet({ currency: divisas.find(divisa => divisa.symbol === "BTC"), amount: 0.17 }),
    new Wallet({ currency: divisas.find(divisa => divisa.symbol === "ETH"), amount: 0 }),
    new Wallet({ currency: divisas.find(divisa => divisa.symbol === "BNB"), amount: 0 })
];

/************************************ IMPRIMIR WALLET EN HTML ************************************/

const imprimirTenencia = () => {

    // Obtener div de tenencias
    const billeteraid = document.getElementById('tenencias');   

    let htmlToAdd = "";

    for (const wallet of wallets) {
        htmlToAdd += `${wallet.currency.name}: ${wallet.amount} ${wallet.currency.symbol}<br />`;
    }

    billeteraid.innerHTML = htmlToAdd;

}


const parsearNumeroFlotante  = (numberString) => {
    
    let numero = Number.parseFloat(numberString);

    if(numero === undefined || numero === null || numero === isNaN){
        alert("El monto ingresado debe ser un número");
        return 0;
    }
    
    return numero;
}


const calcularCotizacionCompra = (simbolo) => {
    let currency = divisas.find(c => c.symbol === simbolo);
    if(currency !== null){
        return currency.calcularCotizacionCompra();
    }

    return -1;
}



/************************************ SECCIÓN DE ADMINISTRADOR ***************************************/
/* CargarSaldo
Ingresar dinero del usuario a la plataforma
Input: Cantidad de dinero a ingresar por el usuari (número decimal)
Output: -
*/

/* Método CargarSpread
Descripción: Cargar el spread deseado para la compra/venta de todas las cryptodivisas.
Input: Porcentaje de spread deseado (Número entero)
Lógica: Guardar el spread deseado.

*/

/* Método CargarCotizacion
Descripción: Cargar la cotización de compra o venta de la moneda especificada en la plataforma
Input: Símbolo de la crpytomoneda (Ej: BTC), Valor de la cotización (número decimal)
Lógica: En base a la cotización ingresada y el simbolo ingresado, se va a guardar en la plataforma. 
se va a guardar en la plataforma.
*/

/* 
MostrarSpread() -> Devuelve el spread
MostrarCotizacion(Simbolo) -> En base al simbolo ingresado, devuelve la cotización

*/

/*

Spread: 5%
----
Simbolo: BTC
Coti: $10.000

*/

const setearDivisaAOperar = () => {

    refreshOperacionDiv();

    let listadoDivisasHtml = document.getElementById("divisas");
    let divisaSeleccionada = listadoDivisasHtml.options[listadoDivisasHtml.selectedIndex].value; // Esto guarda la seleccion del usuario: BTC, ETH o BNB

    let tenenciaDivisaAOperar = wallets.find(divisa => divisa.currency.symbol === divisaSeleccionada);

    // Actualizo los valores del HTML
    document.getElementById("divOperacion").classList.remove("hidden");
    document.getElementById("titleOperacion").innerHTML = `Operar ${tenenciaDivisaAOperar.currency.name}`;
    document.getElementById("pCompra").innerHTML = `Precio de compra: $${tenenciaDivisaAOperar.currency.calcularCotizacionCompra()}`;
    document.getElementById("pVenta").innerHTML = `Precio de venta: $${tenenciaDivisaAOperar.currency.calcularCotizacionVenta()}`;
}

const refreshOperacionDiv = () => {
    document.getElementById("montoAOperar").value = "";
    document.getElementById("textoOperacion").innerHTML = "";
}

const setearDatosOperacion = () => {
    // Operación seleccionada
    let listadoOperaciones = document.getElementById("opeCompraVenta");
    let operacionSeleccionada = listadoOperaciones.options[opeCompraVenta.selectedIndex].value;
    // Divisa seleccionada
    let listadoDivisasHtml = document.getElementById("divisas");
    let divisaSeleccionada = listadoDivisasHtml.options[listadoDivisasHtml.selectedIndex].value;
    // Monto ingresado
    let montoAOperarHtml = document.getElementById("montoAOperar");

    // Valores de la oepración
    let divisa = wallets.find(divisa => divisa.currency.symbol === divisaSeleccionada);
    let dollars = wallets.find(divisa => divisa.currency.symbol === "USD");
    let montoOperacion = parsearNumeroFlotante(montoAOperarHtml.value);

    // Actualizo valores a imprimir`
    let texto = "";
    
    if(montoOperacion > 0){
        if (operacionSeleccionada === "Compra") {
            var costoDeLaCompra = divisa.currency.calcularValorDeCompra(montoOperacion);
            var puedeComprar = dollars.tengoDisponible(costoDeLaCompra);
            if ( puedeComprar ) {
                texto += `Va a comprar <b>${montoOperacion} ${divisa.currency.symbol}</b> a un precio total de <b>$${costoDeLaCompra}</b>`;
            }
            else {
                texto += "No tiene dolares suficientes para la operación deseada.";
            }
        }
        else { // Venta
            var costoDeLaVenta = divisa.currency.calcularValorDeVenta(montoOperacion);
            var puedeVender = divisa.tengoDisponible(montoOperacion);
            if ( puedeVender ) {
                texto += `Va a vender <b>${montoOperacion} ${divisa.currency.symbol}</b> a un precio total de <b>$${costoDeLaVenta}</b>`;
            }
            else {
                texto += `No tiene suficientes ${divisa.currency.symbol} para la operación deseada.`;
            }
        }
    }

    document.getElementById("textoOperacion").innerHTML = texto;
}

const confirmarOperacion = () => {
    // Operación seleccionada
    let listadoOperaciones = document.getElementById("opeCompraVenta");
    let operacionSeleccionada = listadoOperaciones.options[opeCompraVenta.selectedIndex].value;
    // Divisa seleccionada
    let listadoDivisasHtml = document.getElementById("divisas");
    let divisaSeleccionada = listadoDivisasHtml.options[listadoDivisasHtml.selectedIndex].value;
    // Monto ingresado
    let montoAOperarHtml = document.getElementById("montoAOperar");

    // Valores de la oepración
    let divisa = wallets.find(divisa => divisa.currency.symbol === divisaSeleccionada);
    let dollars = wallets.find(divisa => divisa.currency.symbol === "USD");
    let montoOperacion = parsearNumeroFlotante(montoAOperarHtml.value);

    // VALIDACIONES ANTES DE OPERAR!!!!!
    if(montoOperacion === undefined || montoOperacion === null || montoOperacion === 0){
        return;
    }

    // Actualizo valores a imprimir`
    let texto = "";
    
    if(montoOperacion > 0){
        if (operacionSeleccionada === "Compra") {
            var costoDeLaCompra = divisa.currency.calcularValorDeCompra(montoOperacion);
            var puedeComprar = dollars.tengoDisponible(costoDeLaCompra);
            if ( puedeComprar ) {
                dollars.quitar(costoDeLaCompra);
                divisa.agregar(montoOperacion);
                imprimirTenencia();
                texto += `La operación ha sido exitosa!<br />
                Ha comprado ${montoOperacion} ${divisa.currency.symbol}</br> a un precio total de <b>$${costoDeLaCompra}</b>`;
            }
            else {
                texto += "No tiene dolares suficientes para la operación deseada.";
            }
        }
        else { // Venta
            var costoDeLaVenta = divisa.currency.calcularValorDeVenta(montoOperacion);
            var puedeVender = divisa.tengoDisponible(montoOperacion);
            if ( puedeVender ) {
                divisa.quitar(montoOperacion);
                dollars.agregar(costoDeLaVenta);
                imprimirTenencia();
                texto += `La operación ha sido exitosa!<br />
                Ha vendido <b>${montoOperacion} ${divisa.currency.symbol}</b> a un precio total de <b>$${costoDeLaVenta}</b>`;
            }
            else {
                texto += `No tiene suficientes ${divisa.currency.symbol} para la operación deseada.`;
            }
        }
    }

    document.getElementById("textoOperacion").innerHTML = texto;
}

/* EJECUCIÓN DEL SCRIPT */
// Primero imprimimos nuestra tenencia
imprimirTenencia();

let seleccionarDivisaDropdown = document.getElementById("divisas");
seleccionarDivisaDropdown.onchange = () => {setearDivisaAOperar()};

let seleccionarOperacionDropdown = document.getElementById("opeCompraVenta");
seleccionarOperacionDropdown.onchange = () => {refreshOperacionDiv()};

let ingresarMontoOperacionInput = document.getElementById("montoAOperar");
ingresarMontoOperacionInput.oninput = () => {setearDatosOperacion()};

let confirmarOperacionButton = document.getElementById("confirmarOperacion");
confirmarOperacionButton.onclick = () => {confirmarOperacion()};

let cancelarOperacionButton = document.getElementById("cancelarOperacion");
cancelarOperacionButton.onclick = () => {refreshOperacionDiv()};