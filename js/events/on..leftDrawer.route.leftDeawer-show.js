$(document).ready(function (e) {
    $(".leftDrawer.route").on("leftDrawer-open", function (e) {
        var list, exports = STORAGE.getData();
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
        $(".leftDrawer.route div select[name='distanceType']").html("");

        for (var i in DistanceCalculators) {
            $(".leftDrawer.route div select[name='distanceType']").append("<option>" + i + "</option>");
        }


    });
    $(".leftDrawer.route div button.apply").attr("disabled", "disabled");
    $(".leftDrawer.route div select[name='from']").on("change", function (e) {
        if ($(this).val() !== "-1") {
            $(".leftDrawer.route div select[name='to']").removeAttr("disabled");
        } else {
            $(".leftDrawer.route div select[name='to']").attr("disabled", "disabled");
            $(".leftDrawer.route div button.apply").attr("disabled", "disabled");
        }
        $(".leftDrawer.route div .error.noRoute").hide();
    });
    $(".leftDrawer.route div select[name='to']").on("change", function (e) {
        if ($(this).val() !== "-1") {
            $(".leftDrawer.route div button.apply").removeAttr("disabled");
        } else {
            $(".leftDrawer.route div button.apply").attr("disabled", "disabled");
        }
        $(".leftDrawer.route div .error.noRoute").hide();
    });
    $(".leftDrawer.route").on("leftDrawer-apply", function (event) {
        var exception, exports, map, graph, path, mapBuildOptions, distanceCalculator;
        exports = STORAGE.getData();
        mapBuildOptions = {
            onlyPublic: $(".leftDrawer.route div input[name='onlyPublic']").is(":checked"),
            onlyAccessible: $(".leftDrawer.route div input[name='onlyAccessible']").is(":checked")
        };
        distanceCalculator = DistanceCalculators[$(".leftDrawer.route div select[name='distanceType']").val()];
        map = buildMapFromDataPaths(exports,distanceCalculator,mapBuildOptions);
        console.log(map)
        graph = new Dijkstra(map);
        try {
            path = graph.getPath($(".leftDrawer.route div select[name='from']").val(), $(".leftDrawer.route div select[name='to']").val());
        console.log(path    )
            VIEWER.setPath(path);
            VIEWER.draw(true);
        } catch (exception) {
            if (exception.name === "NoRoute") {//#leftDrawers > div.leftDrawer.route.isIn > div:nth-child(1) > div
                $(".leftDrawer.route div .error.noRoute").show();
                event.preventDefault();
            }
        }
    });
});