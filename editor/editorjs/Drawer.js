function Drawer(canvas, modelManager, pointsManager, paths, edgeSelection, style) {
    "use strict";

    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.modelManager = modelManager;

    this.paths = paths;
    this.edgeSelection = edgeSelection;
    this.pointsManager = pointsManager;
    this.pointsManager.setDrawer(this);

    this.viewport = new Viewport(canvas.height, canvas.width, this.context, this);

    this.backgroundImage = null;
    this.style = style;
    this.setStyle = function (style) {
        this.style = style;
        this.redraw();
    };
    this.getStyle = function () {
        return this.style;
    };

    this.selectedFloorIndex = 0;
    this.drawingParts = ["wall", "floor", "door", "window", "pathpoints", "pathedges", "points"];

    /*   DRAW   */
    this.drawRect = function (from, to, style) {
        this.context.beginPath();
        this.context.fillStyle = style.color;
        this.context.fillRect(from.x,
                from.y,
                to.x - from.x,
                to.y - from.y);
        this.context.strokeStyle = style.lineColor;
        this.context.lineWidth = style.lineWidth;
        this.context.rect(from.x,
                from.y,
                to.x - from.x,
                to.y - from.y);
        this.context.stroke();
        this.context.closePath();
    };
    this.drawFloor = function (floor, style) {
        var points = floor.points;
        this.context.beginPath();
        this.context.fillStyle = style.color;
        this.context.moveTo(points[0][0], points[0][1]);
        for (var i = 1; i < points.length; i++) {
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
     * @returns {undefined}
     */
    this.drawAll = function (context) {
        var oldContext = this.context;
        if (context) {
            this.context = context;
        }
        var drawLaterLines = {walls: [], doors: [], windows: []};
        for (var i = 0; i < modelManager.getFloorElements(this.selectedFloorIndex).length; i++) {
            var object = modelManager.getFloorElements(this.selectedFloorIndex)[i];
            if (object.type === "floor" && Arrays.boolInArray("floor", this.drawingParts)) {
                this.drawFloor(object, this.style.floor);
            } else if (object.type === "wall" && Arrays.boolInArray("wall", this.drawingParts)) {
                drawLaterLines.walls.push(object);
            } else if (object.type === "door" && Arrays.boolInArray("door", this.drawingParts)) {
                drawLaterLines.doors.push(object);
            } else if (object.type === "window" && Arrays.boolInArray("window", this.drawingParts)) {
                drawLaterLines.windows.push(object);
            }
        }
        for (var i = 0; i < drawLaterLines.walls.length; i++) {
            this.drawLine(drawLaterLines.walls[i], this.style.wall);
        }
        for (var i = 0; i < drawLaterLines.doors.length; i++) {
            this.drawLine(drawLaterLines.doors[i], this.style.door);
        }
        for (var i = 0; i < drawLaterLines.windows.length; i++) {
            this.drawLine(drawLaterLines.windows[i], this.style.window);
        }


        if (modelManager.getFloor(this.selectedFloorIndex).pathPoints !== undefined && Arrays.boolInArray("pathpoints", this.drawingParts)) {
            for (var i = 0; i < modelManager.getFloor(this.selectedFloorIndex).pathPoints.length; i++) {
                var object = modelManager.paths[i];
                this.drawPoint(object, this.style.pathPoint);
            }
        }
        if (Arrays.boolInArray("points", this.drawingParts)) {
            var points = this.pointsManager.getPoints();
            for (var i = 0; i < points.length; i++) {
                this.drawPoint(points[i], this.style.point);
            }
            points = this.pointsManager.getSelectedPoints();
            for (var i = 0; i < points.length; i++) {
                this.drawPoint(points[i], this.style.selectedPoint);
            }
        }
        if (Arrays.boolInArray("pathedges", this.drawingParts)) {
            for (var i = 0; i < this.paths.edges.length; i++) {
                if (this.paths.edges[i].Afloor === this.selectedFloorIndex && this.paths.edges[i].Bfloor === this.selectedFloorIndex) {
                    var e = this.paths.edges[i];
                    this.drawLine({"points": [[e.Ax, e.Ay], [e.Bx, e.By]]}, this.style.edge);
                }
            }
        }
        if (Arrays.boolInArray("pathpoints", this.drawingParts)) {

            for (var i = 0; i < this.paths.vertices.length; i++) {
                if (this.paths.vertices[i].floorIndex === this.selectedFloorIndex) {
                    this.drawPoint(this.paths.vertices[i], this.style.vertexPoint);
                }
            }
            if (this.edgeSelection.pointA && this.selectedFloorIndex === this.edgeSelection.pointA.floorIndex) {
                this.drawPoint(this.edgeSelection.pointA, this.style.vertexSelectedPointA);
            }
            if (this.edgeSelection.pointB && this.selectedFloorIndex === this.edgeSelection.pointB.floorIndex) {
                this.drawPoint(this.edgeSelection.pointB, this.style.vertexSelectedPointB);
            }
            if (this.paths.selectedVertex !== undefined) {
                this.drawPoint(this.paths.selectedVertex, this.style.vertexSelectedPoint);
            }
        }
        this.context = oldContext;
    };



    this.pushPoints = function (array, object) {
        for (var i = 0; i < object.points.length; i++) {
            array.push({"x": object.points[i][0], "y": object.points[i][1]});
        }
        return array;
    };
    this.redraw = function () {
        console.log("redraw")
        this.viewport.clear();
        if (this.backgroundImage !== null) {
            this.drawBackground();
        }
        this.drawAll();
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
    this.drawBackground = function (context) {
        if (this.backgroundImage) {
            if (context) {
                context.drawImage(this.backgroundImage, 0, 0);
            } else {
                this.context.drawImage(this.backgroundImage, 0, 0);
            }
        }
    };
    /*
     * SETTERS
     */
    this.setSelectedFloorIndex = function (index) {
        this.selectedFloorIndex = index;
    };
    this.setDrawingParts = function (s) {
        this.drawingParts = s;
    };
    /*
     * GETTERS
     */

    this.getViewport = function () {
        return this.viewport;
    };


    /*
     * calcDrawingAreaSize 
     */
    this.calcDrawingAreaSize = function () {
        var size = {"max": {"x": 0, "y": 0}, "min": {"x": 0, "y": 0}};
        if (Arrays.boolInArray("points", this.drawingParts)) {
            var points = this.pointsManager.getPoints();
            for (var i = 0; i < points.length; i++) {
                size.min.x = Math.min(size.min.x, points[i].x);
                size.max.x = Math.max(size.max.x, points[i].x);
                size.min.y = Math.min(size.min.y, points[i].y);
                size.max.y = Math.max(size.max.y, points[i].y);
            }
            points = this.pointsManager.getSelectedPoints();
            for (var i = 0; i < points.length; i++) {
                size.min.x = Math.min(size.min.x, points[i].x);
                size.max.x = Math.max(size.max.x, points[i].x);
                size.min.y = Math.min(size.min.y, points[i].y);
                size.max.y = Math.max(size.max.y, points[i].y);
            }
        }
        if (Arrays.boolInArray("pathedges", this.drawingParts)) {
            for (var i = 0; i < this.paths.edges.length; i++) {
                if (this.paths.edges[i].Afloor === this.selectedFloorIndex && this.paths.edges[i].Bfloor === this.selectedFloorIndex) {
                    var e = this.paths.edges[i];
                    size.min.x = Math.min(size.min.x, e.Ax);
                    size.max.x = Math.max(size.max.x, e.Ax);
                    size.min.y = Math.min(size.min.y, e.Ay);
                    size.max.y = Math.max(size.max.y, e.Ay);
                    size.min.x = Math.min(size.min.x, e.Bx);
                    size.max.x = Math.max(size.max.x, e.Bx);
                    size.min.y = Math.min(size.min.y, e.By);
                    size.max.y = Math.max(size.max.y, e.By);
                }
            }
        }
        if (Arrays.boolInArray("pathpoints", this.drawingParts)) {
            for (var i = 0; i < this.paths.vertices.length; i++) {
                size.min.x = Math.min(size.min.x, this.paths.vertices[i].x);
                size.max.x = Math.max(size.max.x, this.paths.vertices[i].x);
                size.min.y = Math.min(size.min.y, this.paths.vertices[i].y);
                size.max.y = Math.max(size.max.y, this.paths.vertices[i].y);
            }
        }
        if (this.backgroundImage) {
                size.min.x = Math.min(size.min.x, 0);
                size.max.x = Math.max(size.max.x, this.backgroundImage.width);
                size.min.y = Math.min(size.min.y, 0);
                size.max.y = Math.max(size.max.y, this.backgroundImage.height);
        }
        
        return size;
    };




}
