function getUrlParams(url, items) {
    let urlParams = new URLSearchParams(url.replace(/#/g, "?"));
    let response = {};
    for (let ind = 0; ind < items.length; ind++)
    {
        let param = urlParams.get(items[ind]);
        if (param !== undefined && param !== null) {
            response[items[ind]] = param;
        }
    }
    window.history.replaceState(null, null, "/" + proyectName() + currentPage());
    return response;
}


function proyectName() {
    let rutaAbsoluta = location.pathname.toString().substring(1);
    let posicionUltimaBarra = rutaAbsoluta.toString().indexOf("/");
    rutaAbsoluta = rutaAbsoluta.substring(0, posicionUltimaBarra);
    rutaAbsoluta = (rutaAbsoluta === undefined) ? "" : rutaAbsoluta;
    if (rutaAbsoluta.length !== 0)
    {
        rutaAbsoluta += "/";
    }
    return rutaAbsoluta;
}

function currentPage() {
    let locat = location.pathname.toString();
    return locat.substring(locat.lastIndexOf("/") + 1, locat.length);
}