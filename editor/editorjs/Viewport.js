function Viewport(height, width, context, drawer) {
    this.context = context;
    this.drawer = drawer;
    this.height = height;
    this.width = width;
    this.offsetX = 0;
    this.offsetY = 0;
    this.zoomFactor = 1.1;
    this.zoomClickes = 0;
    this.moveData = {
        areaSize: undefined,
        imageData: undefined,
        moveState: 0,
        moveMethod: 1
    };
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
    this.zoom = function (clicks, x, y, noRedraw) {
        var oldFactor = 1 / Math.pow(this.zoomFactor, this.zoomClickes);
        var offsetX1 = Math.round(this.offsetX / oldFactor);
        var offsetY1 = Math.round(this.offsetY / oldFactor);
        var factor = Math.pow(this.zoomFactor, clicks);
        this.zoomClickes += clicks;
        this.context.scale(factor, factor);
        var newFactor = 1 / Math.pow(this.zoomFactor, this.zoomClickes);
        this.offsetX = Math.round(offsetX1 * newFactor);
        this.offsetY = Math.round(offsetY1 * newFactor);
        if (noRedraw === undefined || true) {
            this.drawer.redraw();
        }
    };
    this.resetZoom = function () {
        this.resetMove();
        var factor = Math.pow(this.zoomFactor, this.zoomClickes * -1);
        this.context.scale(factor, factor);
        this.zoomClickes = 0;
        this.drawer.redraw();
    };
    this.startCopyMove = function (x, y) {
        this.moveData.moveState = 1;
        this.moveData.areaSize = this.drawer.calcDrawingAreaSize();
        /*
         * FAKE SOME SHIT 
         */
        this.moveData.areaSize.min.x -= 10;
        this.moveData.areaSize.min.x -= 10;
        this.moveData.areaSize.max.x += 10;
        this.moveData.areaSize.max.y += 10;
        var offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = (Math.abs(this.moveData.areaSize.min.x) + Math.abs(this.moveData.areaSize.max.x));
        offscreenCanvas.height = (Math.abs(this.moveData.areaSize.min.y) + Math.abs(this.moveData.areaSize.max.y));
        var context = offscreenCanvas.getContext('2d');
        context.translate(this.moveData.areaSize.min.x * -1, this.moveData.areaSize.min.y * -1);
        switch (this.moveData.moveMethod) {
            case 1:
                this.drawer.drawAll(context);
                this.moveData.imageData = offscreenCanvas;
                break;
        }
    };
    this.endCopyMove = function () {
        this.drawer.redraw();
        this.moveData.moveState = 0;
        this.moveData.areaSize = undefined;
        this.moveData.imageData = undefined;
    };
    this.move = function (x, y) {

        switch (this.moveData.moveMethod) {
            case 0:
                this.clear();
                break;
            case 1:
                this.context.clearRect(
                        this.moveData.areaSize.min.x,
                        this.moveData.areaSize.min.y,
                        this.moveData.areaSize.max.x + Math.abs(this.moveData.areaSize.min.x),
                        this.moveData.areaSize.max.y + Math.abs(this.moveData.areaSize.min.y));
                break;
        }
        this.offsetX += x;
        this.offsetY += y;
        this.context.translate(x, y);

        switch (this.moveData.moveMethod) {
            case 0:
                this.drawer.redraw();
                break;
            case 1:
                this.context.drawImage(this.moveData.imageData, this.moveData.areaSize.min.x, this.moveData.areaSize.min.y);
                break;
        }
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

