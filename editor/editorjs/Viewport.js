function Viewport(context, options) {
    this.context = context;
    this.options = options;
    this.zoomClickes = 0;
    this.clear = function() {
        var factor = this.zoomFactor();
        this.context.clearRect(
                this.options.offsetX * -1,
                this.options.offsetY * -1,
                canvas.width * 1 / factor,
                canvas.height * 1 / factor);
    };

    this.zoomFactor = function() {
        return Math.pow(this.options.zoomFactor, this.zoomClickes);
    };
    this.zoom = function(clicks) {
        this.resetMove();
        var factor = Math.pow(this.options.zoomFactor, clicks);
        this.zoomClickes += clicks;
        this.context.scale(factor, factor);
        this.redraw();
    };
    this.resetZoom = function() {
        this.resetMove();
        var factor = Math.pow(this.options.zoomFactor, this.zoomClickes * -1);
        this.context.scale(factor, factor);
        this.zoomClickes = 0;
        this.redraw();
    };
    this.move = function(x, y) {
        this.clear();
        this.options.offsetX += x;
        this.options.offsetY += y;
        this.context.translate(x, y);
        this.redraw();
    };
    this.resetMove = function() {
        this.clear();
        this.context.translate(this.options.offsetX * -1, this.options.offsetY * -1);
        this.options.offsetX = 0;
        this.options.offsetY = 0;
        this.redraw();
    };


}

