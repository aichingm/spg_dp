function Drawer(canvas, modelManager, pointsManager, paths) {

    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.modelManager = modelManager;

    this.paths = paths;
    this.pointsManager = pointsManager;
    this.pointsManager.setDrawer(this);

    this.viewport = new Viewport(canvas.height, canvas.width, this.context, this);

    this.backgroundImage = null;

    this.wallStyle = WallStyle;
    this.floorStyle = FloorStyle;
    this.doorStyle = DoorStyle;
    this.windowStyle = WindowStyle;
    this.pathPointStyle = PathPointStyle;
    this.selectedPointStyle = SelectedPointStyle;
    this.pointStyle = PointStyle;
    this.vertexPointStyle = VertexPointStyle;

    this.selectedFloorIndex = 0;

    /*   DRAW   */
    this.drawFloor = function (floor, style) {
        var points = floor.points;
        this.context.fillStyle = style.color;
        this.context.beginPath();
        this.context.moveTo(points[0][0], points[0][1]);
        for (i = 0; i < points.length; i++) {
            this.context.lineTo(points[i][0], points[i][1]);
        }
        this.context.fill();
        this.context.closePath();
    };
    this.drawLine = function (line, style) {
        var points = line.points;
        this.context.beginPath();
        this.context.lineWidth = style.width;
        this.context.strokeStyle = style.color;
        this.context.moveTo(points[0][0], points[0][1]);
        this.context.lineTo(points[1][0], points[1][1]);
        this.context.stroke();
        this.context.closePath();
    };
    this.drawPoint = function (point, style) {
        if (point.x === undefined || point.y === undefined) {
            console.error("not a point");
        }
        this.context.beginPath();
        this.context.arc(point.x, point.y, style.pointRadius, 0, 2 * Math.PI, false);
        this.context.fillStyle = style.color;
        this.context.fill();
        if (style.lineWidth !== undefined) {
            this.context.lineWidth = style.lineWidth;
            this.context.strokeStyle = style.strokeStyle;
            this.context.stroke();
        }
        this.context.closePath();
    };
    /**
     * 
     * @param {ModelManager} modelManager
     * @returns {Array}
     */
    this.drawAll = function (modelManager) {
        //var points = new Array();
        for (var i = 0; i < modelManager.getFloorElements(this.selectedFloorIndex).length; i++) {
            var object = modelManager.getFloorElements(this.selectedFloorIndex)[i];
            if (object.type === "floor") {
                this.drawFloor(object, this.floorStyle);
            } else if (object.type === "wall") {
                this.drawLine(object, this.wallStyle);
            } else if (object.type === "door") {
                this.drawLine(object, this.doorStyle);
            } else if (object.type === "window") {
                this.drawLine(object, this.windowStyle);
            }
            //this.pushPoints(points, object);
        }
        if (modelManager.getFloor(this.selectedFloorIndex).pathPoints !== undefined) {
            for (var i = 0; i < modelManager.getFloor(this.selectedFloorIndex).pathPoints.length; i++) {
                var object = modelManager.paths[i];
                this.drawPoint(object, this.pathPointStyle);
                //this.pushPoints(points, {points: {"x": object.x, "y": object.y}});
            }
        }
        var points = this.pointsManager.getPoints();
        for (var i = 0; i < points.length; i++) {
            this.drawPoint(points[i], this.pointStyle);
        }
        points = this.pointsManager.getSelectedPoints();
        for (var i = 0; i < points.length; i++) {
            this.drawPoint(points[i], this.selectedPointStyle);
        }
        for (var i = 0; i < this.paths.vertices.length; i++) {
            if(this.paths.vertices[i].floorIndex === this.selectedFloorIndex){
               this.drawPoint(this.paths.vertices[i], this.vertexPointStyle);
            }
        }

        //return points;
    };


    this.pushPoints = function (array, object) {
        for (i = 0; i < object.points.length; i++) {
            array.push({"x": object.points[i][0], "y": object.points[i][1]});
        }
        return array;
    };
    this.redraw = function () {
        this.viewport.clear();
        if (this.backgroundImage !== null) {
            this.drawBackground();
        }
        var points = this.drawAll(this.modelManager);
        //this.drawSelectionPoints(points, this.pointStyle);
    };


    /*   BACKGROUND   */
    this.setBackground = function (data) {
        var img = new Image;
        img.onload = function (drawer) {
            return function () {
                drawer.backgroundImage = img;
                drawer.redraw();
            };
        }(this);
        img.src = data;
    };
    this.drawBackground = function () {
        this.context.drawImage(this.backgroundImage, 0, 0);
    };
    /*
     * SETTERS
     */
    this.setSelectedFloorIndex = function (index) {
        this.selectedFloorIndex = index;
    };
    /*
     * GETTERS
     */

    this.getViewport = function () {
        return this.viewport;
    };
}