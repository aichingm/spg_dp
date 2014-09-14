EditorIO = new function() {
    this.load = function(editor, text) {
        var level = JSON.parse(text);
        editor.exportObjects = null;
        editor.exportObjects = new DefaultExportObject();
        for (var i = 0; i < level[0].elements.length; i++) {
            editor.exportObjects[level[0].elements[i].type].push(level[0].elements[i]);
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
        for (var i = 0; i < editor.exportObjects.wall.length; i++) {
            var wall = editor.exportObjects.wall[i];
            wall.type = "wall";
            objects.push(wall);
        }
        for (var i = 0; i < editor.exportObjects.window.length; i++) {
            var window = editor.exportObjects.window[i];
            window.type = "window";
            objects.push(window);
        }

        for (var i = 0; i < editor.exportObjects.door.length; i++) {
            var door = editor.exportObjects.door[i];
            door.type = "door";
            objects.push(door);
        }
        level.elements = objects;
        return JSON.stringify(new Array(level));
    };
    return this;
};