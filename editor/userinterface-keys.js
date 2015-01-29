function keys(editor, uioverlay) {
    $(document).on("keypress", function (e) {
        if (uioverlay.hasOpen()) {
            Debug.log(e);
            //e.preventDefault();
            console.log(e.charCode)
            if (e.charCode === 119) {//w
                editor.createLine("wall");
            } else if (e.charCode === 102) {//f
                editor.createFloor();
            } else if (e.charCode === 100) {//d
                editor.createLine("door");
            } else if (e.charCode === 112) {//p
                editor.redraw();
            } else if (e.charCode === 108) {//l
                editor.viewport.clear();
            } else if (e.charCode === 101) {//e
                uioverlay.open("#toString");
            } else if (e.charCode === 106) {//j
                uioverlay.open("#floorManager");
            } else if (e.charCode === 98) {//b
                uioverlay.open("#backgroundImage");
            } else if (e.charCode === 105) { //i
                uioverlay.open("#interFloorObjects");
            } else if (e.charCode === 107) {//k
                if (confirm("Löschen?")) {
                    editor.getClean();
                }
            } else if (e.charCode === 115) {//s
                editor.createLine("window");
            } else if (e.charCode === 50) {//2
                editor.setOptions({"maxSelect": 2});
            } else if (e.charCode === 52) {//4
                editor.setOptions({"maxSelect": 4});
            } else if (e.charCode === 51) {//3
                editor.viewport.resetZoom();
            } else if (e.charCode === 43) { //+
                editor.viewport.zoom(3);
            } else if (e.charCode === 45) { //-
                editor.viewport.zoom(-3);
            } else if (e.charCode === 99) { //c
                editor.viewport.resetMove();
            } else if (e.charCode === 104) { //h
                uioverlay.open("#help");
            } else if (e.charCode === 117) { //h
                editor.setOptions({"autoSelect": !editor.options.autoSelect});
            } else if (e.charCode === 120) { //x
                editor.delete();
            } else if (e.charCode === 88) { //X
                editor.delete(true);
            } else if (e.charCode === 118) { //v
                window.open("../index.html");
            } else if (e.charCode === 113) { //q
                uiProps.set("mode", "movePoint");
            }

            //fix this change to some kind of model observer pattern with change listener
            localStorage.setItem(editorExportKey, editor.toString());
        }

    });
    $(document).keyup(function (e) {
        if (e.keyCode === 27 && $(".showen").length !== 0) { //[esc]
            uioverlay.close(".showen");
        } else if ($(".showen").length === 0) {
            if (e.keyCode === 39) { //[->]
                if (e.shiftKey === true) {
                    editor.viewport.move(+10, 0);
                } else {
                    editor.viewport.move(50, 0);
                }
            } else if (e.keyCode === 37) { //[<-]
                if (e.shiftKey === true) {
                    editor.viewport.move(-10, 0);
                } else {
                    editor.viewport.move(-50, 0);
                }
            } else if (e.keyCode === 38) { //[^]
                if (e.shiftKey === true) {
                    editor.viewport.move(0, -10);
                } else {
                    editor.viewport.move(0, -50);
                }
            } else if (e.keyCode === 40) { //[v]
                if (e.shiftKey === true) {
                    editor.viewport.move(0, 10);
                } else {
                    editor.viewport.move(0, 50);
                }
            }
        }
        e.preventDefault();

    });
}