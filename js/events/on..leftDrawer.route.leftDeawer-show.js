$(document).ready(function (e) {
    $(".leftDrawer.route").on("leftDrawer-open", function (e) {
        var exports = localStorage.getItem("PieceofShit.exports");
        var list = buildVetexNameList(JSON.parse(exports).paths);
        $(".leftDrawer.route div select[name='from']").html("<option value=\"-1\">from</option>");
        $(".leftDrawer.route div select[name='to']").html("<option value=\"-1\">to</option>");
        for (var i = 0; i < list.length; i++) {
            $(".leftDrawer.route div select[name='from']").append("<option>" + list[i] + "</option>");
            $(".leftDrawer.route div select[name='to']").append("<option>" + list[i] + "</option>");
        }
    });
    $(".leftDrawer.route div select[name='from']").on("change", function (e) {
        if ($(this).val() !== "-1") {
            $(".leftDrawer.route div select[name='to']").removeAttr("disabled");
        } else {
            $(".leftDrawer.route div select[name='to']").attr("disabled", "disabled");
            $(".leftDrawer.route div button").attr("disabled", "disabled");
        }
    });
    $(".leftDrawer.route div select[name='to']").on("change", function (e) {
        if ($(this).val() !== "-1") {
            $(".leftDrawer.route div button").removeAttr("disabled");
        } else {
            $(".leftDrawer.route div button").attr("disabled", "disabled");
        }
    });
    $(".leftDrawer.route div button").click(function () {
        var exports = JSON.parse(localStorage.getItem("PieceofShit.exports"));
        var map = buildMapFromDataPaths(exports.paths);
        graph = new Dijkstra(map);
        var path = graph.getPath($(".leftDrawer.route div select[name='from']").val(), $(".leftDrawer.route div select[name='to']").val());

        draw(exports, true, path);
        $drawer = $(".leftDrawer.isIn");
        $drawer.trigger("leftDrawer-close")
                .removeClass("isIn")
                .animate({
                    left: "-100%"
                }, {
                    duration: 200,
                    done: function () {
                        $drawer.trigger("leftDrawer-closed");
                    }
                });
        //animates all .opener to margin-left: 0 which is preatty dirty!! fix this todo
        $(".opener").animate({
            "margin-left": 0
        }, 200);

    });
});