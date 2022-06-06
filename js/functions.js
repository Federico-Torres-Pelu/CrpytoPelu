
/************************************ VARIABLES ************************************/
// SPREAD -> NÚMERO ENTERO QUE INDICA EL SPREAD DE LAS CRYPTO
let spread = 5;
// USUARIO
// TENENCIA (LISTADO DE DIVISAS)
// SIMBOLO
// CANTIDAD -> NÚMERO FLOTANTE
// HISTORIAL DE TRANSACCIONES (NICE TO HAVE) -> LISTADO DE STRING (PARA NO COMPLEJIZARLA)
let billeteraUsd = 5000;
let billeteraBtc = 0.17;
let billeteraEth = 0;
let billeteraBnb = 0;

// LISTADO DE DIVISAS
// SIMBOLO
// COTIZACIÓN
let cotizacionBtc = 29950.20;
let cotizacionEth = 1812.35;
let cotizacionBnb = 300.21;

/************************************ SECCIÓN DE USUARIO ************************************/
/* Método MostrarTenencia
Descripción: Muestra la tenencia del usuario
Output: Listado de divisas del usuario
*/
const verTenencia = () => {
    alert(`
    TU TENCENCIA DE DIVISAS
    Saldo en Dólares (USD): $${billeteraUsd}
    Saldo en Bitcoin (BTC): ${billeteraBtc}BTC
    Saldo en Ethereum (ETH): ${billeteraEth}ETH
    Saldo en BNB (BNB): ${billeteraBnb}BNB
    `);
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
}

const ingresarMontoAOperar = (simbolo, operacion) => {
    let cotizacionOperacion = calcularCotizacion(simbolo, operacion);
    let operacionMaxima;
    if(operacion === "COMPRAR"){
        operacionMaxima = billeteraUsd / cotizacionOperacion;
    }else{
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
    let cotizacion = calcularCotizacionCompra(simbolo);
    let montoAComprarEnUsd = cotizacion*monto;

    // VALIDACIONES
    if((simbolo !== "BTC") && (simbolo !== "ETH") && (simbolo !== "BNB")){
        alert("La crypto ingresada no está disponible para operar.");
        return;
    }

    if(billeteraUsd < montoAComprarEnUsd){
        alert("No tiene suficientes USD para realizar la compra deseada.");
        return;
    }

    // PROCESAR OPERACION DE COMPRA
    billeteraUsd = (billeteraUsd -  montoAComprarEnUsd);
    switch(simbolo){
        case "BTC":
            billeteraBtc = (billeteraBtc + monto);
            break;
        case "ETH":
            billeteraEth = (billeteraEth + monto);
            break;
        case "BNB":
            billeteraBnb = (billeteraBnb + monto);
            break;
    }

    // NOTIFICACIÓN DE ÉXITO
    alert(`
        Ha comprado correctamente ${monto} ${simbolo} por $${montoAComprarEnUsd} 
    `)
}

const operarVentaDivisa  = (simbolo, monto) => {
    let cotizacion = calcularCotizacionVenta(simbolo);
    let montoAVenderEnUsd = cotizacion*monto;
    let montoEnBilletera;

    // VALIDACIONES
    if((simbolo !== "BTC") && (simbolo !== "ETH") && (simbolo !== "BNB")){
        alert("La crypto ingresada no está disponible para operar.");
        return;
    }

    switch(simbolo){
        case "BTC":
            montoEnBilletera = billeteraBtc;
            break;
        case "ETH":
            montoEnBilletera = billeteraEth;
            break;
        case "BNB":
            montoEnBilletera = billeteraBnb;
            break;
    }
    if(montoEnBilletera < monto){
        alert(`No tiene suficientes ${simbolo} para realizar la venta deseada.`);
        return;
    }


    // PROCESAR OPERACION DE VENTA
    switch(simbolo){
        case "BTC":
            billeteraBtc = (billeteraBtc - monto);
            break;
        case "ETH":
            billeteraEth = (billeteraEth - monto);
            break;
        case "BNB":
            billeteraBnb = (billeteraBnb - monto);
            break;
    }
    billeteraUsd = (billeteraUsd + montoAVenderEnUsd);

    // NOTIFICACIÓN DE ÉXITO
    alert(`
        Ha vendido correctamente ${monto} ${simbolo} por $${montoAVenderEnUsd} 
    `)
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
    let cotizacion = 0;
    switch (simbolo) {
        case "BTC":
            cotizacion = cotizacionBtc * (100 + spread) / 100;
            break;
        case "ETH":
            cotizacion = cotizacionEth * (100 + spread) / 100;
            break;
        case "BNB":
            cotizacion = cotizacionBnb * (100 + spread) / 100;
            break;
    }
    return cotizacion;
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

    let cotizacionBtcCompra = calcularCotizacion("BTC", "COMPRAR");
    let cotizacionBtcVenta = calcularCotizacion("BTC", "VENDER");
    let cotizacionEthCompra = calcularCotizacion("ETH", "COMPRAR");
    let cotizacionEthVenta = calcularCotizacion("ETH", "VENDER");
    let cotizacionBnbCompra = calcularCotizacion("BNB", "COMPRAR");
    let cotizacionBnbVenta = calcularCotizacion("BNB", "VENDER");

    alert(`
    COTIZACIÓN DE CRYPTODIVISAS
    Bitcoin (BTC) - Precio de compra: $${cotizacionBtcCompra}
    Bitcoin (BTC) - Precio de venta: $${cotizacionBtcVenta}
    Ethereum (ETH) - Precio de compra: $${cotizacionEthCompra}
    Ethereum (ETH) - Precio de venta: $${cotizacionEthVenta}
    BNB (BNB) - Precio de compra: $${cotizacionBnbCompra}
    BNB (BNB) - Precio de venta: $${cotizacionBnbVenta}
    `);
}

const obtenerTenencia = (simbolo) => {
    let tenencia = 0;
    switch (simbolo) {
        case "BTC":
            tenencia = billeteraBtc;
            break;
        case "ETH":
            tenencia = billeteraEth;
            break;
        case "BNB":
            tenencia = billeteraBnb;
            break;
    }
    return tenencia;
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

/* EJECUCIÓN DEL SCRIPT */
do {
    opcion = Number(prompt(`
    Bienvenidos a Crypto Pelu!
    1-Cargar dinero (No implementada actualmente)
    2-Ver tenencia
    3-Ver cotizaciones Crypto
    4-Operar Crpyto
    
    5-Salir
    
    `))

    switch (opcion) {
        /*case 1: {
            cargarDinero();
            break;
        }*/
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
} while (opcion !== 5)
