$(document).ready(function (e) {
    $(".leftDrawer.findNext").on("leftDrawer-open", function (e) {
        var clist = [], list, exports = STORAGE.getData();
        if (exports && exports.paths && exports.paths.vertices.length > 0) {
            list = buildVetexNameList(exports.paths);
            clist = buildVetexCategoryList(exports.paths);
            $(".leftDrawer.findNext .content:first-child").show();
            $(".leftDrawer.findNext .content:last-child").hide();
        } else {
            //exports or exports.paths are unset so simply show an error and return. don't setup anything
            $(".leftDrawer.findNext .content:first-child").hide();
            $(".leftDrawer.findNext .content:last-child").show();
            return;
        }

        $(".leftDrawer.findNext div select[name='from']").html("<option value=\"-1\">from</option>");
        for (var i = 0; i < list.length; i++) {
            $(".leftDrawer.findNext div select[name='from']").append("<option>" + list[i] + "</option>");
        }

        $(".leftDrawer.findNext div select[name='category']").html("");
        for (var i = 0; i < clist.length; i++) {
            $(".leftDrawer.findNext div select[name='category']").append("<option>" + clist[i] + "</option>");
        }
        $(".leftDrawer.findNext div select[name='distanceType']").html("");

    });
    $(".leftDrawer.findNext").on("leftDrawer-apply", function (event) {
        var exception, exports, map, graph, path, mapBuildOptions, distanceCalculator, startVertex, category, vertex, closestVertex;
        exports = STORAGE.getData();
        mapBuildOptions = {
            onlyPublic: $(".leftDrawer.findNext div input[name='onlyPublic']").is(":checked"),
            onlyAccessible: $(".leftDrawer.findNext div input[name='onlyAccessible']").is(":checked")
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
            startVertex = $(".leftDrawer.findNext div select[name='from']").val();
            category = $(".leftDrawer.findNext div select[name='category']").val();
            graph.getPath(startVertex, startVertex);
            for (vertex in graph.data.distance) {
                if (exports.paths.vertices[exports.paths.vshadow[vertex]].categories &&
                        exports.paths.vertices[exports.paths.vshadow[vertex]].categories.indexOf(category) !== -1
                        ) {
                    if (!closestVertex || graph.data.distance[closestVertex] > graph.data.distance[vertex]) {
                        closestVertex = vertex;
                    }
                }
            }
            path = graph.buildPath(closestVertex);
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
            $(".snackbar.showPathBar .time").html(Time.secondsToReadable(Math.round(meters / ((parseInt($(".leftDrawer.findNext div input[name='kmh']").val()) * 1000) / 3600))));
            $(".snackbar.showPathBar").show();
        } catch (exception) {
            if (exception.name === "NoRoute") {//#leftDrawers > div.leftDrawer.route.isIn > div:nth-child(1) > div
                $(".leftDrawer.findNext div .error.noRoute").show();
                event.preventDefault();
            }
            console.log(exception);
        }
    });
});