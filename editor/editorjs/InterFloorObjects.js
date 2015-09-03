function InterFloorObjects() {
    this.objects = [];
    this.add = function (type, points) {
        this.objects.push({"type": type, "points": Clone.cloneNoFuncs(points)});
    };

    this.remove = function (i) {
        this.objects.splice(i, 1);
    };

    this.clear = function () {
        this.objects = [];
    };
    this.getObjects = function(){
        return this.objects;
    };

    this.fromString = function (string) {
        this.objects = JSON.parse(string);
    };
    this.toString = function () {
        JSON.stringify(this.objects);
    };
    this.save = function () {
        return this.objects;
    };
    this.load = function (data) {
        this.objects = data;

    };
    return this;
}

