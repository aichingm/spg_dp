function Editor(canvas, options) {
    this.init = function (canvas, options) {
        this.options = $.extend(new DefaultOptions(), options);
        this.canvas = canvas;
        this.floorIndex = 0;
        this.modelManager = new ModelManager();
        this.pointsManager = new PointsManager();
        this.paths = new Paths();
        this.edgeSelection = new EdgeSelection();
        this.drawer = new Drawer(canvas, this.modelManager, this.pointsManager, this.paths, this.edgeSelection);
        this.interFloorObjects = new InterFloorObjects();
    };
    this.init(canvas,options);
    /*   POINTS   */

    this.newPoint = function (x, y) {
        var factor = this.drawer.getViewport().getZoomFactor();
        var X = Math.round(1 / factor * x) + this.drawer.getViewport().offsetX * -1;
        var Y = Math.round(1 / factor * y) + this.drawer.getViewport().offsetY * -1;
        this.pointsManager.add(X, Y, this.options.autoSelect);
    };

    this.movePoint = function (x, y) {
        if (this.pointsManager.selectedPoints.length === 1) {
            var factor = this.drawer.getViewport().getZoomFactor();
            var elements = this.modelManager.getFloorElements(this.floorIndex);
            var X = Math.round(1 / factor * x) + this.drawer.getViewport().offsetX * -1;
            var Y = Math.round(1 / factor * y) + this.drawer.getViewport().offsetY * -1;
            var selectedPoint = this.pointsManager.getSelectedPointsAsArrays()[0];
            for (var i = 0; i < elements.length; i++) {
                for (var j = 0; j < elements[i].points.length; j++) {
                    if (elements[i].points[j][0] === selectedPoint[0] && elements[i].points[j][1] === selectedPoint[1]) {
                        elements[i].points[j] = [X, Y];
                    }
                }
            }
            this.pointsManager.remove(selectedPoint[0], selectedPoint[1]);
            this.pointsManager.add(X, Y, false);
            this.drawer.redraw();
        }
    };
    /*   CREATE   */
    this.createFloor = function () {
        var selectedPoints = this.pointsManager.getSelectedPoints();
        if (selectedPoints.length > 2) {
            var object = {"type": "floor"};
            object.points = new Array();
            for (var i = 0; i < selectedPoints.length; i++) {
                object.points.push(new Array(selectedPoints[i].x, selectedPoints[i].y));
            }
            this.getModelManager().getFloorElements(this.floorIndex).push(object);
            this.getDrawer().drawFloor(object, FloorStyle);
        }
    };
    this.createPathPoint = function (x, y) {
        var object = {"x": x, "y": y, "connections": []};
        this.modelManager.paths.push(object);
        this.drawPoint(object, Styles.PathStyle(this.options));
    };
    this.createLine = function (type) {
        var selectedPoints = this.pointsManager.getSelectedPoints();
        if (selectedPoints.length === 2) {
            var object = {"type": type};
            object.points = new Array();
            object.points.push(new Array(selectedPoints[0].x, selectedPoints[0].y));
            object.points.push(new Array(selectedPoints[1].x, selectedPoints[1].y));
            this.getModelManager().getFloorElements(this.floorIndex).push(object);
            var style;
            switch (type) {
                case "window":
                    style = WindowStyle;
                    break;
                case "door":
                    style = DoorStyle;
                    break;
                case "wall":
                    style = WallStyle;
                    break;
            }
            this.getDrawer().drawLine(object, style);
        }
    };
    this.delete = function (fuzzy) {
        var selectedPoints = this.pointsManager.getSelectedPointsAsArrays();
        var indices = new Array();
        var elements = this.getModelManager().getFloorElements(this.floorIndex);
        for (var i = 0; i < elements.length; i++) {
            if (Arrays.containsEqualItems(selectedPoints, elements[i].points) || (fuzzy && Arrays.countSameItems(selectedPoints, elements[i].points) > 0)) {
                indices.push(i);
            }
        }
        this.getModelManager().setFloorElemets(this.floorIndex, Arrays.deleteIndicesFromArray(elements, indices));
        this.getPointsManager().setPoints(this.getModelManager().getAllPointsOnFloor(this.floorIndex));
        this.getDrawer().redraw();
    };


    /*   RESET TO NEW   */
    this.getClean = function () {
        this.modelManager.init();
        this.pointsManager.clear();
        this.interFloorObjects.clear();
        this.drawer.getViewport().clear();
        this.floorIndex = 0;
    };
    /*   MISC   */
    this.targetIsPoint = function (x, y) {
        var xy = this.getCoordinates(x, y);
        for (var i = 0; i < this.pointsManager.getPoints().length; i++) {
            var X = this.pointsManager.getPoints()[i].x;
            var Y = this.pointsManager.getPoints()[i].y;
            var d = Math.sqrt((X -= xy.x) * X + (Y -= xy.y) * Y) < 8;
            if (d === true) {
                return this.pointsManager.getPoints()[i];
            }
        }
        return false;
    };
    this.targetIsPathPoint = function (x, y) {
        var xy = this.getCoordinates(x, y);
        for (var i = 0; i < this.paths.vertices.length; i++) {
            var X = this.paths.vertices[i].x;
            var Y = this.paths.vertices[i].y;
            var d = Math.sqrt((X -= xy.x) * X + (Y -= xy.y) * Y) < 10;
            if (d === true && this.paths.vertices[i].floorIndex === this.getFloorIndex()) {
                return this.paths.vertices[i];
            }
        }
        return false;
    };
    this.getCoordinates = function (x, y) {
        var factor = this.getViewport().getZoomFactor();
        return {"x": Math.round(1 / factor * x) + this.getViewport().offsetX * -1, "y": Math.round(1 / factor * y) + this.getViewport().offsetY * -1};
    };
    /*
     * GETTERS
     */
    this.getPointsManager = function () {
        return this.pointsManager;
    };
    this.getInterFloorObjects = function () {
        return this.interFloorObjects;
    };
    this.getModelManager = function () {
        return this.modelManager;
    };
    this.getDrawer = function () {
        return this.drawer;
    };
    this.getPaths = function () {
        return this.paths;
    };
    this.getEdgeSelection = function () {
        return this.edgeSelection;
    };
    this.getViewport = function () {
        return this.getDrawer().getViewport();

    };
    this.getFloorIndex = function () {
        return this.floorIndex;
    };
    /*
     * SETTERS
     */
    this.setOptions = function (options) {
        this.options = $.extend(this.options, options);
    };
    this.setFloorIndex = function (index) {
        this.floorIndex = index;
        this.pointsManager.setPoints(this.modelManager.getAllPointsOnFloor(this.floorIndex));
        this.getDrawer().setSelectedFloorIndex(this.floorIndex);
        this.getDrawer().redraw();
    };
    /*   IMPORT/EXPORT   */
    this.toString = function () {
        var data = {"modelManager": this.modelManager.save(), "interFloorObjects": this.interFloorObjects.save(), "paths": this.paths.save()};
        return JSON.stringify(data);
    };
    this.load = function (text) {
        if (text !== "") {
            var data = JSON.parse(text);
            this.modelManager.load(data.modelManager);
            this.interFloorObjects.load(data.interFloorObjects);
            this.paths.load(data.paths);
            this.pointsManager.setPoints(this.modelManager.getAllPointsOnFloor(this.floorIndex));
        } else {
            this.init(this.canvas,this.options);
        }
    };
    return this;
}
;
