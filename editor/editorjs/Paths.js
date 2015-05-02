function Paths() {



    /*edge = {
     Ax: 1,
     Ay: 1,
     Bx: 1,
     By: 1,
     Afloor: 0
     Bfloor: 1
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
    this.selectedVertex;
    
    this.getIndex = function (vertex) {
        console.log(vertex)
        for(var i = 0; i < this.vertices.length; i++){
            if (this.vertices[i].x === vertex.x && this.vertices[i].y === vertex.y && this.vertices[i].floorIndex === vertex.floorIndex) {
                return i;
            }
        }
        return -1;
    };
    
    this.addPoint = function (vertex) {
        this.vertices.push(vertex);
    };
    this.addEdge = function (edge) {
        this.edges.push(edge);
    };
    this.moveVertex = function (index, newX, newY, newFloor) {
        var oldX = this.vertices[index].x;
        var oldY = this.vertices[index].y;
        var oldFloor = this.vertices[index].floorIndex;
        for (var i = 0; i < this.edges.length; i++) {
            if (this.edges[i].Ax === oldX && this.edges[i].Ay === oldY && this.edges[i].Afloor === oldFloor) {
                this.edges[i].Ax = newX;
                this.edges[i].Ay = newY;
                this.edges[i].Afloor = newFloor;
            } else if (this.edges[i].Bx === oldX && this.edges[i].By === oldY && this.edges[i].Bfloor === oldFloor) {
                this.edges[i].Bx = newX;
                this.edges[i].By = newY;
                this.edges[i].Bfloor = newFloor;
            }
        }
        this.vertices[index].x = newX;
        this.vertices[index].y = newY;
        this.vertices[index].floorIndex = newFloor;

    };
    this.removeVertex = function (index) {
        var x = this.vertices[index].x;
        var y = this.vertices[index].y;
        var floor = this.vertices[index].floorIndex;
        for (var i = 0; i < this.edges.length; i++) {
            if (this.edges[i].Ax === x && this.edges[i].Ay === y && this.edges[i].Afloor === floor
                    ||
                    this.edges[i].Bx === x && this.edges[i].By === y && this.edges[i].Bfloor === floor
                    ) {
                this.edges.splice(i, 1);
            }
        }
        this.vertices.splice(index, 1);
    };
    this.removeEdge = function (index) {
        if(this.edges.length > index && index > -1){
            this.edges.splice(index, 1);
        }
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