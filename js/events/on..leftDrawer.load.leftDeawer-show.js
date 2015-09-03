$(document).ready(function (e) {
    $(".leftDrawer.load").on("leftDrawer-open", function (e) {

    });
    $(".leftDrawer.load").on("leftDrawer-apply", function (event) {
        var f = $(".leftDrawer.load .content input[name='loadFile']")[0].files[0];
        if (f) {
            var r = new FileReader();
            r.onload = function (e) {
                var model = JSON.parse(e.target.result);
                STORAGE.putDataRaw(model);
                VIEWER.draw(true);
            };
            r.readAsText(f);
        }
    });
});