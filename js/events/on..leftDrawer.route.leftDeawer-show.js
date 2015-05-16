$(document).ready(function (e) {
    $(".leftDrawer.route").on("leftDrawer-open", function (e) {
        var list, exports = localStorage.getItem("PieceofShit.exports");
        exports = JSON.parse(exports);
        console.log(exports && exports.paths)
        if (exports && exports.paths && exports.paths.vertices.length > 0) {
            list = buildVetexNameList(exports.paths);
            $(".leftDrawer.route .content:first-child").show();
            $(".leftDrawer.route .content:last-child").hide();

        } else {
            //exports or exports.paths are unset so simply show an error and return. don't setup anything
            $(".leftDrawer.route .content:first-child").hide();
            $(".leftDrawer.route .content:last-child").show();
            return;
        }

        $(".leftDrawer.route div select[name='from']").html("<option value=\"-1\">from</option>");
        $(".leftDrawer.route div select[name='to']").html("<option value=\"-1\">to</option>");
        for (var i = 0; i < list.length; i++) {
            $(".leftDrawer.route div select[name='from']").append("<option>" + list[i] + "</option>");
            $(".leftDrawer.route div select[name='to']").append("<option>" + list[i] + "</option>");
        }
    });
    $(".leftDrawer.route div button.apply").attr("disabled","disabled");
    $(".leftDrawer.route div select[name='from']").on("change", function (e) {
        if ($(this).val() !== "-1") {
            $(".leftDrawer.route div select[name='to']").removeAttr("disabled");
        } else {
            $(".leftDrawer.route div select[name='to']").attr("disabled", "disabled");
            $(".leftDrawer.route div button.apply").attr("disabled", "disabled");
        }
    });
    $(".leftDrawer.route div select[name='to']").on("change", function (e) {
        if ($(this).val() !== "-1") {
            $(".leftDrawer.route div button.apply").removeAttr("disabled");
        } else {
            $(".leftDrawer.route div button.apply").attr("disabled", "disabled");
        }
    });
    $(".leftDrawer.route").on("leftDrawer-apply",function () {
        var exports = JSON.parse(localStorage.getItem("PieceofShit.exports"));
        var map = buildMapFromDataPaths(exports.paths);
        graph = new Dijkstra(map);
        var path = graph.getPath($(".leftDrawer.route div select[name='from']").val(), $(".leftDrawer.route div select[name='to']").val());

        VIEWER.setPath(path);
        VIEWER.draw(true);
       
        

    });
});