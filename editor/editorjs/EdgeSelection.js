function EdgeSelection() {
    this.pointA = null;
    this.pointB = null;

    this.select = function (point) {
        this.pointB = this.pointA;
        this.pointA = point;
    };
    this.unselectA = function () {
        this.pointA = null;
    };
    this.unselectB = function () {
        this.pointB = null;
    };
    this.clear = function () {
        this.pointA = null;
        this.pointB = null;
    };
    this.isReady = function () {
        return this.pointA !== null && this.pointB !== null;
    };
    return this;
}


