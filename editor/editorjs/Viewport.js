function Viewport(editor) {
    this.editor = editor;
    this.zoomClickes = 0;
    this.clear = function() {
        var factor = this.zoomFactor();
        this.editor.context.clearRect(
                this.editor.options.offsetX * -1,
                this.editor.options.offsetY * -1,
                canvas.width * 1 / factor,
                canvas.height * 1 / factor);
    };

    this.zoomFactor = function() {
        return Math.pow(this.editor.options.zoomFactor, this.zoomClickes);
    };
    this.zoom = function(clicks) {
        this.resetMove();
        var factor = Math.pow(this.editor.options.zoomFactor, clicks);
        this.zoomClickes += clicks;
        this.editor.context.scale(factor, factor);
        this.editor.redraw();
    };
    this.resetZoom = function() {
        this.resetMove();
        var factor = Math.pow(this.editor.options.zoomFactor, this.zoomClickes * -1);
        this.editor.context.scale(factor, factor);
        this.zoomClickes = 0;
        this.editor.redraw();
    };
    this.move = function(x, y) {
        this.clear();
        this.editor.options.offsetX += x;
        this.editor.options.offsetY += y;
        this.editor.context.translate(x, y);
        this.editor.redraw();
    };
    this.resetMove = function() {
        this.clear();
        this.editor.context.translate(this.editor.options.offsetX * -1, this.editor.options.offsetY * -1);
        this.editor.options.offsetX = 0;
        this.editor.options.offsetY = 0;
        this.editor.redraw();
    };

    return this;
}

