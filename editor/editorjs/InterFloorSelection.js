function InterFloorSelection() {
    this.points = [];
    this.add = function (x, y, floorIndex) {
        this.points.push({"x": x, "y": y, "floorIndex": floorIndex});
    };

    this.remove = function (i) {
        this.points.splice(i, 1);
    };
    return this;
}


