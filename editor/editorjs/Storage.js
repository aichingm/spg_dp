function Storage(settings) {
    this.settings = $.extend({"editorExportKey" : "PieceofShit.exports"},settings);
    
    this.save = function () {
        if (typeof (Storage) !== "undefined") {
            localStorage.setItem(this.settings.editorExportKey, editor.toString());
        }
    };
    this.load = function () {
        if (typeof (Storage) !== "undefined") {
            var exports = localStorage.getItem(this.settings.editorExportKey);
            if (exports !== null && exports !== undefined && exports.length > 0) {
                editor.load(exports);
                editor.getDrawer().redraw();
            }
        }
    };
}


