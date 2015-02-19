function keys(editor, uioverlay) {
    $(document).on("keypress", function (e) {
        if (uioverlay.hasOpen()) {
            Debug.log(e);
            e.preventDefault();
            console.log(e.charCode);
            if (e.charCode === 119) {//w
                editor.createLine("wall");
            } else if (e.charCode === 102) {//f
                editor.createFloor();
            } else if (e.charCode === 100) {//d
                editor.createLine("door");
            } else if (e.charCode === 112) {//p
                editor.getDrawer().redraw();
            } else if (e.charCode === 108) {//l
                editor.getViewport().clear();
            } else if (e.charCode === 101) {//e
                uioverlay.open("#toString");
            } else if (e.charCode === 106) {//j
                uioverlay.open("#floorManager");
            } else if (e.charCode === 98) {//b
                uioverlay.open("#backgroundImage");
            } else if (e.charCode === 105) { //i
                uioverlay.open("#interFloorObjects");
            } else if (e.charCode === 73) {// I
                if (uiProps.equals("mouseMode", "interFloorSelectionMode")) {
                    uiProps.set("mouseMode", "points");
                } else {
                    uiProps.set("mouseMode", "interFloorSelectionMode");
                }
            } else if (e.charCode === 107) {//k
                if (confirm("Löschen?")) {
                    editor.getClean();
                }
            } else if (e.charCode === 115) {//s
                editor.createLine("window");
            } else if (e.charCode === 50) {//2
                uiProps.set("maxSelect", 2);
            } else if (e.charCode === 52) {//4
                uiProps.set("maxSelect", 4);
            } else if (e.charCode === 51) {//3
                editor.getViewport().resetZoom();
            } else if (e.charCode === 43) { //+
                editor.getViewport().zoom(3);
            } else if (e.charCode === 45) { //-
                editor.getViewport().zoom(-3);
            } else if (e.charCode === 99) { //c
                editor.getViewport().resetMove();
            } else if (e.charCode === 104) { //h
                uioverlay.open("#help");
            } else if (e.charCode === 117) { //u
                uiProps.set("autoSelect", !uiProps.get("autoSelect"));
            } else if (e.charCode === 120) { //x
                editor.delete();
            } else if (e.charCode === 88) { //X
                editor.delete(true);
            } else if (e.charCode === 118) { //v
                window.open("../index.html");
            } else if (e.charCode === 113) { //q
                uiProps.set("mouseMode", "movePoint");
            } else if (e.charCode === 116) { //t
                editor.getPointsManager().clearSelectedPoints();
            } else if (e.charCode === 122) { //z
                editor.getPointsManager().setPoints(editor.getModelManager().getAllPointsOnFloor(editor.getFloorIndex()));
                editor.getDrawer().redraw();
            } else if (e.charCode === 110) { //n
                if (uiProps.equals("mouseMode", "connectPathPoints")) {
                    uiProps.set("mouseMode", "points");
                } else {
                    uiProps.set("mouseMode", "connectPathPoints");
                }
            } else if (e.charCode === 228) { //ä
                if (uiProps.equals("mouseMode", "setPathPoint")) {
                    uiProps.set("mouseMode", "points");
                } else {
                    uiProps.set("mouseMode", "setPathPoint");
                }
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
                    editor.getViewport().move(+10, 0);
                } else {
                    editor.getViewport().move(50, 0);
                }
            } else if (e.keyCode === 37) { //[<-]
                if (e.shiftKey === true) {
                    editor.getViewport().move(-10, 0);
                } else {
                    editor.getViewport().move(-50, 0);
                }
            } else if (e.keyCode === 38) { //[^]
                if (e.shiftKey === true) {
                    editor.getViewport().move(0, -10);
                } else {
                    editor.getViewport().move(0, -50);
                }
            } else if (e.keyCode === 40) { //[v]
                if (e.shiftKey === true) {
                    editor.getViewport().move(0, 10);
                } else {
                    editor.getViewport().move(0, 50);
                }
            }
        }
        e.preventDefault();

    });
}