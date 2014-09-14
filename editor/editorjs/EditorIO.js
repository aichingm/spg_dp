EditorIO = new function() {
    this.load = function(editor, text) {
        var level = JSON.parse(text);
        editor.exportObjects = null;
        editor.exportObjects = new DefaultExportObject();
        for (var i = 0; i < level[0].elements.length; i++) {
            if (level[0].elements[i].type === "floor") {
                editor.exportObjects[level[0].elements[i].type].push(level[0].elements[i]);
            } else {
                editor.exportObjects.lines.push(level[0].elements[i]);
            }
        }
        editor.redraw();
    };
    this.toString = function(editor) {
        var level = {
            "floor": "ground0",
            "y": editor.options.defaultFloorHeight
        };
        var objects = new Array();
        for (var i = 0; i < editor.exportObjects.floor.length; i++) {
            var floor = editor.exportObjects.floor[i];
            floor.type = "floor";
            objects.push(floor);
        }
        for (var i = 0; i < editor.exportObjects.lines.length; i++) {
            var line = editor.exportObjects.lines[i];
            objects.push(line);
        }
        level.elements = objects;
        return JSON.stringify(new Array(level));
    };
    return this;
};