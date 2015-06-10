function keys(editor, uioverlay) {
    $(document).on("keypress", function (e) {
        if (uioverlay.hasOpen()) {
            Debug.log(e);
            e.preventDefault();
            Debug.log(e.charCode);
            if (e.charCode === 119) {//w
                editor.createLine("wall");
            } else if (e.charCode === 87) {//W
                uiProps.set("mouseMode", "autoWall");
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
                    document.location.reload(true);
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
                editor.deleteElements();
            } else if (e.charCode === 88) { //X
                editor.deleteElements(true);
            } else if (e.charCode === 118) { //v
                window.open("../index.html");
            } else if (e.charCode === 113) { //q
                if (uiProps.equals("mouseMode", "movePoint")) {
                    uiProps.set("mouseMode", "points");
                } else {
                    uiProps.set("mouseMode", "movePoint");
                }
            } else if (e.charCode === 81) { //Q
                if (uiProps.equals("mouseMode", "movePathPoint")) {
                    uiProps.set("mouseMode", "points");
                } else {
                    uiProps.set("mouseMode", "movePathPoint");
                }
            } else if (e.charCode === 116) { //t
                if (uiProps.equals("mouseMode", "edges")) {
                    editor.getEdgeSelection().clear();
                    editor.getDrawer().redraw();
                } else {
                    editor.getPointsManager().clearSelectedPoints();
                }
            } else if (e.charCode === 122) { //z
                if (uiProps.equals("mouseMode", "edges")) {
                    editor.getEdgeSelection().clear();
                    editor.getDrawer().redraw();
                } else {
                    editor.getPointsManager().setPoints(editor.getModelManager().getAllPointsOnFloor(editor.getFloorIndex()));
                }
                editor.getDrawer().redraw();
            } else if (e.charCode === 228) { //ä
                if (uiProps.equals("mouseMode", "PathPoints")) {
                    uiProps.set("mouseMode", "points");
                } else {
                    uiProps.set("mouseMode", "PathPoints");
                }
            } else if (e.charCode === 196) { //Ä
                uioverlay.open("#PathPoints");
            } else if (e.charCode === 79) { //O
                uioverlay.open("#modelSettings");
            } else if (e.charCode === 214) { //Ö
                uioverlay.open("#PathEdges");
            } else if (e.charCode === 246) { //ö
                editor.getEdgeSelection().clear();
                if (uiProps.equals("mouseMode", "edges")) {
                    uiProps.set("mouseMode", "points");
                } else {
                    uiProps.set("mouseMode", "edges");
                }
            } else if (e.charCode === 46) { //.
                if ($("#settings").hasClass("isIn")) {
                    $("#settings").removeClass("isIn");
                    $("#settings").animate({
                        right: "-200px"
                    }, 200);
                } else {
                    $("#settings").addClass("isIn");
                    $("#settings").animate({
                        right: "0px"
                    }, 200);
                }


            }

//fix this change to some kind of model observer pattern with change listener
            storage.save();
        }

    });
    $(document).keyup(function (e) {
        if (e.keyCode === 27) {
            if ($(".showen").length !== 0) { //[esc]
                uioverlay.close(".showen");
            } else if ($("#settings").hasClass("isIn")) {
                $("#settings").removeClass("isIn");
                $("#settings").animate({
                    right: "-200px"
                }, 200);
            }
        } else if ($(".showen").length === 0 && !$("#settings").hasClass("isIn")) {
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