var pages = {
    login: "login",
    home: "app",
    verify: "verificar"
};

function getDataSession() {
    var dataUser = store.session.get("user_Tddm4IoTbs");
    if (dataUser === undefined || dataUser === null)
    {
        if (currentPage() !== pages.login)
        {
            location.href = pages.login; // si no existe sesion inicada lo bota al login
        }
    }
    return dataUser;
}

function cerrarSesion() {
    store.session.set("user_Tddm4IoTbs", undefined);
    location.href = pages.login;
}

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
                store.session.set("user_Tddm4IoTbs", undefined);
                if (currentPage() !== pages.login)//verificarrrrrrrrrrrrr
                {
                    swalDelay(data, pages.login);
                }
            }
        });
    } else {
        if (currentPage() !== pages.login)
        {
            swalDelay({
                status: 4,
                information: "No tienes acceso a esta página, primero debes iniciar sesión.",
                tittle: "¡Validación de Permiso!"
            }, pages.login);
        }

    }
}

function verificarSesion(user_token) {
    return $.ajax({
        method: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: urlWebServicies + 'persona/getdatasession',
        data: JSON.stringify({"user_token": user_token}),
        beforeSend: function () {
//            loading();
        },
        success: function (data)
        {
//            swal.close();
        },
        error: function (objXMLHttpRequest) {
            console.log("error", objXMLHttpRequest);
            swal.fire("!Oh no¡", "Se ha producido un problema.", "error");
        }
    });
}

function verificarPermiso(permit, actual) {
    if (actual === undefined)
    {
        actual = currentPage();
    }
    actual = actual.toString().replace(".html", "");

    let minpages = [
        {'page': pages.login, 'permit': /[X]/},
        {'page': pages.home, 'permit': /[U|A|R]/}
    ];
    let flagpermit = false;
    if (permit.length !== 1) {
        permit = 'X';
    } else
    {
        for (let ind = 0; ind < minpages.length; ind++) {
            if (minpages[ind]['page'] === actual && minpages[ind]['permit'].test(permit)) {
                flagpermit = true;
                ind = pages.length;
            }
        }
    }
    return flagpermit;
}

function validarpagina(permit, actual) {
    let flagpermit = verificarPermiso(permit, actual);
//    console.log("to", flagpermit);
    let def = (permit === 'S') ? pages.verify :
            (permit === 'U') ? pages.home :
            (permit === 'A' || permit === 'R') ? pages.home : pages.login;
    if (!flagpermit)
    {
        if (actual === pages.login)
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
        console.log("regresa a: " + def);
    } else {
        console.log("permiso consedido");
        return true;
    }
}

function redirigirPorDefecto(permit) {
    let def = (permit === 'S') ? pages.verify :
            (permit === 'U') ? pages.home :
            (permit === 'A' || permit === 'R') ? pages.home : pages.login;
    if (def !== currentPage()) {
        setInterval(function () {
            location.href = def;
        }, 1000);
    }
}

function sesionCaducada() {
    swalDelay({
        status: "4",
        information: "La sesión ha expirado, vuelve a iniciar sesión.",
        tittle: "¡Validación de Permiso!"
    }, "login");
}