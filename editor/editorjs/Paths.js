function Paths() {
    this.eges = [];
    //vertex = {x:1,y:1,"name":"roomXXX", "public":true, floorIndex:0, "internalName":"das ist der punkt bei dem wir nicht wissen wozu es ihn gibt","description":"Besenkammer"}
    this.vertices = [];

    this.addPoint = function (vertex) {
        this.vertices.push(vertex);
    };

    return this;
}
;