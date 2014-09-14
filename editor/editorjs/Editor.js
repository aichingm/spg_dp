function Editor(canvas, options) {
    this.optionsDefault = new DefaultOptions();
    this.options = $.extend(this.optionsDefault, options);
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.points = new Array();
    this.selectedPoints = new Array();
    this.exportObjects = new DefaultExportObject();
    this.backgroundImage = null;
    this.viewport = new Viewport(this.context, this.options);

    /*   POINTS   */
    this.newPoint = function(x, y) {
        var factor = this.getZoomFactor();
        this.points.push({"x": Math.floor(1 / factor * x) + this.options.offsetX * -1, "y": Math.floor(1 / factor * y) + this.options.offsetY * -1});
        if (this.options.autoSelect) {
            this.select(this.points.length - 1);
        } else {
            this.drawPoint(this.points[this.points.length - 1], new Styles.PointStyle(this.options));
        }
    };
    this.targetIsPoint = function(x, y) {
        var factor = this.getZoomFactor();
        x = Math.floor(1 / factor * x);
        y = Math.floor(1 / factor * y);
        var fuzzyness = 10;
        for (i = 0; i < this.points.length; i++) {
            if ((this.points[i].x > x + this.options.offsetX * -1 - fuzzyness && this.points[i].x < x + this.options.offsetX * -1 + fuzzyness)
                    && (this.points[i].y > y + this.options.offsetY * -1 - fuzzyness && this.points[i].y < y + this.options.offsetY * -1 + fuzzyness)) {
                return i;
            }
        }
        return false;
    };
    this.select = function(index) {
        if ($.inArray(index, this.selectedPoints) !== -1) {
            this.drawPoint(this.points[index], new Styles.PointStyle(this.options));
            this.selectedPoints = Arrays.removeFromArray(index, this.selectedPoints);
            return;
        } else if (this.selectedPoints.length === this.options.maxSelect) {
            this.drawPoint(this.points[this.selectedPoints[0]], new Styles.PointStyle(this.options));
            this.selectedPoints.shift();
        }
        this.selectedPoints.push(index);
        this.drawPoint(this.points[index], new Styles.SelectedPointStyle(this.options));
    };
    this.clearSelectedPoints = function() {
        debug.log("Do not use Editor.clearSelectedPoints you kann use Editor.redraw instead");
        for (var i = 0; i < this.selectedPoints.length; i++) {
            var index = this.selectedPoints[i];
            this.drawPoint(this.points[index], new Styles.PointStyle(this.options));
        }
        this.selectedPoints = new Array();
    };
    this.getSelectedPointsAsArrays = function() {
        var array = new Array();
        for (var i = 0; i < this.selectedPoints.length; i++) {
            array.push(new Array(this.points[this.selectedPoints[i]].x, this.points[this.selectedPoints[i]].y));
        }
        return array;
    };
    /*   CREATE   */
    this.createFloor = function() {
        if (this.selectedPoints.length > 2) {
            var object = {"type": "floor" + this.selectedPoints.length};
            object.points = new Array();
            for (var i = 0; i < this.selectedPoints.length; i++) {
                object.points.push(new Array(this.points[this.selectedPoints[i]].x, this.points[this.selectedPoints[i]].y));
            }
            this.exportObjects.floor.push(object);
            this.drawFloor(object);
        }
    };
    this.createLine = function(type) {
        if (this.selectedPoints.length === 2) {
            var object = {"type": type};
            object.points = new Array();
            object.points.push(new Array(this.points[this.selectedPoints[0]].x, this.points[this.selectedPoints[0]].y));
            object.points.push(new Array(this.points[this.selectedPoints[1]].x, this.points[this.selectedPoints[1]].y));
            this.exportObjects.lines.push(object);
            var style;
            switch (type) {
                case "window":
                    style = new Styles.WindowStyle(this.options);
                    break;
                case "door":
                    style = new Styles.DoorStyle(this.options);
                    break;
                case "wall":
                    style = new Styles.WallStyle(this.options);
                    break;
            }
            this.drawLine(object, style);
        }
    };
    this.delete = function(fuzzy) {
        var selectedPoints = this.getSelectedPointsAsArrays();
        var indices = new Array();
        for (var i = 0; i < this.exportObjects.floor.length; i++) {
            if (Arrays.containsEqualItems(selectedPoints, this.exportObjects.floor[i].points) || (fuzzy && Arrays.countSameItems(selectedPoints, this.exportObjects.floor[i].points) > 0)) {
                indices.push(i);
            }
        }
        this.exportObjects.floor = Arrays.deleteIndicesFromArray(this.exportObjects.floor, indices);
        indices = new Array();
        for (var i = 0; i < this.exportObjects.lines.length; i++) {
            if (Arrays.containsEqualItems(selectedPoints, this.exportObjects.lines[i].points) || (fuzzy && Arrays.countSameItems(selectedPoints, this.exportObjects.lines[i].points) > 0)) {
                indices.push(i);
            }
        }
        this.exportObjects.lines = Arrays.deleteIndicesFromArray(this.exportObjects.lines, indices);
        this.redraw();
    };
    /*   DRAW   */
    this.drawFloor = function(floor) {
        var points = floor.points;
        this.context.fillStyle = this.options.floorColor;
        this.context.beginPath();
        this.context.moveTo(points[0][0], points[0][1]);
        for (i = 0; i < points.length; i++) {
            this.context.lineTo(points[i][0], points[i][1]);
        }
        this.context.closePath();
        this.context.fill();
    };
    this.drawLine = function(line, options) {
        var points = line.points;
        this.context.beginPath();
        this.context.lineWidth = options.width;
        this.context.strokeStyle = options.color;
        this.context.moveTo(points[0][0], points[0][1]);
        this.context.lineTo(points[1][0], points[1][1]);
        this.context.stroke();
        this.context.closePath();
    };
    this.drawPoint = function(point, style) {
        this.context.beginPath();
        this.context.arc(point.x, point.y, 5, 0, 2 * Math.PI, false);
        this.context.fillStyle = style.color;
        this.context.fill();
        this.context.lineWidth = style.lineWidth;
        this.context.strokeStyle = style.strokeStyle;
        this.context.stroke();
        this.context.closePath();
    };
    this.drawArray = function(name) {
        var points = new Array();
        for (var i = 0; i < this.exportObjects[name].length; i++) {
            var object = this.exportObjects[name][i];
            if (object.type === "floor") {
                this.drawFloor(object);
            } else if (object.type === "wall") {
                this.drawLine(object, new Styles.WallStyle(this.options));
            } else if (object.type === "door") {
                this.drawLine(object, new Styles.DoorStyle(this.options));
            } else if (object.type === "window") {
                this.drawLine(object, new Styles.WindowStyle(this.options));
            }
            this.pushPoints(points, object);
        }
        return points;
    };
    this.redraw = function() {
        this.viewport.clear();
        var points = new Array();
        if (this.backgroundImage !== null) {
            this.drawBackground();
        }
        points = points.concat(this.drawArray("floor"));
        points = points.concat(this.drawArray("lines"));
        this.points = new Array();
        for (var i = 0; i < points.length; i++) {
            this.drawPoint(points[i], new Styles.PointStyle(this.options));
            this.points.push(points[i]);
        }
        this.selectedPoints = new Array();
    };
    this.pushPoints = function(array, object) {
        for (i = 0; i < object.points.length; i++) {
            array.push({"x": object.points[i][0], "y": object.points[i][1]});
        }
        return array;
    };
    this.movePoint = function(x, y) {
        if (this.selectedPoints.length === 1) {
        }
    };
    /*   OPTIONS   */
    this.setOptions = function(options) {
        this.clearSelectedPoints();
        this.options = $.extend(this.options, options);
    };
    /*   RESET TO NEW   */
    this.getClean = function() {
        this.points = new Array();
        this.exportObjects = new DefaultExportObject();
        this.selectedPoints = new Array();
        this.viewport.clear();
    };
    /*   BACKGROUND   */
    this.setBackground = function(data) {
        var img = new Image;
        img.onload = function(editor) {
            return function() {
                editor.backgroundImage = img;
                editor.redraw();
            };
        }(this);
        img.src = data;
    };
    this.drawBackground = function() {
        this.context.drawImage(this.backgroundImage, 0, 0);
    };
    /*   MISC   */
    this.getZoomFactor = function() {
        return this.viewport.zoomFactor();
    };
    this.getCoordinates = function(x, y) {
        var factor = this.getZoomFactor();
        return {"x": Math.floor(1 / factor * x) + this.options.offsetX * -1, "y": Math.floor(1 / factor * y) + this.options.offsetY * -1};
    };
    /*   IMPORT/EXPORT   */
    this.toString = function() {
        return EditorIO.toString(this);
    };
    this.load = function(text) {
        return EditorIO.load(this, text);
    };
    return this;
}
;
