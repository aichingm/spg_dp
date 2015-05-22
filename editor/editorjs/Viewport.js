function Viewport(height, width, context, drawer) {
    this.context = context;
    this.drawer = drawer;
    this.height = height;
    this.width = width;
    this.offsetX = 0;
    this.offsetY = 0;
    this.zoomFactor = 1.1;
    this.zoomClickes = 0;
    this.copyImageData;
    this.copyMoveState = 0;
    this.copyMoveMethod = 1;
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
    this.startCopyMove = function (x, y) {
        this.copyMoveState = 1;
        this.areaSize = this.drawer.calcDrawingAreaSize();
        /*
         * FAKE SOME SHIT 
         */
        this.areaSize.min.x -= 10;
        this.areaSize.min.x -= 10;
        this.areaSize.max.x += 10;
        this.areaSize.max.y += 10;
        var offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = (Math.abs(this.areaSize.min.x) + Math.abs(this.areaSize.max.x));
        offscreenCanvas.height = (Math.abs(this.areaSize.min.y) + Math.abs(this.areaSize.max.y));
        var context = offscreenCanvas.getContext('2d');
        context.translate(this.areaSize.min.x * -1, this.areaSize.min.y * -1);

        this.drawer.drawAll(context);
        switch (this.copyMoveMethod) {
            case 0:
                this.copyImageData = offscreenCanvas;
                break;
            case 1:
                this.copyImageData = context.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
                break;
        }
    };
    this.copyMove = function (x, y) {
        this.clear();
        this.offsetX += x;
        this.offsetY += y;
        this.context.translate(x, y);
        switch (this.copyMoveMethod) {
            case 0:
                this.context.drawImage(this.copyImageData, this.areaSize.min.x, this.areaSize.min.y);
                break;
            case 1:
                this.context.putImageData(this.copyImageData,this.offsetX +this.areaSize.min.x, this.offsetY+this.areaSize.min.y);
                break;
        }
    };
    /*this.copyMoveRespectful = function (x, y) {
        var factor = Math.pow(this.zoomFactor, this.zoomClickes * -1);
        this.copyMove(Math.round(x * factor), Math.round(y * factor));
    };*/
    this.endCopyMove = function (x, y) {
        this.copyMoveState = 0;
        this.copyImageData = null;
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
    this.translatePoint = function (point) {
        var factor = Math.pow(this.zoomFactor, this.zoomClickes * -1);
        return {x: Math.round(point.x * factor) - this.offsetX, y: Math.round(point.y * factor) - this.offsetY};
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

