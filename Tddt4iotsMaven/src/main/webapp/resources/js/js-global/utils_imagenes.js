function calcularTamanio(img, mw, mh)
{
    let porcentaje, w, h;
    w = img.width;
    h = img.height;
    if (h > w)
    {
        porcentaje = escalar(h, mh, 10, 0);
    } else
    {
        porcentaje = escalar(w, mw, 10, 0);
    }
    img.height = (h * porcentaje) / 100;
    img.width = (w * porcentaje) / 100;
}
function calcularTamanio2(img, mw, mh, canvas)
{
    let porcentaje, w, h;
    w = img.width;
    h = img.height;
    if (h > w)
    {
        porcentaje = escalar(h, mh, 10, 0);
    } else
    {
        porcentaje = escalar(w, mw, 10, 0);
    }
    img.height = (h * porcentaje) / 100;
    img.width = (w * porcentaje) / 100;
    canvas.height = (h * porcentaje) / 100;
    canvas.width = (w * porcentaje) / 100;
}
function escalar(h, limit, unit, mount)
{
    if (unit < 0.0001)
    {
        return mount;
    }
    let flag = true, i = 0, val = 0;
    while (flag && i < 1000) {
        if ((h * (mount + (i * unit)) / 100) <= limit && h * ((mount + ((i + 1) * unit)) / 100) > limit)
        {
            val = (i * unit);
            flag = false;
        }
        i++;
    }
    return escalar(h, limit, unit / 10, mount + val);
}

function b64_to_utf8(str) {
    try {
        return Base64.decode(str);//.replaceAll("\\n", "\n");
    } catch (e) {
        console.log("errocito", e);
        return "imprime(\"archivo corrupto\");";
    }
}

function utf8_to_b64(str) {
    try {
        return Base64.en(str);//.replaceAll("\n", "\\n");
    } catch (e) {
        console.log("errocito", e);
        return "imprime(\"archivo corrupto\");";
    }
}