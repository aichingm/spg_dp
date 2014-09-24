ModelManager = function () {
    this.model = {"floors": [{"name": "1. stock", "elements": [], "offset": {"x": 0, "y": 0, "z": 0}, "hight": 30}]};
    this.getFloor = function (index) {
        return this.model.floors[index];
    };
    this.addFloor = function (name, hight, offset) {
        this.model.floors.push({"name": name, "elements": [], "offset": offset, "hight": hight});
    };
    this.setFloor = function (index, floor) {
        this.model.floors[index] = floor;
    };
    this.removeFloor = function (index) {

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
    this.getFloorNames = function () {
        var names = new Array();
        for(var i = 0; i < this.model.floors.length;i++){
            names.push(this.model.floors[i].name);
        }
        return names;
    };
    this.getFloors = function () {
        return this.model.floors;
    };
    this.getFloorByName = function (name) {
        for(var i = 0; i < this.model.floors.length;i++){
            if(this.model.floors[i].name === name){
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
    return this;
};


