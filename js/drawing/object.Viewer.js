function Viewer() {
    this.scene;
    this.renderer;
    this.controls;
    this.camera;
    this.path;
    this.data;
    this.updateFunctions = [];
    this.stats;
    this.init = function () {
        // Create the scene and set the scene size.
        this.scene = new THREE.Scene();
        var WIDTH = window.innerWidth,
                HEIGHT = window.innerHeight;
        // Create a renderer and add it to the DOM.
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(WIDTH, HEIGHT);
        document.body.appendChild(this.renderer.domElement);
        // Create a camera, zoom it out from the model a bit, and add it to the scene.
        this.camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 0.1, 2000000000);
        this.camera.position.set(1000, 1000, 1000);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene.add(this.camera);
        // Create an event listener that resizes the renderer with the browser window.
        window.addEventListener('resize', function (viewer) {
            return function () {
                var WIDTH = window.innerWidth,
                        HEIGHT = window.innerHeight;
                viewer.renderer.setSize(WIDTH, HEIGHT);
                viewer.camera.aspect = WIDTH / HEIGHT;
                viewer.camera.updateProjectionMatrix();
            };
        }(this));
        // Set the background color of the scene.
        //renderer.setClearColorHex(0x333F47, 1);
        this.renderer.setClearColor(0x333F47, 1);
        // Create a light, set its position, and add it to the scene.
        //var light = new THREE.PointLight(0xffffff, 1000, 0);
        //light.position.set(-1000, 2000, 1000);
        //scene.add(light);
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.userPanSpeed = 15;
    };

    this.draw = function (clear) {
        this.path = this.path ? this.path : [];
        var selectedFloors = [];
        if ($("#drawFloors").val()) {
            $.each($("#drawFloors").val(), function (v, k) {
                selectedFloors.push(parseInt(k));
            });
        }
        if (clear === true) {
            this.clearScene();
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

        $(this.data.modelManager.floors).each(function (k) {
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

        $(this.data.interFloorObjects).each(function (data) {
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
        }(this.data));

        var vertices = [];
        $(this.data.paths.vertices).each(function (data, viewer) {
            return function (i, object) {
                if ($.inArray(object.floorIndex, selectedFloors) === -1 || !Arrays.boolInArray(object.name, viewer.path)) {
                    return;
                }
                vertices.push({"x": object.x, "y": object.y, "floorIndex": object.floorIndex});
                var floors = data.modelManager.floors;
                var geometry = new THREE.SphereGeometry(50, 32, 32);
                var material = new THREE.MeshBasicMaterial({color: 0xffff00});
                var sphere = new THREE.Mesh(geometry, material);
                sphere.position.x = object.x;
                sphere.position.z = object.y;
                sphere.position.y = floors[object.floorIndex].offset.z + 70;
                objects.pathPoints.push(sphere);
            };
        }(this.data, this));




        $(this.data.paths.edges).each(function (data) {
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
        }(this.data));
        var _this = this;
        $.each(objects.floors, function () {
            _this.scene.add(this);
        });
        $.each(objects.interfloorFloors, function () {
            _this.scene.add(this);
        });
        $.each(objects.walls, function () {
            _this.scene.add(this);
        });
        $.each(objects.pathPoints, function () {
            _this.scene.add(this);
        });
        $.each(objects.edges, function () {
            _this.scene.add(this);
        });
        THREEx.Transparency.init(objects.walls);
        $.each(objects.doors, function () {
            _this.scene.add(this);
        });
        THREEx.Transparency.init(objects.doors);
        $.each(objects.windows, function () {
            _this.scene.add(this);
        });
        THREEx.Transparency.init(objects.interfloorWalls);
        $.each(objects.interfloorFloors, function () {
            _this.scene.add(this);
        });
        THREEx.Transparency.init(objects.windows);
        this.updateFunctions.push(function (delta, now) {
            THREEx.Transparency.update(objects.walls, _this.camera);
            THREEx.Transparency.update(objects.windows, _this.camera);
            THREEx.Transparency.update(objects.doors, _this.camera);
            THREEx.Transparency.update(objects.interfloorWalls, _this.camera);
        });
    };

    this.clearScene = function () {
        var obj, i;
        for (i = this.scene.children.length - 1; i >= 0; i--) {
            obj = this.scene.children[ i ];
            if (obj !== this.camera) {
                this.scene.remove(obj);
            }
        }
    };

    this.animate = function () {
        if (this.stats) {
            this.stats.begin();
        }
        var _this = this; //the first time this is call it is the viewer itself but after the fist call it is window.
        window.requestAnimationFrame(function () {
            _this.animate();
        });
        // Render the scene.
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
        this.updateFunctions.forEach(function (updateFn) {
            if (typeof updateFn === "function") {
                updateFn();
            }
        });
        if (this.stats) {
            this.stats.end();
        }
    };

    this.setData = function (data) {
        this.data = data;
    };
    this.setPath = function (path) {
        this.path = path;
    };
    this.setStats = function (stats) {
        this.stats = stats;
    };
    this.getStats = function () {
        return this.stats;
    };








    return this;

}

