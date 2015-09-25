$(document).ready(function (e) {
    $(".leftDrawer.simulationRunner div button[name='load']").click(function () {
        var f = $(".leftDrawer.simulationRunner div input[name='loadFile']")[0].files[0];
        if (f) {
            var r = new FileReader();
            r.onload = function (e) {
                var pMap = JSON.parse(e.target.result);
                console.log(pMap)
                var exports, map, graph, path, mapBuildOptions, distanceCalculator;
                exports = STORAGE.getData();
                mapBuildOptions = {
                    onlyPublic: true,
                    onlyAccessible: false
                };
                distanceCalculator = DistanceCalculators.calculateByVectorDistance3D;
                map = buildMapFromDataPaths(exports, distanceCalculator, mapBuildOptions);
                graph = new Dijkstra(map);



                try {
                    var vertex, closestVertex, simulation = new Simulation();
                    //TODO for all populated rooms do this with the closest exit
                    //var routes = [{from: "Lehrer Raum 6", to: "Notausgang"}, {from: "Lehrer Raum 1", to: "Notausgang"}];
                    /*
                     * calculate pathSegments
                     */
                    var allPathSegments = [];

                    for (var q = 0; q < pMap.length; q++) {

                        if (pMap[q].objectiveType !== "Room") {
                            graph.getPath(pMap[q].habitat, pMap[q].habitat);
                            for (vertex in graph.data.distance) {
                                if (exports.paths.vertices[exports.paths.vshadow[vertex]].categories &&
                                        exports.paths.vertices[exports.paths.vshadow[vertex]].categories.indexOf(pMap[q].objective) !== -1
                                        ) {
                                    if (!closestVertex || graph.data.distance[closestVertex] > graph.data.distance[vertex]) {
                                        closestVertex = vertex;
                                    }
                                }
                            }
                            pMap[q].objective = closestVertex;
                        }


                        var path = graph.getPath(pMap[q].habitat, pMap[q].objective);
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
                        simulation.addRunners(pMap[q].population, pathSegments, function () {
                            return Math.floor(exports.modelManager.settings.pxPerMeter *1.5 + Math.random() * 5);
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
                    $(".leftDrawer.simulationCreator .controls button").trigger("click");
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
                                        Math.min((Math.max(p.workload() - 15, 0)) / 100, 1),
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
                    throw exception;
                }




            }
            ;
            r.readAsText(f);
        }
    });

});