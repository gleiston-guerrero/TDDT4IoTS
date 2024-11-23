var urlWebServicies = location.origin + "/ciclero_servidor/webresources/";

var globalData = {};
var allIcons = [];
var RoutinhIcons = [];

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

function getItemIndex(pcondi, pcallb, value) {
    let list = [
        {permit: "R", label: "Administrador", color: "badge-danger"},
        {permit: "A", label: "Moderador", color: "badge-warning"},
        {permit: "U", label: "Usuario", color: "badge-info"}
    ];
    for (var ind = 0; ind < list.length; ind++) {
        if (list[ind][pcondi] === value) {
            return list[ind][pcallb];
        }
    }
}

function globalAjax(data, option) {
    return $.ajax({
        method: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: urlWebServicies + 'general/' + option,
        data: JSON.stringify(data),
        beforeSend: function () {
//            loading();
        }, error: function (objXMLHttpRequest) {
            console.log("error", objXMLHttpRequest);
            swal.fire("!Oh no¡", "Se ha producido un problema.", "error");
        }
    });
}







