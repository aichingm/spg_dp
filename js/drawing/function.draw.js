function draw(data, clear, path) {
    path = path ? path : [];
    var selectedFloors = [];
    if ($("#drawFloors").val()) {
        $.each($("#drawFloors").val(), function (v, k) {
            selectedFloors.push(parseInt(k));
        });
    }
    if (clear === true) {
        clearScene();
    }
    var objects = {};
    objects.floors = [];
    objects.walls = [];
    objects.windows = [];
    objects.doors = [];
    objects.interfloorWalls = [];
    objects.interfloorFloors = [];
    objects.pathPoints = [];
    objects.edges = [];

    $(data.modelManager.floors).each(function (k) {
        if ($.inArray(k, selectedFloors) === -1) {
            return;
        }
        $(this.elements).each(function (floor) {
            return function () {
                switch (this.type) {
                    case "floor":
                        var geometry = Geometries.floorGemometry(this.points, floor.offset.z);
                        geometry.computeBoundingSphere();
                        var mesh = new THREE.Mesh(geometry, Materials.floor);
                        objects.floors.push(mesh);
                        break;
                    case "wall":
                        var geometry = Geometries.wallGemometry(this.points, floor.offset.z, floor.height);
                        geometry.computeBoundingSphere();
                        var mesh = new THREE.Mesh(geometry, Materials.wall);
                        objects.walls.push(mesh);
                        break;
                    case "door":
                        var geometryDoor = Geometries.doorGemometry(this.points, floor.offset.z, floor.height);
                        geometryDoor.computeBoundingSphere();
                        var meshDoor = new THREE.Mesh(geometryDoor, Materials.door);
                        objects.doors.push(meshDoor);
                        var geometryOverDoor = Geometries.overDoorGemometry(this.points, floor.offset.z, floor.height);
                        geometryOverDoor.computeBoundingSphere();
                        var meshOverDoor = new THREE.Mesh(geometryOverDoor, Materials.wall);
                        objects.doors.push(meshOverDoor);
                        break;
                    case "window":
                        var geometryWindow = Geometries.windowGeometry(this.points, floor.offset.z, floor.height);
                        geometryWindow.computeBoundingSphere();
                        var meshWindow = new THREE.Mesh(geometryWindow, Materials.window);
                        objects.windows.push(meshWindow);
                        break;
                }
            };
        }(this));
    });

    $(data.interFloorObjects).each(function (data) {
        return function (i, object) {
            var floors = data.modelManager.floors;
            switch (object.type) {
                case "floor":
                    var geometry = Geometries.interfloorFloorGeometry(object.points, floors, selectedFloors);
                    if (geometry) {
                        geometry.computeBoundingSphere();
                        var mesh = new THREE.Mesh(geometry, Materials.floor);
                        objects.interfloorFloors.push(mesh);
                    }
                    break;
                case "wall":
                    var geometry = Geometries.interfloorWallGeometry(object.points, floors, selectedFloors);
                    if (geometry) {
                        geometry.computeBoundingSphere();
                        var mesh = new THREE.Mesh(geometry, Materials.wall);
                        objects.interfloorWalls.push(mesh);
                    }
                    break;
            }
        };
    }(data));

    var vertices = [];

    $(data.paths.vertices).each(function (data) {
        return function (i, object) {
            if ($.inArray(object.floorIndex, selectedFloors) === -1 || !Arrays.boolInArray(object.name, path)) {
                return;
            }
            vertices.push({"x": object.x, "y": object.y, "floorIndex": object.floorIndex});
            var floors = data.modelManager.floors;
            console.log(object);
            var geometry = new THREE.SphereGeometry(50, 32, 32);
            var material = new THREE.MeshBasicMaterial({color: 0xffff00});
            var sphere = new THREE.Mesh(geometry, material);
            sphere.position.x = object.x;
            sphere.position.z = object.y;
            sphere.position.y = floors[object.floorIndex].offset.z + 70;
            objects.pathPoints.push(sphere);
        };
    }(data));




    $(data.paths.edges).each(function (data) {
        return function (i, object) {
            if ($.inArray(object.Afloor, selectedFloors) === -1 ||
                    $.inArray(object.Bfloor, selectedFloors) === -1 ||
                    Arrays.countSameItems([
                        {"x": object.Ax, "y": object.Ay, "floorIndex": object.Afloor},
                        {"x": object.Bx, "y": object.By, "floorIndex": object.Bfloor}
                    ], vertices) !== 2
                    // !Arrays.containsEqualObject(vertices, {"x":object.Ax, "y":object.Ay, "floorIndex":object.Afloor}) ||
                    // !Arrays.containsEqualObject(vertices, {"x":object.Bx, "y":object.By, "floorIndex":object.Bfloor}) 
                    ) {
                return;
            }
            var floors = data.modelManager.floors;
            var material = new THREE.MeshBasicMaterial({color: 0x0000ff});
            var edge = Geometries.edgeGeometry(
                    new THREE.Vector3(object.Ax, floors[object.Afloor].offset.z + 70, object.Ay),
                    new THREE.Vector3(object.Bx, floors[object.Bfloor].offset.z + 70, object.By),
                    {"radiusAtTop": 10, "radiusAtBottom": 10, "radiusSegments": 6, "heightSegments": 4},
            material
                    );
            objects.edges.push(edge);
        };
    }(data)
            );
    $.each(objects.floors, function () {
        scene.add(this);
    });
    $.each(objects.interfloorFloors, function () {
        scene.add(this);
    });
    $.each(objects.walls, function () {
        scene.add(this);
    });
    $.each(objects.pathPoints, function () {
        scene.add(this);
    });
    $.each(objects.edges, function () {
        scene.add(this);
    });
    THREEx.Transparency.init(objects.walls);
    $.each(objects.doors, function () {
        scene.add(this);
    });
    THREEx.Transparency.init(objects.doors);
    $.each(objects.windows, function () {
        scene.add(this);
    });
    THREEx.Transparency.init(objects.interfloorWalls);
    $.each(objects.interfloorFloors, function () {
        scene.add(this);
    });
    THREEx.Transparency.init(objects.windows);
    updateFcts.push(function (delta, now) {
        THREEx.Transparency.update(objects.walls, camera);
        THREEx.Transparency.update(objects.windows, camera);
        THREEx.Transparency.update(objects.doors, camera);
        THREEx.Transparency.update(objects.interfloorWalls, camera);
    });

}