/* global swal, toastr */
var nombreAplicacion = "Cyclero";
function loading() {
    let containerLoading = document.createElement('div');
    containerLoading.innerHTML = "<img width='100' height='100' src='resources/img/rueda.gif' alt='rueda'/> <span class='sr-only'>Loading...</span></div> <br> <strong> Cargando... </strong>";
    swal.fire({
        width: 400,
        html: containerLoading,
        showConfirmButton: false,
        allowOutsideClick: false
    });
}

function allswal(minrequest) {
    switch (minrequest.status) {
        case 1:
            swal.fire({
                title: minrequest.title,
                text: minrequest.message,
                icon: "info",
                button: false,
                closeOnClickOutside: false,
                timer: 5000
            });
            break;
        case 2:
            swal.fire({
                title: minrequest.title,
                text: minrequest.message,
                icon: "success",
                button: false,
                closeOnClickOutside: false,
                timer: 5000
            });
            break;
        case 3:
            swal.fire({
                title: minrequest.title,
                text: minrequest.message,
                icon: "warning",
                button: false,
                closeOnClickOutside: false,
                timer: 5000
            });
            break;
        case 4:
            swal.fire({
                title: minrequest.title,
                text: minrequest.message,
                icon: "error",
                button: false,
                closeOnClickOutside: false,
                timer: 5000
            });
            break;
        default:
            swal.close();
            break;
    }
}

/**
 * @function successTo
 * @memberOf jsAlertPersonalize
 * @description This small function allows to visualize a notification called "toastr" in 
 * succesfull state in the lower right side of the screen.
 * @param {JsonObject} obj This object contains the message to be displayed.
 * @returns {undefined} this function has no returns.
 */
function successTo(obj) {
    toastr.success(obj.message, obj.nameApplication, {
        positionClass: "toast-bottom-right",
        closeButton: true
    });
}
/**
 * @function errorTo
 * @memberOf jsAlertPersonalize
 * @description This small function allows to visualize a notification called "toastr" in 
 * error state in the lower right side of the screen.
 * @param {JsonObject} obj This object contains the message to be displayed.
 * @returns {undefined} this function has no returns.
 */
function errorTo(obj) {
    toastr.error(obj.message, obj.nameApplication, {
        positionClass: "toast-bottom-right",
        closeButton: true
    });
}
/**
 * @function infoTo
 * @memberOf jsAlertPersonalize
 * @description This small function allows to visualize a notification called "toastr" in 
 * info state in the lower right side of the screen.
 * @param {JsonObject} obj this object contains the message to be displayed.
 * @returns {undefined} this function has no returns.
 */
function infoTo(obj) {
    toastr.info(obj.message, obj.nameApplication, {
        positionClass: "toast-bottom-right",
        closeButton: true
    });
}
/**
 * @function warningTo
 * @memberOf jsAlertPersonalize
 * @description This small function allows to visualize a notification called "toastr" in 
 * warning state in the lower right side of the screen.
 * @param {JsonObject} obj this object contains the message to be displayed.
 * @returns {undefined} this function has no returns.
 */
function warningTo(obj) {
    toastr.warning(obj.message, obj.nameApplication, {
        positionClass: "toast-bottom-right",
        closeButton: true
    });
}

/**
 * @function alertAll
 * @memberOf jsAlertPersonalize
 * @description This function allows you to call the toastr notification [error, warning, susses] using an 
 * object as a parameter which contains a status attribute, allowing you to decide 
 * what type of notification to display
 * @param {JsonObject} obj Indique the status for decide that alert was to show and the message.
 * @returns {undefined} this function has no returns.
 */
function alertAll(obj) {
    switch (obj.status) {
        case 2:
            successTo({
                message: obj.information,
                nameApplication: (obj.tittle === undefined) ? nombreAplicacion : obj.tittle
            });
            break;
        case 3:
            warningTo({
                message: obj.information,
                nameApplication: (obj.tittle === undefined) ? nombreAplicacion : obj.tittle
            });
            break;
        case 4:
            errorTo({
                message: obj.information,
                nameApplication: (obj.tittle === undefined) ? nombreAplicacion : obj.tittle
            });
            break;
        case 1:
            infoTo({
                message: obj.information,
                nameApplication: (obj.tittle === undefined) ? nombreAplicacion : obj.tittle
            });
            break;
    }
}

/**
 * Alertas en la pagina al estilo Toasts
 * @param {type} destino - lugar a donde realizará la redirección de la página.
 * @param {type} datalert - json con los parametros para la alerta.
 * @returns {undefined} - esta función no retorna.
 */
function toastrDelay(datalert, destino) {
    alertAll(datalert);
    if (destino !== undefined) {
        setTimeout(function () {
            location.href = destino;
        }, 3000);
    }
}
/**
 * Alertas en la pagina al estilo SweetAlert2
 * @param {type} destino - lugar a donde realizará la redirección de la página.
 * @param {type} obj - json con los parametros para la alerta.
 * @returns {undefined} - esta función no retorna.
 */
function swalDelay(obj, destino) {
    swal.fire({
        title: (obj.tittle === undefined) ? nombreAplicacion : obj.tittle,
        icon: (obj.status === 1) ? "info" : (obj.status === 2) ? "success" : (obj.status === 3) ? "warning" : "error",
        text: obj.information,
        timer: 3000,
        showCancelButton: false,
        showConfirmButton: false
    }).then(() => {
        if (destino !== undefined) {
            location.href = destino;
        }
    });
}

function multAlerts(obj, status, tittle) {
    let approbe = true;
    for (var index = 0; index < obj.length; index++) {
        let alertItem = {
            "information": obj[index][3],
            "status": status,
            "tittle": tittle
        };
        alertAll(alertItem);
    }
    approbe = obj.length > 0;
    return approbe;
}