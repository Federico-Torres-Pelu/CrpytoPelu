/************************************ CLASES ************************************/
class Wallet {
    constructor (wallet) {
        this.currency = wallet.currency;
        this.amount = wallet.amount;
    }

    comprar(cantidad) {
        this.amount = this.amount + cantidad;
    }
    
    vender(cantidad) {
        this.amount = this.amount - cantidad;
    }
}

class Currency {
    constructor (currency) {
        this.name = currency.name;
        this.symbol = currency.symbol;
        this.price = currency.price;
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




/************************************ SECCIÓN DE USUARIO ************************************/
/* Método MostrarTenencia
Descripción: Muestra la tenencia del usuario
Output: Listado de divisas del usuario
*/
const verTenencia = () => {

    let texto = "TU TENCENCIA DE DIVISAS\r\n";

    wallets.forEach(listado =>
        texto += `Saldo en ${listado.currency.name}: ${listado.amount} ${listado.currency.symbol}\r\n`
    );

    alert(texto);
}

/* Método: OperarDivisa
Descripción: En base a el simbolo ingresado, el tipo de operción y el monto vamos a realizar la compra/venta solicitada por el usuario, y
a su vez, guardar en el historial de transacciones la operación (método GuardarTransaccionDelUsuario).
VALUDACIONES: Es importante validar: 
- Al comprar: Que el usuario tenga disponible la cantidad de USD necesarios.
- Al vender: Que el usuario tenga disponible la cantidad de crpytodivisas necesarias.
Input: Simbolo, Tipo de operación (Compra/Venta), Monto a comprar (decimal)
Output: Estado de la operación -> Se ejecutó o no, y si no, el error.
*/
const operarCryptoDivisas = () => {
    let operacion = Number(prompt(`
    1 - Comprar BTC
    2 - Vender BTC
    3 - Comprar ETH
    4 - Vender ETH
    5 - Comprar BNB
    6 - Vender BNB
    `))

    switch (operacion) {
        case 1:
            ingresarMontoAOperar("BTC", "COMPRAR");
            break;
        case 2:
            ingresarMontoAOperar("BTC", "VENDER");
            break;
        case 3:
            ingresarMontoAOperar("ETH", "COMPRAR");
            break;
        case 4:
            ingresarMontoAOperar("ETH", "VENDER");
            break;
        case 5:
            ingresarMontoAOperar("BNB", "COMPRAR");
            break;
        case 6:
            ingresarMontoAOperar("BNB", "VENDER");
            break;
    }

    imprimirTenencia();
}

const ingresarMontoAOperar = (simbolo, operacion) => {
    let currency = divisas.find(d => d.symbol === simbolo);
    let walletUsd = wallets.find(w => w.currency.symbol === "USD");

    if(currency !== null){
        let cotizacionOperacion;
        let operacionMaxima;
        if(operacion === "COMPRAR"){
            cotizacionOperacion = currency.calcularCotizacionCompra();
            operacionMaxima = walletUsd.amount / cotizacionOperacion;
        }else{
            cotizacionOperacion = currency.calcularCotizacionVenta();
            operacionMaxima = obtenerTenencia(simbolo);
        }
    
        let monto = Number(prompt(`
        Usted va a ${operacion.toLowerCase()} ${simbolo}
        Cotización: $${cotizacionOperacion}
        El máximo que puede ${operacion.toLowerCase()} es de: ${operacionMaxima}
        Ingrese el monto en ${simbolo} a ${operacion.toLowerCase()}
        `))
    
        let montoNumber = parsearNumeroFlotante(monto);
    
        if(montoNumber > 0){
            operarDivisa(simbolo, operacion, montoNumber);
        }
        else{
            alert("El monto a operar debe ser mayor a 0");
        }
    }
    else{
        alert("La divisa ingresada no está disponible para operar.");
    }

}


const operarDivisa = (simbolo, operacion, monto) => {
    switch(operacion){
        case "COMPRAR":
            operarCompraDivisa(simbolo, monto);
            break;
        case "VENDER":
            operarVentaDivisa(simbolo, monto);
            break;
    }
}

const operarCompraDivisa  = (simbolo, monto) => {
    let wallet = wallets.find(w => w.currency.symbol === simbolo);
    let walletUsd = wallets.find(w => w.currency.symbol === "USD");

    if(wallet !== null){
        let cotizacion = wallet.currency.calcularCotizacionCompra();
        let montoAComprarEnUsd = cotizacion*monto;

        // VALIDACIONES
        if((simbolo !== "BTC") && (simbolo !== "ETH") && (simbolo !== "BNB")){
            alert("La crypto ingresada no está disponible para operar.");
            return;
        }

        if(walletUsd.amount < montoAComprarEnUsd){
            alert("No tiene suficientes USD para realizar la compra deseada.");
            return;
        }

        // PROCESAR OPERACION DE COMPRA
        walletUsd.vender(montoAComprarEnUsd);
        wallet.comprar(monto);

        // NOTIFICACIÓN DE ÉXITO
        alert(`
            Ha comprado correctamente ${monto} ${simbolo} por $${montoAComprarEnUsd} 
        `)
    }
}

const operarVentaDivisa  = (simbolo, monto) => {
    let wallet = wallets.find(w => w.currency.symbol === simbolo);
    let walletUsd = wallets.find(w => w.currency.symbol === "USD");

    if(wallet !== null){
        let cotizacion = wallet.currency.calcularCotizacionVenta();
        let montoAVenderEnUsd = cotizacion*monto;
        let montoEnBilletera = wallet.amount;

        // VALIDACIONES
        if((simbolo !== "BTC") && (simbolo !== "ETH") && (simbolo !== "BNB")){
            alert("La crypto ingresada no está disponible para operar.");
            return;
        }

        if(montoEnBilletera < monto){
            alert(`No tiene suficientes ${simbolo} para realizar la venta deseada.`);
            return;
        }

        // PROCESAR OPERACION DE VENTA
        wallet.vender(monto);
        walletUsd.comprar(montoAVenderEnUsd);

        // NOTIFICACIÓN DE ÉXITO
        alert(`
            Ha vendido correctamente ${monto} ${simbolo} por $${montoAVenderEnUsd} 
        `)
    }
}

const parsearNumeroFlotante  = (numberString) => {
    
    let numero = Number.parseFloat(numberString);

    if(numero === undefined || numero === null || numero === isNaN){
        alert("El monto ingresado debe ser un número");
        return;
    }
    
    return numero;
}


/*const ejecutarCompra = (simbolo, ) => {

}*/

/* Método: GuardarTransaccionDelUsuario (Es ejecutado por OperarDivisa)
Descripción: Muestra el historial de transacciones del usuario
Output: Listado de transacciones del usuario
*/

/* Método: MostrarHistorialDeTransaacciones
Descripción: Muestra el historial de transacciones del usuario
Output: Listado de transacciones del usuario
*/


/************************************ SECCIÓN COMPARTIDA ***************************************/
/* Método MostrarCotizacion
Descripción: Obtener la cotización de compra y venta para una determinada crpyto
Input: Símbolo de la crpytomoneda (Ej: BTC)
Lógica: En base a la crypto deseada, se va a devolver el precio de compra y el precio de venta, calculando los mismos utilizando
la cotización y el spread.
Precio de compra = Cotización * (100 + Spread) / 100
Precio de venta = Cotización * (100 - Spread) / 100
*/
const calcularCotizacionCompra = (simbolo) => {
    let currency = divisas.find(c => c.symbol === simbolo);
    if(currency !== null){
        return currency.calcularCotizacionCompra();
    }

    return -1;
}

const calcularCotizacionVenta = (simbolo) => {
    let cotizacion = 0;
    switch (simbolo) {
        case "BTC":
            cotizacion = cotizacionBtc * (100 - spread) / 100;
            break;
        case "ETH":
            cotizacion = cotizacionEth * (100 - spread) / 100;
            break;
        case "BNB":
            cotizacion = cotizacionBnb * (100 - spread) / 100;
            break;
    }
    return cotizacion;
}

const calcularCotizacion = (simbolo, operacion) => {
    let cotizacion = 0;
    switch (operacion) {
        case "COMPRAR":
            cotizacion = calcularCotizacionCompra(simbolo);
            break;
        case "VENDER":
            cotizacion = calcularCotizacionVenta(simbolo);
            break;
    }
    return cotizacion;
}

const verCotizaciones = () => {

    let texto = "COTIZACIÓN DE CRYPTODIVISAS\r\n";

    divisas.forEach(listado => {
            if(listado.symbol !== "USD"){
                texto += `${listado.name} (${listado.symbol}) - Precio de compra: $${listado.calcularCotizacionCompra()} \r\n`
                + `${listado.name} (${listado.symbol}) - Precio de venta: $${listado.calcularCotizacionVenta()} \r\n`
            }
        }
    );

    alert(texto);
}

const obtenerTenencia = (simbolo) => {
    let wallet = wallets.find(w => w.currency.symbol === simbolo);
    if(wallet !== null){
        return wallet.amount;
    }
    return 0;
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
    let divisaAOperar = document.getElementById("divisas");
    var tenenciaDivisaAOperar = wallets.find(divisa => divisa.symbol === divisaAOperar);

    document.getElementById("titleOperacion").innerHTML = `Operar ${divisaAOperar.currency.name}`;
}

/* EJECUCIÓN DEL SCRIPT */
// Primero imprimimos nuestra tenencia
imprimirTenencia();

let seleccionarDivisaDropdown = document.getElementById("divisas");
seleccionarDivisaDropdown.onchange = () => {setearDivisaAOperar()};

/*do {

    opcion = Number(prompt(`
    Bienvenidos a Crypto Pelu!
    1-Cargar dinero (No implementada actualmente)
    2-Ver tenencia
    3-Ver cotizaciones Crypto
    4-Operar Crpyto
    
    5-Salir
    
    `))

    switch (opcion) {
        case 2: {
            verTenencia();
            break;
        }
        case 3: {
            verCotizaciones();
            break;
        }
        case 4: {
            operarCryptoDivisas();
            break;
        }
        case 5: {
            alert("Gracias por operar con Crypto Pelu!")
            break;
        }
        default: {
            alert("dato ingresado no valido")
            break
        };

    }
} while (opcion !== 5)*/
