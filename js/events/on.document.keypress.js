allTemp = [];
$(document).ready(function (e) {
    $(document).on("keypress keyup", function (e) {
        //hide open leftDrawer
        if (e.keyCode === 27) {
            $(".leftDrawer.isIn div button.cancel").trigger("click");
        }
        //start the simulation

        if (e.charCode === 1337) { //g
            var exports, map, graph, path, mapBuildOptions, distanceCalculator;
            exports = STORAGE.getData();
            mapBuildOptions = {
                onlyPublic: false,
                onlyAccessible: true
            };
            distanceCalculator = DistanceCalculators.calculateByVectorDistance3D;
            map = buildMapFromDataPaths(exports, distanceCalculator, mapBuildOptions);
            graph = new Dijkstra(map);



            try {
                var simulation = new Simulation();
                //TODO for all populated rooms do this with the closest exit
                var routes = [{from: "Lehrer Raum 6", to: "Notausgang"}, {from: "Lehrer Raum 1", to: "Notausgang"}];
                /*
                 * calculate pathSegments
                 */
                var allPathSegments = [];

                for (var q = 0; q < routes.length; q++) {
                    var path = graph.getPath(routes[q].from, routes[q].to);
                    var pathSegments = [];
                    for (var j = 0; j < exports.paths.edges.length; j++) {
                        var edge = exports.paths.edges[j];
                        var aPos = path.indexOf(edge.A.name);
                        var bPos = path.indexOf(edge.B.name);
                        if (aPos === -1 || bPos === -1) {
                            continue;
                        }
                        if (bPos === aPos + 1) {
                            var pathSegment = new PathSegment(exports.modelManager.settings.pxPerMeter);
                            pathSegment.a.x = edge.Ax;
                            pathSegment.a.y = edge.Ay;
                            pathSegment.a.z = exports.modelManager.floors[edge.Afloor].offset.z;
                            pathSegment.b.x = edge.Bx;
                            pathSegment.b.y = edge.By;
                            pathSegment.b.z = exports.modelManager.floors[edge.Bfloor].offset.z;
                            pathSegment.distance = distanceCalculator(0, edge, edge.A, edge.B, exports);
                            pathSegment.prepare();
                            pathSegments[bPos - 1] = pathSegment;
                            allPathSegments.push(pathSegment);
                        } else if (aPos === bPos + 1) {
                            var pathSegment = new PathSegment(exports.modelManager.settings.pxPerMeter);
                            pathSegment.a.x = edge.Bx;
                            pathSegment.a.y = edge.By;
                            pathSegment.a.z = exports.modelManager.floors[edge.Bfloor].offset.z;
                            pathSegment.b.x = edge.Ax;
                            pathSegment.b.y = edge.Ay;
                            pathSegment.b.z = exports.modelManager.floors[edge.Afloor].offset.z;
                            pathSegment.distance = distanceCalculator(1, edge, edge.A, edge.B, exports);
                            pathSegment.prepare();
                            pathSegments[aPos - 1] = pathSegment;
                            allPathSegments.push(pathSegment);
                        }
                    }
                    simulation.addRunners(100, pathSegments, function () {
                        return Math.floor((Math.random() * 150) + 50);
                    });
                }
                /*
                 * Create Geometries
                 */
                for (var k = 0; k < allPathSegments.length; k++) {
                    var p = allPathSegments[k];
                    var material = new THREE.MeshBasicMaterial({color: 0x00FF00});
                    var radius = exports.modelManager.settings.pxPerMeter / 4;
                    var edge = Geometries.edgeGeometry(
                            new THREE.Vector3(p.a.x, p.a.z + exports.modelManager.settings.pxPerMeter, p.a.y),
                            new THREE.Vector3(p.b.x, p.b.z + exports.modelManager.settings.pxPerMeter, p.b.y),
                            {"radiusAtTop": radius, "radiusAtBottom": radius, "radiusSegments": 6, "heightSegments": 4},
                    material
                            );
                    VIEWER.simulationData.edges.push(edge);
                }
                VIEWER.draw(true);

                /*
                 * Setup showSimulationBar
                 */
                resetSimulationBar();
                updateSimulationBar(simulation);
                $(".snackbar.showSimulationBar").show();

                /*
                 * Setup position calculation loop
                 */
                VIEWER.simulationData.simulationInterval = setInterval(function () {
                    try {
                        simulation.run(100);
                        updateSimulationBar(simulation);
                        for (var q = 0; q < VIEWER.simulationData.edges.length; q++) {
                            var p = allPathSegments[q];
                            var color = GradiantColor.getTriColor(
                                    Math.min((Math.max(p.workload()-15, 0)) / 100, 1),
                                    new Color(0, 255, 0),
                                    new Color(255, 255, 0),
                                    new Color(255, 0, 0)
                                    );
                            VIEWER.simulationData.edges[q].material.color = new THREE.Color(color.R, color.G, color.B);
                        }
                    } catch (e) {
                        console.log(e)
                        if (e === "end") {
                            updateSimulationBar(simulation);
                            $(".snackbar.showSimulationBar .time100").html(Time.secondsToReadable(simulation.elapsedTime / 1000));
                            clearInterval(VIEWER.simulationData.simulationInterval);
                        }
                    }
                }, 100);
            } catch (exception) {
                console.log(exception);
            }
        }

        //init settings drawer
        if (e.charCode === 46) { //.
            $("#settings .opener").trigger("click");
        }
    });
});

function updateSimulationBar(simulation) {
    if ((simulation.runners.length / simulation.runnersCount) * 100 < 50 && $(".snackbar.showSimulationBar .time50").html() === "") {
        $(".snackbar.showSimulationBar .time50").html(Time.secondsToReadable(simulation.elapsedTime / 1000));

    }
    if ((simulation.runners.length / simulation.runnersCount) * 100 < 25 && $(".snackbar.showSimulationBar .time75").html() === "") {
        $(".snackbar.showSimulationBar .time75").html(Time.secondsToReadable(simulation.elapsedTime / 1000));

    }
    if (simulation.runnersCount - simulation.runners.length > 1 && $(".snackbar.showSimulationBar .firstout").html() === "") {
        $(".snackbar.showSimulationBar .firstout").html(Time.secondsToReadable(simulation.elapsedTime / 1000));
    }

    $(".snackbar.showSimulationBar .time").html(Time.secondsToReadable(simulation.elapsedTime / 1000));
    $(".snackbar.showSimulationBar .peopleInTheHouse").html(simulation.runners.length);
    $(".snackbar.showSimulationBar .peopleInSafety").html(simulation.runnersCount - simulation.runners.length);

}
function resetSimulationBar() {
    $(".snackbar.showSimulationBar .time").html("");
    $(".snackbar.showSimulationBar .time100").html("");
    $(".snackbar.showSimulationBar .time75").html("");
    $(".snackbar.showSimulationBar .time50").html("");
    $(".snackbar.showSimulationBar .firstout").html("");
    $(".snackbar.showSimulationBar .peopleInTheHouse").html("");
    $(".snackbar.showSimulationBar .peopleInSafety").html("");
}
