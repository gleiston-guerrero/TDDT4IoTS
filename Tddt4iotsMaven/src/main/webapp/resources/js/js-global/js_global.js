
/*
 * @autor Dúval Carvajal S.
 */

/* global angular, swal, store */

//variable que obtiene la url del proyecto donde se obtiene los webservicies
var urlWebServicies = location.origin + "/Tddm4IoTbsServer/webapis/";
//var urlWebServicies = "http://190.15.134.19:8080/bioforestserver/webresources/";
//
var rutasStorage = {
    components: '/storageTddm4IoTbs/tddm4iotbs_components/',
    projects: '/storageTddm4IoTbs/tddm4iotbs_projects/',
    imguser: '/storageTddm4IoTbs/UserImage/'
};
var alertAll;
//declara la varibale principal para el manejo de angular
app = angular.module('app', []);

function isObjEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true;
}

function googleanalytics() {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        dataLayer.push(arguments);
    }
    gtag('js', new Date());

    gtag('config', 'G-GH3QS1BXR6');

}
window.onload = googleanalytics();


/**
 * @function método para obtener los datos de la sesio
 * */
function getDataSession() {
    var dataUser = store.session.get("user_tddm4iotbs");
    if (dataUser === "undefined" || dataUser === null)
    {
        if (currentPage() !== "index")
        {
            location.href = "index.html"; // si no existe sesion inicada lo bota al login
        }
    }
    return dataUser;
}

function getCheckSession() {
    var dataUser = store.session.get("user_tddm4iotbs");
    if (dataUser != "undefined" && dataUser !== null) {
        return true;
    }
    return false;
}

/**
 * @function método para mostrar el gif de cargando
 * */
function loading() {
    let containerLoading = document.createElement('div');
    containerLoading.innerHTML = " <img src='resources/img/logo-app/logoTDDT4IOTSicon.svg' width='100' alt='logo'/> <img src='resources/img/img-app/loadingPro.gif' width='40' alt='load'/>";
    swal.fire({
        width: 200,
        html: containerLoading,
        showConfirmButton: false,
        allowOutsideClick: false,
        background: "",
    });
}

function loadingMvn () {
    let containerLoading = document.createElement('div');
    containerLoading.innerHTML = "<img src='resources/img/img-app/gifSpring.gif' alt='load' width='100'> <br> <img src='resources/img/img-app/springLogo.png ' alt='load' width='200'> <br> <strong> Creating maven project with spring boot. </strong>";
    swal.fire({
        width: 400,
        html: containerLoading,
        showConfirmButton: false,
        allowOutsideClick: false
    });
}

function loadingAng () {
    let containerLoading = document.createElement('div');
    containerLoading.innerHTML = "<img src='resources/img/img-app/gifSpring.gif' alt='load' width='100'> <br> <img src='resources/img/img-app/loadAngular.png ' alt='load' width='200'> <br> <strong> Creating angular project. </strong>";
    swal.fire({
        width: 400,
        html: containerLoading,
        showConfirmButton: false,
        allowOutsideClick: false
    });
}

/**
 * @function funcion para cerrar sesion
 * */
function cerrarSesion() {
    store.session.set("user_tddm4iotbs", undefined);
    location.href = "index.html";
}

/**
 * @function método para regresar al inicio_admin o inicio_usuario
 * @param {string} rol
 * */
function salir(rol) {
    location.href = (rol === "A" || rol === "R") ? "inicio_admin" : "inicio_usuario";
}

/**
 * @function función para validar campos requeridos
 * @param {array} vectorparam
 * */
function camposRequeridos(vectorparam) {
    let can_camposrequeridos = vectorparam.length;
    let cont = 0;
    let flag = false;
    if (can_camposrequeridos > 0) {
        for (let i = 0; i < can_camposrequeridos; i++) {
            if (vectorparam[i] !== "") {
                cont++;
            }
        }
        flag = cont === can_camposrequeridos ? true : false;
    } else {
        alertAll({"status": 3, "information": "No existen campos requeridos"});
    }
    return flag;
}

/**
 * funcin verifica y toma acción de acuerdo a los parametros del usuario
 * @param {type} user_token token de usuario
 * @returns {undefined} no tiene retornos
 */
function validarSesion(user_token) {
    if (user_token !== undefined && user_token !== null)
    {
        $.when(verificarSesion(user_token)).then(function (data) {
//            console.log("data de resultado duper", data);
            if (data.status === 2) {

                if (validarpagina(data.data.permmit)) {
                    data.tittle = "Validación de Sesión";
                    alertAll(data);
                }
            } else {
                data.tittle = "¡Alerta de Sesión!";
                store.session.set("user_tddm4iotbs", undefined);
                if (currentPage() === "login")
                {
                    swalDelay(data, "login");
                }
            }
        });
    } else {
        if (currentPage() !== "login")
        {
            swalDelay({
                status: 4,
                information: "No tienes acceso a esta página, primero debes iniciar sesión.",
                tittle: "¡Validación de Permiso!"
            }, "login");
        }

    }
}
/**
 * pregunta al servidor si el token es válido
 * @param {type} user_token token de usuario
 * @returns {jqXHR} retorna una promesa
 */
function verificarSesion(user_token) {
    return $.ajax({
        method: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: urlWebServicies + 'personaapis/getdatasession',
        data: JSON.stringify({"user_token": user_token}),
        beforeSend: function () {
//            loading();
        },
        success: function (data)
        {
//            swal.close();
        },
        error: function (objXMLHttpRequest) {
//            console.log("error", objXMLHttpRequest);
            swal.fire("!Oh no¡", "Se ha producido un problema.", "error");
        }
    });
}

/**
 *
 * @param {type} permit - el permiso evniador desde el servidor
 * @param {type} actual la pagina en donde esta, si no envía usa la función para encontrar el nombre
 * @returns {Boolean} retorna true si tiene acceso
 */
function validarpagina(permit, actual) {

    if (actual === undefined)
    {
        actual = currentPage();
    }
    actual = actual.toString().replace(".html", "");

    let def = (permit === 'S') ? 'verificar' : (permit === 'U') ? 'inicio_usuario' : (permit === 'A' || permit === 'R') ? 'inicio_admin' : 'portal';
    let pages = [
        {'page': 'login', 'permit': /[X]/},
        {'page': 'inicio_usuario', 'permit': /[U]/},
        {'page': 'inicio_admin', 'permit': /[A|R]/},
        {'page': 'editar_especie', 'permit': /[A|R]/},
        {'page': 'insertar_especie', 'permit': /[A|R]/},
        {'page': 'editar_especie', 'permit': /[A|R]/},
        {'page': 'veificar', 'permit': /[S]/},
        {'page': 'configuracion', 'permit': /[U|A|R]/}
    ];
    let flagpermit = false;
    if (permit.length !== 1) {
        permit = 'X';
    } else
    {
        for (let ind = 0; ind < pages.length; ind++) {
//            console.log(permit, pages[ind]['permit'].test(permit));
            if (pages[ind]['page'] === actual && pages[ind]['permit'].test(permit)) {
                flagpermit = true;
                ind = pages.length;
            }
        }
    }
    if (!flagpermit)
    {
        //páginad e login
        if (actual === pages[0].page)
        {
            swalDelay({
                status: 1,
                information: "Será redirigido al lugar adecuado.",
                tittle: "¡Sesión en curso!"
            }, def);
        } else {
            swalDelay({
                status: 3,
                information: "No tienes acceso a esta página, seras redirigido a un lugar adecuado.",
                tittle: "¡Validación de Permiso!"
            }, def);
        }
//        console.log("regresa a: " + def);
    } else {
//        console.log("permiso consedido");
        return true;
    }
}


function currentPage() {
    let locat = location.pathname.toString();
    return locat.substring(locat.lastIndexOf("/") + 1, locat.length);
}
// pokemon

function recorreCondiciones(obj) {
    let superindex = [];
    for (var index = 0; index < obj.length; index++) {
        if (!verifyString(obj[index][0], obj[index][1], obj[index][2]))
        {
//            superindex = index;
            superindex.push(obj[index]);
//            index = obj.length;
//            console.log(superindex);
        }
    }
//    console.log(obj);
    return superindex;
}

function verifyString(item, opt, condi)
{
    let flag = false;
    if (item !== undefined)
    {
        switch (opt) {
            case "objM": // dimensión de un obeto
                {
                    if (typeof (item) == "object")
                    {
                        flag = item.length >= condi;
                    } else {
                        flag = false;
                    }
                }
                break;
            case "objm": // dimensión de un obeto
                {
                    if (typeof (item) == "object")
                    {
                        flag = item.length <= condi;
                    } else {
                        flag = false;
                    }
                }
                break;
            case "eq": // igualdad entre objetos
                {
                    flag = (item.toString().trim() === condi);
                }
                break;
            case "ueq": // diferente cadena
                {
                    flag = (item.toString().trim() !== condi);
                }
                break;
            case "wd": // contador de palabras
                {
                    flag = (verifyMaxWords(item.toString().trim(), " ") <= condi);
                }
                break;
            case "lgm": // longitud de cadena minima
                {
                    flag = item.toString().trim().length <= condi;
                }
                break;
            case "lgM": // longitud de cadena Maxima
                {
                    flag = item.toString().trim().length >= condi;
                }
                break;
            case "em": // validación de email
                {
                    flag = (new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)).test(item.toString().trim());
                }
                break;
            case "dt": // fecha
                {
                    flag = (new RegExp(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)).test(item.toString().trim());
                }
                break;
            case "int": // validación de email
                {
                    flag = (new RegExp(/^\d+$/)).test(item.toString().trim());
                }
                break;
            case "year": // validación año
                {
                    flag = (new RegExp(/([12]\d{3})/)).test(item.toString().trim());
                }
                break;
            case "pwd": // validación de contraseña
                {
                    flag = (new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}/)).test(item.toString().trim());
                }
                break;
            case "city": // validación de ciudad
                {
                    flag = (new RegExp(/[0-9]+\-[0-9]+\-[0-9]+/)).test(item.toString().trim());
                }
                break;
            case "coor": // validación de ciudad
                {
                    flag = (new RegExp(/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,}/).test(item.toString().trim()));
                }
                break;
            default:
                flag = false;
                break;
        }
    } else {
        flag = false;
    }
    return flag;
}

function verifyMaxWords(text, characters)
{
    let contador = 1, pos;
    text = text.trim();
    if (text === "") {
        contador = 0;
    } else {
        pos = text.indexOf(characters);
        while (pos !== -1) {
            contador++;
            pos = text.indexOf(" ", pos + characters.length);
        }
    }
//    console.log("palabras:" + contador);
    return contador;
}


function enviarSugerencia(jsonparam) {
    $.ajax({
        method: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: urlWebServicies + 'xilotecaapis/enviarSugerencia',
        data: JSON.stringify({...jsonparam}),
        beforeSend: function () {
            loading();
        },
        success: function (data)
        {
            swal.close();
//            console.log(data);
            alertAll(data);
            limpiarSugerencia();
        },
        error: function (objXMLHttpRequest) {
//            console.log("error", objXMLHttpRequest);
            swal.fire("!Oh no¡", "Se ha producido un problema.", "error");
        }
    });
}

function limpiarSugerencia() {
    $("#descripcionnombre").val("");
    $("#descripcioncorreo").val("");
    $("#descripcionasunto").val("");
    $("#descripcionmensaje").val("");
}


app.directive('intense', function () {
    return {
        template: '<p>{{text}}</p>',
        link: function (scope, elem, attrs) {
            elem[0].src = attrs.intense;
//            console.log(elem[0]);
            if (typeof (Intense) != "undefined")
            {
                Intense(elem[0]);
            }
        }
    };
});
