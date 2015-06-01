$(document).ready(function (e) {
    $(".leftDrawer.load").on("leftDrawer-open", function (e) {

    });
    $(".leftDrawer.load").on("leftDrawer-apply", function (event) {
        console.log("sdgndfkbj")
        var f = $(".leftDrawer.load .content input[name='loadFile']")[0].files[0];
        console.log(f)
        if (f) {
            var r = new FileReader();
            r.onload = function (e) {
                var model = JSON.parse(e.target.result);
                var jc = STORAGE.jsonConvert;
                STORAGE.jsonConvert = false;
                STORAGE.putData(model);
                STORAGE.jsonConvert = jc;
                VIEWER.draw(true);
            };
            r.readAsText(f);
        }
    });
});