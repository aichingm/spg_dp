function Paths() {



    /*edge = {
        Ax: 1,
        Ay: 1,
        Bx: 1,
        By: 1,
        "metric": [100,200], //a->b, b->a
        "public": true,
        "accessible": true,
        "internalDescription": "jungs messt noch mal nach"
    };*/
    this.edges = [];
    /*vertex = {x: 1,
        y: 1,
        "name": "roomXXX",
        "public": true,
        "floorIndex": 0,
        "internalName": "das ist der punkt bei dem wir nicht wissen wozu es ihn gibt",
        "description": "Besenkammer"
    };*/
    this.vertices = [];

    this.addPoint = function (vertex) {
        this.vertices.push(vertex);
    };
    this.removePointIndex = function (index) {
        this.vertices.splice(index, 1);
    };
    this.save = function () {
        return {"vertices": this.vertices, "edges": this.edges};
    };
    this.load = function (data) {
        this.vertices = data.vertices;
        this.edges = data.edges;
    };
    return this;
}
;