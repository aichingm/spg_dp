function PathSegment() {
    this.a = {x: 0, y: 0, z: 0};
    this.b = {x: 0, y: 0, z: 0};
    this.maxRunners = Number.MAX_VALUE;
    this.currentRunners = 0;
    this.distance = undefined;
    this.unitVector = {x: 0, y: 0, z: 0};
    this.distanceVector = {x: 0, y: 0, z: 0};
    this.length = 0;
    this.unitLength = 0;
    this.hash = function () {
        return this.a.x + "|" + this.a.y + "|" + this.a.z + "|" + this.b.x + "|" + this.b.y + "|" + this.b.z + "|" + this.distance + "|" + this.maxRunners;
    };

    this.prepare = function () {
        this.distanceVector.x = this.b.x - this.a.x ;
        this.distanceVector.y = this.b.y - this.a.y;
        this.distanceVector.z = this.b.z - this.a.z;
        this.length = Math.sqrt(Math.pow(this.distanceVector.x,2) + Math.pow(this.distanceVector.y,2) + Math.pow(this.distanceVector.z,2));
        this.unitVector.x = this.distanceVector.x / this.length;
        this.unitVector.y = this.distanceVector.y / this.length;
        this.unitVector.z = this.distanceVector.z / this.length;
        //TODO add norm unit vector
        
    };

    return this;
}