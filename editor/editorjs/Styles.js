Styles = new function() {

    this.WallStyle = function(options) {
        return {
            "width": options.wallWidth,
            "color": options.wallColor
        };
    };
    this.DoorStyle = function(options) {
        return {
            "width": options.doorWidth,
            "color": options.doorColor
        };
    };
    this.WindowStyle = function(options) {
        return {
            "width": options.windowWidth,
            "color": options.windowColor
        };
    };
    this.PointStyle = function(options) {
        return {
            "color": options.pointColor,
            "lineWidth": options.pointLineWidth,
            "strokeStyle": options.pointStrokeStyle
        };
    };
    this.SelectedPointStyle = function(options) {
        return {
            "color": options.selectedPointColor,
            "lineWidth": options.selectedPointLineWidth,
            "strokeStyle": options.selectedPointStrokeStyle
        };
    };
    return this;
};

