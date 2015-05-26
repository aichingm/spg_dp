function Runner() {
    this.velocity = 100;
    this.path = {simple: undefined, complex: undefined};
    this.lastPosition = undefined;
    this.currentPath = -1;
    this.position = {x: undefined, y: undefined, z: undefined};
    this.currentPathProgress = -1;
    this.state = 0; //0:undefined 1:running, 2:paused, 3:finished

    this.calculatePosition = function (passedTime) {
        //TODO respect metric in any kind
        if (this.state !== 3){
            var v = Math.min(this.velocity * passedTime / 1000, this.path.complex[this.currentPath].length - this.currentPathProgress);
            this.position.x += this.path.complex[this.currentPath].unitVector.x * v;
            this.position.y += this.path.complex[this.currentPath].unitVector.y * v;
            this.position.z += this.path.complex[this.currentPath].unitVector.z * v;
            this.currentPathProgress += v;
            if (this.currentPathProgress >= this.path.complex[this.currentPath].length) {
                console.log("changing path");
                this.nextPath();
            }
            //TODO move on if time is left changing paths (the last move in a path does not use all posible time)
        }

    };
    this.moveToFirstPath = function () {
        this.state = 1;
        this.position.x = this.path.simple[0].x;
        this.position.y = this.path.simple[0].y;
        this.position.z = this.path.simple[0].z;
        this.currentPath = 0;
        this.currentPathProgress = 0;
    };
    this.nextPath = function () {
        this.currentPath++;
        if (this.currentPath >= this.path.complex.length) {
            this.state = 3;
            console.log("fuck yeah")
            return;
        }
        this.position.x = this.path.simple[this.currentPath].x;
        this.position.y = this.path.simple[this.currentPath].y;
        this.position.z = this.path.simple[this.currentPath].z;
        this.currentPathProgress = 0;
    };
    return this;
}