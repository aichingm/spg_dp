function Simulation() {
    this.runners = [];
    this.runnersCount = 0;
    this.pathSegments = [];
    this.pathSegmentsShadow = {};
    this.elapsedTime = 0; //milliseconds


    this.addRunners = function (count, pathSegments, velocityFunction) {
        this.runnersCount += count;
        var i = 0, simple = [];

        for (i = 0; i < pathSegments.length; i++) {
            simple.push(pathSegments[i].a);
            this.pathSegmentsShadow[pathSegments[i].hash()] = i;
            this.pathSegments.push(pathSegments[i]);
        }
        simple.push(pathSegments[pathSegments.length - 1].b);
        for (i = 0; i < count; i++) {
            var r = new Runner();
            if (typeof velocityFunction === "function") {
                r.velocity = velocityFunction();
            }
            r.path.simple = simple;
            r.path.complex = pathSegments;
            r.moveToFirstPath();
            this.runners.push(r);
        }
    };

    this.run = function (deltaTime) {
        var i;
        for (i = 0; i < this.runners.length; i++) {
            this.runners[i].calculatePosition(deltaTime);
            if (this.runners[i].state === 3) {
                this.runners.splice(i, 1);
            }
        }
        this.elapsedTime += deltaTime;
        if (this.runners.length === 0) {
            throw "end";
        }
    };
    return this;
}