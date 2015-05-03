function InterFloorSelection() {
    this.points = [];
    this.add = function (x, y, floorIndex) {
        this.points.push({"x": x, "y": y, "floorIndex": floorIndex});
    };

    this.remove = function (i) {
        this.points.splice(i, 1);
    };
    
    this.removeByValue = function(x,y,floorIndex){
        for(var i = 0; i < this.points.length;i++){
            Debug.log(this.points[i]);
            if(this.points[i].x == x && this.points[i].y == y && this.points[i].floorIndex == floorIndex){
                this.remove(i);
                return true;
            }
        }
        return false;
    };

    this.clear = function (){
        this.points = [];
    };
    
    this.getPoints = function(){
        return this.points;
    };
    return this;
}


