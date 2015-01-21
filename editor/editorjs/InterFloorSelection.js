InterFloorSelection = function () {
    this.points = new Array();
    this.select = function (x, y, floor) {
        this.points.push({"x": x, "y": y, "floor": floor});
    };
    this.unselect = function (x, y, floor) {
        for (var i = 0; i < this.points.length; i++) {
            if (this.points[i].y === y && this.points[i].x === x && this.points[i].floor === floor) {
                this.points.splice(i, 1);
                break;
            }
        }
    };
    this.handle = function (x, y, floor) {
        if (this.contains(x, y, floor)) {
            this.unselect(x, y, floor);
        } else {
            this.select(x, y, floor);
        }
    };
    this.contains = function (x, y, floor) {
        for (var i = 0; i < this.points.length; i++) {
            if (this.points[i].y === y && this.points[i].x === x && this.points[i].floor === floor) {
                return true;
            }
        }
        return false;
    };
    this.clear = function () {
        this.points = new Array();
    };
    this.getPoints = function () {
        return this.points;
    };
    return this;
};

