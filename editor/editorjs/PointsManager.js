function PointsManager(options) {

    this.options = $.extend({"maxSelect": 4}, options);
    this.points = new Array();
    this.selectedPoints = new Array();
    this.drawer;

    this.add = function (x, y, select) {
        var point = {"x": x, "y": y};
        this.points.push(point);
        if (select) {
            this.select(x, y);
        } else {
            console.log("new point");
            this.getDrawer().drawPoint(point, PointStyle);
        }
    };
    this.remove = function (x, y) {
        console.log(x, y, "---");

        for (var i = 0; i < this.points.length; i++) {
            var removeIndex = -1;
            if (this.points[i].x === x && this.points[i].y === y) {
                removeIndex = i;
                break;
            }

        }
        if (removeIndex !== -1) {
            var selectedIndex = this.isSelected(x, y);
            if (selectedIndex !== -1) {
                console.log("unselecting");
                this.unselect(selectedIndex);
            }
            console.log( this.points.length)
            this.points.splice(removeIndex, 1);
            console.log( this.points.length)
        }
        //TODO tell the drawer on which coordinates the redraw is needed
        this.getDrawer().redraw();
    };

    this.select = function (x, y) {
        if (this.isSelected(x, y) !== -1) {
            return;
        } else if (this.selectedPoints.length >= this.options.maxSelect) {
            console.log(this.options.maxSelect);
            while (this.selectedPoints.length >= this.options.maxSelect) {
                this.unselect(0);
            }
        }
        var point = {"x": x, "y": y};
        this.selectedPoints.push(point);
        this.getDrawer().drawPoint(point, SelectedPointStyle);
    };
    this.unselect = function (index) {
        if (index !== -1 && index < this.selectedPoints.length) {
            this.getDrawer().drawPoint(this.selectedPoints[index], PointStyle);
            this.selectedPoints.splice(index, 1);
        }
    };
    this.toggle = function (x, y) {
        var index = this.isSelected(x, y);
        if (index !== -1) {
            this.unselect(index);
        } else {
            this.select(x, y);
        }
    };

    this.isSelected = function (x, y) {
        for (var i = 0; i < this.selectedPoints.length; i++) {
            if (this.selectedPoints[i].x === x && this.selectedPoints[i].y === y) {
                return i;
            }
        }
        return -1;
    };
    this.clear = function () {
        this.points = new Array();
        this.getDrawer().redraw();
    };
    this.clearSelectedPoints = function () {
        while (this.selectedPoints.length > 0) {
                this.unselect(0);
            }
    };
    this.getSelectedPointsAsArrays = function () {
        var array = new Array();
        for (var i = 0; i < this.selectedPoints.length; i++) {
            array.push(new Array(this.selectedPoints[i].x, this.selectedPoints[i].y));
        }
        return array;
    };
    this.getSelectedPoints = function () {
        return this.selectedPoints;
    };
    this.getPoints = function () {
        return this.points;
    };
    this.setPoints = function (points) {
        this.points = points;
        this.clearSelectedPoints();
    };
    this.setDrawer = function (drawer) {
        this.drawer = drawer;
    };
    this.getDrawer = function () {
        return this.drawer;
    };
    this.setOptions = function (options) {
        this.options = $.extend(this.options, options);
        console.log(this.options);
    };
    return this;
}
;
