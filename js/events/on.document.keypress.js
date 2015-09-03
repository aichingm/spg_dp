allTemp = [];
$(document).ready(function (e) {
    $(document).on("keypress keyup", function (e) {
        //hide open leftDrawer
        if (e.keyCode === 27) {
            $(".leftDrawer.isIn div button.cancel").trigger("click");
        }
        //start the simulation

        if (e.charCode === 103) { //g
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
                var pathSegments = [];
                for (var q = 0; q < routes.length; q++) {
                    var path = graph.getPath(routes[q].from, routes[q].to);
                    for (var j = 0; j < exports.paths.edges.length; j++) {
                        var edge = exports.paths.edges[j];
                        var aPos = path.indexOf(edge.A.name);
                        var bPos = path.indexOf(edge.B.name);
                        if (aPos === -1 || bPos === -1) {
                            continue;
                        }
                        if (bPos === aPos + 1) {
                            var pathSegment = new PathSegment();
                            pathSegment.a.x = edge.Ax;
                            pathSegment.a.y = edge.Ay;
                            pathSegment.a.z = exports.modelManager.floors[edge.Afloor].offset.z;
                            pathSegment.b.x = edge.Bx;
                            pathSegment.b.y = edge.By;
                            pathSegment.b.z = exports.modelManager.floors[edge.Bfloor].offset.z;
                            pathSegment.distance = distanceCalculator(0, edge, edge.A, edge.B, exports);
                            pathSegment.prepare();
                            pathSegments[bPos - 1] = pathSegment;
                        } else if (aPos === bPos + 1) {
                            var pathSegment = new PathSegment();
                            pathSegment.a.x = edge.Bx;
                            pathSegment.a.y = edge.By;
                            pathSegment.a.z = exports.modelManager.floors[edge.Bfloor].offset.z;
                            pathSegment.b.x = edge.Ax;
                            pathSegment.b.y = edge.Ay;
                            pathSegment.b.z = exports.modelManager.floors[edge.Afloor].offset.z;
                            pathSegment.distance = distanceCalculator(1, edge, edge.A, edge.B, exports);
                            pathSegment.prepare();
                            pathSegments[aPos - 1] = pathSegment;
                        }
                    }
                    simulation.addRunners(25, pathSegments, function () {
                        return Math.floor((Math.random() * 150) + 50);
                    });
                }

                console.log(pathSegments)
                var allPaths = {};
                for (var k = 0; k < pathSegments.length; k++) {
                    var p = pathSegments[k];
                    var material = new THREE.MeshBasicMaterial({color: 0x624D8C});
                    console.log(exports.modelManager.settings.pxPerMeter)
                    var radius = exports.modelManager.settings.pxPerMeter / 8;
                    var edge = Geometries.edgeGeometry(
                            new THREE.Vector3(p.a.x, p.a.z + exports.modelManager.settings.pxPerMeter , p.a.y),
                            new THREE.Vector3(p.b.x, p.b.z +exports.modelManager.settings.pxPerMeter , p.b.y),
                            {"radiusAtTop": radius, "radiusAtBottom": radius, "radiusSegments": 6, "heightSegments": 4},
                    material
                            );
                    VIEWER.scene.add(edge);
                }


                var allMeshes = [];
                for (var k = 0; k < simulation.runners.length; k++) {
                    var geometry = new THREE.BoxGeometry(20, 1, 20);
                    var material = new THREE.MeshBasicMaterial({color: 0x000000});
                    var mesh = new THREE.Mesh(geometry, material);
                    console.log(simulation.runners[k].position)

                    mesh.position.set(simulation.runners[k].position.x, simulation.runners[k].position.z, simulation.runners[k].position.y);
                    allMeshes.push(mesh);
                    VIEWER.scene.add(mesh);
                }



                //TODO move to the requestAnimationFrame function
                setInterval(function () {
                    for (var k = 0; k < allMeshes.length; k++) {
                        allMeshes[k].position.set(simulation.runners[k].position.x, simulation.runners[k].position.z, simulation.runners[k].position.y);
                    }
                    simulation.run(500);
                }, 500);



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