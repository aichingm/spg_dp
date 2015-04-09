function EdgeSelection() {
    this.pointA = null;
    this.pointB = null;

    this.select = function (point) {
        this.pointA = this.pointB;
        this.pointB = point;
    };
    this.unselectA = function (i) {
        this.pointA = null;
    };
    this.unselectB = function (i) {
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


