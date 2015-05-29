function ModelManager() {
    //this.model = {"floors": [{"name": "1. stock", "elements": [], "offset": {"x": 0, "y": 0, "z": 0}, "height": 30}]};
    //this.model = {"floors": [], "interFloorObjects": {"floors": [], "walls": []}, "paths": []};
    //this.model.floors.push({"name": "default floor", "elements": [], "pathPoints": [], "offset": {"x": 0, "y": 0, "z": 0}, "height": 200});

    this.init = function () {
        this.model = {"floors": []};
        this.model.floors.push({"name": "default floor", "elements": [], "offset": {"x": 0, "y": 0, "z": 0}, "height": 200});
    };
    this.initSettings = function () {
        if (!this.model.settings) {
            this.model.settings = {};
        }
        if (typeof this.model.settings.pxPerMeter === "undefined") {
            this.model.settings.pxPerMeter = 100;
        }
    };


    this.getFloor = function (index) {
        return this.model.floors[index];
    };
    this.addFloor = function (name, hight, offset) {
        this.model.floors.push({"name": name, "elements": [], "offset": offset, "height": hight});
    };


    this.setFloor = function (index, floor) {
        this.model.floors[index] = floor;
    };

    this.getFloorElements = function (index) {
        return this.getFloor(index).elements;
    };
    this.setFloorElemets = function (index, elements) {
        this.getFloor(index).elements = elements;
    };

    this.addElemetToFloor = function (floorIndex, element) {
        this.getFloor(floorIndex).elements.push(element);
    };

    this.deleteFloor = function (index) {
        this.model.floors.splice(index, 1);
    };

    this.getFloorNames = function () {
        var names = new Array();
        for (var i = 0; i < this.model.floors.length; i++) {
            names.push(this.model.floors[i].name);
        }
        return names;
    };

    this.getFloors = function () {
        return this.model.floors;
    };

    this.getFloorByName = function (name) {
        for (var i = 0; i < this.model.floors.length; i++) {
            if (this.model.floors[i].name === name) {
                return this.model.floors[i];
            }
        }
    };

    this.fromString = function (string) {
        this.model = JSON.parse(string);
    };

    this.toString = function () {
        return JSON.stringify(this.model);
    };
    this.save = function () {
        return this.model;
    };
    this.load = function (data) {
        if (data) {
            this.model = data;
            this.initSettings();
        }
    };

    this.getAllPointsOnFloorAsArray = function (index) {
        var floor = this.getFloor(index);
        var points = new Array();
        for (var i = 0; i < floor.elements.length; i++) {
            for (var j = 0; j < floor.elements[i].points.length; j++) {
                points.push(floor.elements[i].points[j]);
            }
        }
        return points;
    };
    this.getAllPointsOnFloor = function (index) {
        var floor = this.getFloor(index);
        var points = new Array();
        for (var i = 0; i < floor.elements.length; i++) {
            for (var j = 0; j < floor.elements[i].points.length; j++) {
                if (!Arrays.containsEqualObject(points, {"x": floor.elements[i].points[j][0], "y": floor.elements[i].points[j][1]})) {
                    points.push({"x": floor.elements[i].points[j][0], "y": floor.elements[i].points[j][1]});
                }
            }
        }
        return points;
    };



    /*
     * 
     * INTER FLOOR OBJECTS
     * 
     */
    this.getInterFloorObjects = function () {
        return this.model.interFloorObjects;
    };
    this.addInterFloorObject = function (type, floorPoints) {
        if (type === "wall") {
            this.model.interFloorObjects.walls.push(floorPoints);
        } else if (type === "floor") {
            this.model.interFloorObjects.floors.push(floorPoints);
        }
    };
    this.delieteInterFloorObject = function (type, index) {
        if (type === "wall") {
            this.model.interFloorObjects.walls.splice(index, 1);
        } else if (type === "floor") {
            this.model.interFloorObjects.floors.splice(index, 1);
        }
    };
    this.init();
    this.initSettings();
    return this;
}
;
