function Viewport(height, width, context, drawer) {
    this.context = context;
    this.drawer = drawer;
    this.height = height;
    this.width = width;
    this.offsetX = 0;
    this.offsetY = 0;
    this.zoomFactor = 1.1;
    this.zoomClickes = 0;
    this.clear = function () {
        var factor = this.getZoomFactor();
        this.context.clearRect(
                this.offsetX * -1,
                this.offsetY * -1,
                this.width * 1 / factor,
                this.height * 1 / factor);
    };

    this.getZoomFactor = function () {
        return Math.pow(this.zoomFactor, this.zoomClickes);
    };
    this.zoom = function (clicks) {
        var oldX = this.offsetX;
        var oldY = this.offsetY;
        this.resetMove();

        var factor = Math.pow(this.zoomFactor, clicks);
        this.zoomClickes += clicks;
        this.context.scale(factor, factor);
        this.move(oldX, oldY);
        this.drawer.redraw();
    };
    this.resetZoom = function () {
        this.resetMove();
        var factor = Math.pow(this.zoomFactor, this.zoomClickes * -1);
        this.context.scale(factor, factor);
        this.zoomClickes = 0;
        this.drawer.redraw();
    };
    this.move = function (x, y) {
        this.clear();
        this.offsetX += x;
        this.offsetY += y;
        this.context.translate(x, y);
        this.drawer.redraw();
    };
     this.moveRespectful = function (x, y) {
        var factor = Math.pow(this.zoomFactor, this.zoomClickes * -1);
        this.move(Math.round(x * factor), Math.round(y * factor)); 
    };
    this.resetMove = function () {
        this.clear();
        this.context.translate(this.offsetX * -1, this.offsetY * -1);
        this.offsetX = 0;
        this.offsetY = 0;
        this.drawer.redraw();
    };

    return this;
}

