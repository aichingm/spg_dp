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
        switch (parseInt($(".leftDrawer.route div .calcType").val())) {
            case 1:
                distanceCalculator = DistanceCalculators.calculateByVectorDistance3D;
                break;
            default :
                distanceCalculator = DistanceCalculators.calculateByVectorDistance3DPercentMetric;
                break;
        }
        map = buildMapFromDataPaths(exports, distanceCalculator, mapBuildOptions);
        graph = new Dijkstra(map);
        try {
            path = graph.getPath($(".leftDrawer.route div select[name='from']").val(), $(".leftDrawer.route div select[name='to']").val());
            VIEWER.setPath(path);
            VIEWER.draw(true);
            $(".snackbar.showPathBar .startPosition").html(path[0]);
            $(".snackbar.showPathBar .endPosition").html(path[path.length - 1]);
            var distance = CalculationHelpers.calculatePathLength3D(exports, path);
            var meters = (distance / exports.modelManager.settings.pxPerMeter);
            $(".snackbar.showPathBar .distance").html(Math.round(meters * 100) / 100);
            //include metric in to the calculation
            distance = CalculationHelpers.calculatePathLength3DPercentMetric(exports, path);
            meters = (distance / exports.modelManager.settings.pxPerMeter);
            $(".snackbar.showPathBar .time").html(Time.secondsToReadable(Math.round(meters / ((parseInt($(".leftDrawer.route div input[name='kmh']").val()) * 1000) / 3600))));
            $(".snackbar.showPathBar").show();
        } catch (exception) {
            if (exception.name === "NoRoute") {//#leftDrawers > div.leftDrawer.route.isIn > div:nth-child(1) > div
                $(".leftDrawer.route div .error.noRoute").show();
                event.preventDefault();
            } else {
                console.log(exception);
            }
        }
    });
});