//setup globle variables
Debug.setLogging(true);
var editor;
var ouioverlay;
var uiProps;
var interFloorSelection;
var storage = new Storage();
var wasMove = false;
var selectDown;

$(document).ready(function () {
    interFloorSelection = new InterFloorSelection();
    //the canvas to which the editor will be attached
    var canvas = document.getElementById('canvas');
    //the canvas's context
    var context = canvas.getContext('2d');
    //set the canvas to use all available space
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    // create the editor 
    editor = new Editor(canvas, {});



    //set up the uiProps element
    uiProps = uiPropsSetUp();
    //create the ui.overlay object (is used for the overlays eg. export/import/help)
    uioverlay = new UiOverlay();
    //enable the close button
    uioverlay.enableAutoClose();
    //setup the key listeners
    keys(editor, uioverlay);
    //setup the click listener for the canvas
    $("#canvas").on("click", function (e) {
        if (wasMove) {
            wasMove = false;
            return;
        }
        if (BrowserFuckery.fixMouseEventButtons(e).bf_mouseButtons.isDown(1) && !e.ctrlKey) {
            //check if the clicked point is already a used point
            if (uiProps.equals("mouseMode", "movePoint")) {
                var target = editor.targetIsPoint(e.pageX, e.pageY);
                if (target === false) {
                    editor.movePoint(e.pageX, e.pageY);
                    storage.save();
                    editor.getPointsManager().clearSelectedPoints();
                } else {
                    editor.getPointsManager().toggle(target.x, target.y);
                }
            } else if (uiProps.equals("mouseMode", "movePathPoint")) {
                var target = editor.targetIsPathPoint(e.pageX, e.pageY);
                if (target === false) {
                    editor.moveVertex(editor.getPaths().selectedVertex, e.pageX, e.pageY);
                    storage.save();
                } else {
                    if (editor.getPaths().selectedVertex === target) {
                        editor.getPaths().selectedVertex = undefined;
                    } else {
                        editor.getPaths().selectedVertex = target;
                    }
                    editor.getDrawer().redraw();
                }
            } else if (uiProps.equals("mouseMode", "PathPoints")) {
                var target = editor.targetIsPathPoint(e.pageX, e.pageY);
                if (target === false) {
                    var xy = editor.getCoordinates(e.pageX, e.pageY);
                    $("#newPathPoint input[name='x']").val(xy.x);
                    $("#newPathPoint input[name='y']").val(xy.y);
                    uioverlay.open("#newPathPoint");
                } else {
                    alert(JSON.stringify(target));
                }
            } else if (uiProps.equals("mouseMode", "interFloorSelectionMode")) {
                var target = editor.targetIsPoint(e.pageX, e.pageY);
                if (target !== false) {
                    interFloorSelection.add(target.x, target.y, editor.getFloorIndex());
                }
            } else if (uiProps.equals("mouseMode", "edges")) {
                var target = editor.targetIsPathPoint(e.pageX, e.pageY);
                if (target !== false) {
                    editor.getEdgeSelection().select(target);
                    editor.getDrawer().redraw();
                    if (editor.getEdgeSelection().isReady() && !editor.getPaths().edgeExists(editor.getEdgeSelection().pointA, editor.getEdgeSelection().pointB)) {
                        $("#newPathEdge input[name='Ax']").val(editor.getEdgeSelection().pointA.x);
                        $("#newPathEdge input[name='Bx']").val(editor.getEdgeSelection().pointA.y);
                        $("#newPathEdge input[name='Ay']").val(editor.getEdgeSelection().pointB.x);
                        $("#newPathEdge input[name='By']").val(editor.getEdgeSelection().pointB.y);
                        uioverlay.open("#newPathEdge");
                    }
                }
            } else if (uiProps.equals("mouseMode", "autoWall") && uiProps.equals("maxSelect", 2)) {
                var target = editor.targetIsPoint(e.pageX, e.pageY);
                if (target !== false) {
                    editor.getPointsManager().toggle(target.x, target.y);
                } else {
                    var newPoint = editor.newPoint(e.pageX, e.pageY);
                    if (!uiProps.get("autoSelect")) {
                        editor.getPointsManager().toggle(newPoint.x, newPoint.y);
                    }
                }
                if (editor.getPointsManager().getSelectedPoints().length === 2) {
                    editor.createLine("wall");
                    storage.save();
                }
            } else {
                var target = editor.targetIsPoint(e.pageX, e.pageY);
                if (target === false) {
                    editor.newPoint(e.pageX, e.pageY);
                } else {
                    editor.getPointsManager().toggle(target.x, target.y);
                }
            }
        }
        Debug.log(e);
    });
    $("#canvas").mousemove(function (e) {
        var start = new Date().getTime();

        BrowserFuckery.fixMouseEventButtons(e);
        if (e.bf_mouseButtons.isDown(1) && !e.ctrlKey) {
            BrowserFuckery.fixMouseEventMovement(e);
            wasMove = true;
            editor.getViewport().moveRespectful(e.bf_mouseMovement.getX(), e.bf_mouseMovement.getY());
        } else if (e.bf_mouseButtons.isDown(1) && e.ctrlKey && uiProps.equals("mouseMode", "points")) {
            editor.getDrawer().redraw();
            editor.getDrawer().drawRect(selectDown,
                    editor.getViewport().translatePoint({x: e.pageX, y: e.pageY}),
                    editor.getDrawer().getStyle().mouseSelectionSquare
                    );
        }
        var end = new Date().getTime();
        var time = end - start;
        //console.log('------Execution time: ' + time);
    });
    $("#canvas").mousedown(function (e) {
        BrowserFuckery.fixMouseEventButtons(e);
        if (e.bf_mouseButtons.isDown(1) && e.ctrlKey && uiProps.equals("mouseMode", "points")) {
            selectDown = editor.getViewport().translatePoint({x: e.pageX, y: e.pageY});
        }
    });
    $("#canvas").mouseup(function (e) {
        if (BrowserFuckery.fixMouseEventButtons(e).bf_mouseButtons.isDown(1) && e.ctrlKey && uiProps.equals("mouseMode", "points")) {
            uiProps.set("maxSelect", -1);
            var a = selectDown, b = editor.getViewport().translatePoint({x: e.pageX, y: e.pageY});
            var points = editor.getPointsManager().getPointsInRange(
                    {x: Math.min(a.x, b.x), y: Math.min(a.y, b.y)},
            {x: Math.max(a.x, b.x), y: Math.max(a.y, b.y)}
            );
            for (var i = 0; i < points.length; i++) {
                editor.getPointsManager().select(points[i].x, points[i].y);
            }
            editor.getDrawer().redraw();
        }
    });

    //setup the scoll listner to trigger the zoom function DOMMouseScroll
    $("#canvas").on('DOMMouseScroll mousewheel', function (evt) {
        evt = evt.originalEvent;
        var delta = evt.wheelDeltaY ? evt.wheelDeltaY / 40 : evt.detail ? -evt.detail : 0;
        if (delta) {
            editor.getViewport().zoom(delta, evt.clientX, evt.clientY);
        }
        return evt.preventDefault();
    });

    //setup the coordinates display
    $(document).on("mousemove", function (e) {
        var c = editor.getCoordinates(e.pageX, e.pageY);
        $("#cords").html("x " + c.x + " y: " + c.y);
    });
    //on mode change
    uiProps.on("mouseMode", function (key, val) {
        $("#mouseMode").html(val);
    });
    $("#mouseMode").html(uiProps.get("mouseMode"));

    //setup the listener for the showen event on the oi-overlay with the id toString
    $("#toString").on("showen", function () {
        //convert the exportOjects to string and display them
        $("#textarea").val(editor.toString());
    });
    //setup the listener for the closed-apply event on the oi-overlay with the id toString
    $("#toString").on("closed-apply", function () {
        //load the exportObjects to the editor
        editor.load($("#textarea").val());
        editor.getDrawer().redraw();
    });
    /* FLOOR MANAGER */
    $("#floorManager").on("showen", function () {
        var list = editor.getModelManager().getFloors();
        $("#floorManagerSelectFloor").html("");
        $("#floorManagerTable").html("");
        for (var i = 0; i < list.length; i++) {
            var selected = "";
            if (editor.floorIndex === i) {
                selected = "selected=\"selected\"";
            }
            $("#floorManagerSelectFloor").append("<option value=\"" + i + "\"" + selected + ">" + list[i].name + "</option>");
            $("#floorManagerTable").append("<tr><td>" + list[i].name + "</td>"
                    + "<td>" + list[i].elements.length + "</td>"
                    + "<td><input class='offsetChanger' data-floorid='" + i + "' data-dimension='x' type='number' value='" + list[i].offset.x + "'></</td>"
                    + "<td><input class='offsetChanger' data-floorid='" + i + "' data-dimension='y' type='number' value='" + list[i].offset.y + "'></</td>"
                    + "<td><input class='offsetChanger' data-floorid='" + i + "' data-dimension='z' type='number' value='" + list[i].offset.z + "'></</td>"
                    + "<td>" + list[i].height + "</td><td class=\"center\"><button class='delete' data-floor='" + i + "'>&times;</button></td>"
                    + "<td class=\"center\"><button class='copy' data-floor='" + i + "'>&copy;</button></td></tr>");

        }

        $("#floorManagerSelectFloor").trigger("change");
        $("#floorManagerTable tr td button.delete").click(function (e) {
            editor.getModelManager().deleteFloor(e.currentTarget.dataset.floor);
            $("#floorManager").trigger("showen");
            storage.save();
        });
        $("#floorManagerTable tr td input.offsetChanger").on("change", function (e) {
            var val = parseInt($(this).val());
            var floor = editor.getModelManager().getFloor(e.currentTarget.dataset.floorid);
            switch (e.currentTarget.dataset.dimension) {
                case "x":
                    floor.offset.x = val;
                    break;
                case "y":
                    floor.offset.y = val;
                    break;
                case "z":
                    floor.offset.z = val;
                    break;
            }
            storage.save();
        });
        $("#floorManagerTable tr td button.copy").click(function (e) {
            var floor = (JSON.parse(JSON.stringify(editor.getModelManager().getFloor(e.currentTarget.dataset.floor))));
            floor.name = prompt("new floor name");
            editor.getModelManager().setFloor(editor.getModelManager().model.floors.length, floor);
            $("#floorManager").trigger("showen");
            storage.save();
        });

    });
    //setup listeners for the floor select object and the new floor button
    $("#floorManagerNewFloor").click(function () {
        editor.getModelManager().addFloor(prompt("name?"), parseInt(prompt("height?")), {"x": 0, "y": 0, "z": 0});
        $("#floorManager").trigger("showen");
    });
    $("#floorManagerSelectFloor").on("change", function (e) {
        editor.setFloorIndex(e.target.selectedIndex);
    });
    /* INTER FLOOR OBJECTS */
    $("#interFloorObjects").on("showen", function () {
        var list = interFloorSelection.points;
        $("#interFloorPointsTable").html("");
        for (var i = 0; i < list.length; i++) {
            $("#interFloorPointsTable").append("<tr><td>" + editor.getModelManager().getFloor(list[i].floorIndex).name + "</td><td>" + list[i].x + "</td><td>" + list[i].y + "</td><td><button class='delete' data-x='" + list[i].x + "' data-y='" + list[i].y + "' data-floorindex='" + list[i].floorIndex + "'>&times;</button></td></tr>");
        }
        $("#interFloorPointsTable tr td button.delete").click(function (e) {
            interFloorSelection.removeByValue(e.currentTarget.dataset.x, e.currentTarget.dataset.y, e.currentTarget.dataset.floorindex);
            $("#interFloorObjects").trigger("showen");
        });



        var objectLlist = editor.getInterFloorObjects().getObjects();
        ;
        $("#interFloorPointsObjectsTable").html("");
        for (var i = 0; i < objectLlist.length; i++) {
            $("#interFloorPointsObjectsTable").append("<tr><td>" + JSON.stringify(objectLlist[i]) + "</td><td class=\"center\"><button class='delete' data-index='" + i + "'>&times;</button></td></tr>");
        }
        $("#interFloorPointsObjectsTable tr td button.delete").click(function (e) {
            editor.getInterFloorObjects().remove(e.currentTarget.dataset.index);
            storage.save();
            $("#interFloorObjects").trigger("showen");
        });

    });
    $("#interFloorObjectsClear").click(function () {
        interFloorSelection.clear();
        $("#interFloorObjects").trigger("showen");
    });
    $("#interFloorObjectsNewWall").click(function () {
        if (interFloorSelection.getPoints().length === 2) {
            editor.getInterFloorObjects().add("wall", interFloorSelection.getPoints());
            storage.save();
            $("#interFloorObjects").trigger("showen");
        }

    });
    $("#interFloorObjectsNewFloor").click(function () {
        if (interFloorSelection.getPoints().length === 3 || interFloorSelection.getPoints().length === 4) {
            editor.getInterFloorObjects().add("floor", interFloorSelection.getPoints());
            storage.save();
            $("#interFloorObjects").trigger("showen");
        }

    });

    //new pathpoint dialog

    $("#newPathPoint").on("showen", function () {
        $("#newPathPoint input[name='name']").val("");
        $("#newPathPoint input[name='name']").focus();
        $("#newPathPoint input[name='public']").attr("checked", true);
        // $("#newPathPoint input[name='public']").val(1);
        $("#newPathPoint input[name='internalName']").val("");
        $("#newPathPoint input[name='description']").val("");
        $("#newPathPoint input[name='categories']").val("");
    });
    /*$("#newPathPoint").on("closed", function () {
     Debug.log("fuck fuck");
     });
     $("#newPathPoint").on("closed-apply", function () {
     Debug.log("fuck fuck apply");
     });*/
    $("#newPathPointOk").click(function () {
        //do shizzle
        Debug.log("doing shizzle");
        var point = {};
        point.name = $("#newPathPoint input[name='name']").val();
        Debug.log($("#newPathPoint input[name='public']").is(":checked"));
        point.public = $("#newPathPoint input[name='public']").is(":checked");
        point.internalName = $("#newPathPoint input[name='internalName']").val();
        point.internalName = point.internalName !== "" ? point.internalName : point.name;
        point.description = $("#newPathPoint input[name='description']").val();
        point.floorIndex = editor.getFloorIndex();
        point.x = parseInt($("#newPathPoint input[name='x']").val());
        point.y = parseInt($("#newPathPoint input[name='y']").val());
        var cats = $("#newPathPoint input[name='categories']").val();
        point.categories = cats !== "" ? cats.split(",") : [];
        editor.getPaths().addPoint(point);
        editor.getDrawer().drawPoint(point, editor.getDrawer().getStyle().vertexPoint);
        storage.save();
    });
    $("#newPathPoint input[name='public']").on("keypress", function (e) {
        if (e.charCode === 32 && $("#newPathPoint  input[name='public']").is(":focus")) {//[space]
            this.checked = !this.checked;
        }
    });
    $("#newPathPoint").on("keypress", function (e) {
        if (e.charCode === 13 && $("#newPathPoint").hasClass("showen")) {//[enter]
            $("#newPathPointOk").trigger("click");
        }
    });





    $("#PathPoints").on("showen", function () {
        $("#PathPointsPointsTable").html("");
        var list = editor.getPaths().vertices;
        for (var i = 0; i < list.length; i++) {
            $("#PathPointsPointsTable").append("<tr id=\"PathPointsPointsTableRow_" + i + "\">"
                    + "<td><input style=\"width:80px;\" type=\"text\" name=\"name\" value=\"" + list[i].name + "\"></td>"
                    + "<td><input style=\"width:80px;\" type=\"text\" name=\"x\" value=\"" + list[i].x + "\"></td>"
                    + "<td><input style=\"width:80px;\" type=\"text\" name=\"y\" value=\"" + list[i].y + "\"></td>"
                    + "<td><input style=\"width:80px;\" type=\"text\" name=\"floorIndex\" value=\"" + list[i].floorIndex + "\"></td>"
                    + "<td><input style=\"width:80px;\" type=\"text\" name=\"public\" value=\"" + (list[i].public ? "1" : "0") + "\"></td>"
                    + "<td><input style=\"width:80px;\" type=\"text\" name=\"internalName\" value=\"" + list[i].internalName + "\"></td>"
                    + "<td><input style=\"width:80px;\" type=\"text\" name=\"description\" value=\"" + list[i].description + "\"></td>"
                    + "<td><input style=\"width:80px;\" type=\"text\" name=\"categories\" value=\"" + (list[i].categories === undefined ? "" : list[i].categories.join(",")) + "\"></td>"
                    + "<td class=\"center\"><button class=\"save\">Save</button><td class=\"center\"><button class=\"delete\">&#10007;</button></td>"
                    + "<input type=\"hidden\" name=\"id\" value=\"" + i + "\">"
                    + "</tr>"
                    //+ "<td><button class='delete' data-floor='" + i + "'>&times;</button></td>"
                    );
        }
        $("#PathPointsPointsTable tr td button.save").click(function (e) {
            var tr = $(e.currentTarget).parent().parent();
            var id = parseInt($(e.currentTarget).parent().parent().find("input[name='id']").val());
            var vertex = editor.getPaths().vertices[id];
            Debug.log(vertex);
            vertex.name = $(tr).find("td input[name='name']").val();
            editor.getPaths().moveVertex(id,
                    parseInt($(tr).find("td input[name='x']").val()),
                    parseInt($(tr).find("td input[name='y']").val()),
                    parseInt($(tr).find("td input[name='floorIndex']").val()));
            vertex.public = parseInt($(tr).find("td input[name='public']").val()) === 1;
            vertex.internalName = $(tr).find("td input[name='internalName']").val();
            vertex.description = $(tr).find("td input[name='description']").val();
            var cats = $(tr).find("td input[name='categories']").val();
            vertex.categories = cats !== "" ? cats.split(",") : [];
            storage.save();
            editor.getDrawer().redraw();
        });
        $("#PathPointsPointsTable tr td button.delete").click(function (e) {
            var id = parseInt($(e.currentTarget).parent().parent().find("input[name='id']").val());
            editor.getPaths().removeVertex(id);
            storage.save();
            $("#PathPoints").trigger("showen");
            editor.getDrawer().redraw();
        });
    });






//########################################################
//########################################################
//########################################################
//#################### New Path Edge #####################
//########################################################
//########################################################
//########################################################

    $("#newPathEdge").on("showen", function () {
        //JUPM_MARK DGC
        $("#newPathEdge .gradientAB").css("background", "linear-gradient( to right, " + editor.getDrawer().getStyle().vertexSelectedPointA.color + ", " + editor.getDrawer().getStyle().vertexSelectedPointB.color + ")");
        $("#newPathEdge .gradientBA").css("background", "linear-gradient( to right, " + editor.getDrawer().getStyle().vertexSelectedPointB.color + ", " + editor.getDrawer().getStyle().vertexSelectedPointA.color + ")");
        $("#newPathEdge input[name='AB']").val("100");
        $("#newPathEdge input[name='AB']").focus();
        $("#newPathEdge input[name='BA']").val("");
        $("#newPathEdge input[name='internalDescription']").val("");
    });
    $("#newPathEdge").on("closed", function () {
        Debug.log("fuck fuck edge");
    });
    $("#newPathEdge #newPathEdgeOk").click(function () {
        //do shizzle
        Debug.log("doing edgy shizzle");
        var edge = {};
        edge.Ax = editor.getEdgeSelection().pointA.x;
        edge.Ay = editor.getEdgeSelection().pointA.y;
        edge.Bx = editor.getEdgeSelection().pointB.x;
        edge.By = editor.getEdgeSelection().pointB.y;
        edge.Afloor = editor.getEdgeSelection().pointA.floorIndex;
        edge.Bfloor = editor.getEdgeSelection().pointB.floorIndex;
        var AB = parseInt($("#newPathEdge input[name='AB']").val());
        var BA = $("#newPathEdge input[name='BA']").val();
        BA = BA === "" ? AB : parseInt(BA);
        edge.metric = [AB, BA];
        edge.public = $("#newPathEdge input[name='public']").is(":checked");
        edge.accessible = $("#newPathEdge input[name='accessible']").is(":checked");
        edge.internalDescription = $("#newPathEdge input[name='internalDescription']").val();
        editor.getPaths().addEdge(edge);
        editor.getDrawer().redraw();
        storage.save();
    });
    $("#newPathPoint input[name='public']").on("keypress", function (e) {
        if (e.charCode === 32 && $("#newPathEdge  input[name='public'], #newPathEdge input[name='accessible']").is(":focus")) {//[space]
            this.checked = !this.checked;
        }
    });
    $("#newPathEdge").on("keypress", function (e) {
        if (e.charCode === 13 && $("#newPathEdge").hasClass("showen")) {//[enter]
            $("#newPathEdgeOk").trigger("click");
        }
    });






    $("#PathEdges").on("showen", function () {
        $("#PathEdgesTable").html("");
        var list = editor.getPaths().edges;
        for (var i = 0; i < list.length; i++) {
            $("#PathEdgesTable").append("<tr>"
                    + "<td>Point names: " + editor.getPaths().getVertex(list[i].Ax, list[i].Ay, list[i].Afloor).name + " / " + editor.getPaths().getVertex(list[i].Bx, list[i].By, list[i].Bfloor).name + "</td>"
                    + "<td>x: " + list[i].Ax + ", y: " + list[i].Ay + ", floor: " + list[i].Afloor + "</td>"
                    + "<td>x: " + list[i].Bx + ", y: " + list[i].By + ", floor: " + list[i].Bfloor + "</td>"
                    + "<td><input name=\"metricAB\" value=\"" + list[i].metric[0] + "\"></td>"
                    + "<td><input name=\"metricBA\" value=\"" + list[i].metric[1] + "\"></td>"
                    + "<td class=\"center\"><input type=\"checkbox\" name=\"public\" " + (list[i].public ? "checked=\"checked\"" : "") + "></td>"
                    + "<td class=\"center\"><input type=\"checkbox\" name=\"accessible\" " + (list[i].accessible ? "checked=\"checked\"" : "") + "></td>"
                    + "<td><input name=\"internalDescription\" value=\"" + list[i].internalDescription + "\"></td>"
                    + "<td class=\"center\"><button class=\"save\">Save</button></td>"
                    + "<td class=\"center\"><button class=\"delete\">&#10007;</button></td>"
                    + "<input type=\"hidden\" name=\"i\" value=\"" + i + "\">"
                    + "</tr>"
                    );
        }
        $("#PathEdgesTable .save").click(function (e) {
            var tr = $(e.currentTarget).parent().parent();
            var id = parseInt($(e.currentTarget).parent().parent().find("input[name='i']").val());
            editor.getPaths().edges[id].public = $(tr).find("input[name='public']").is(":checked");
            editor.getPaths().edges[id].accessible = $(tr).find("input[name='accessible']").is(":checked");
            editor.getPaths().edges[id].internalDescription = $(tr).find("input[name='internalDescription']").val();
            editor.getPaths().edges[id].metric = new Array(
                    parseInt($(tr).find("input[name='metricAB']").val()),
                    parseInt($(tr).find("input[name='metricBA']").val())
                    );
            editor.getDrawer().redraw();
        });
        $("#PathEdgesTable tr td button.delete").click(function (e) {
            var id = parseInt($(e.currentTarget).parent().parent().find("input[name='i']").val());
            editor.getPaths().removeEdge(id);
            editor.getDrawer().redraw();
            $("#PathEdges").trigger("showen");
        });
    });
    $(".ui-overlay .controls .transparent").mouseenter(function () {
        $(".ui-overlay").css("opacity", "0.2");
    });
    $(".ui-overlay .controls .transparent").mouseleave(function () {
        $(".ui-overlay").css("opacity", "1");
    });
    //set up the closed listener for the ui-overlay with the id backgroundImage
    $("#backgroundImageInput").on("change", function () {
        if ($('#backgroundImageInput').get(0).files[0] !== null && $('#backgroundImageInput').get(0).files[0] !== undefined) {
            //create a new FileReader object
            var fr = new FileReader;
            //set an onLoaded function on the FileReader
            fr.onloadend = function (data) {
                //set the editors background image
                editor.getDrawer().setBackground(data.currentTarget.result);
            };
            //read from the input to a data uri
            fr.readAsDataURL($('#backgroundImageInput').get(0).files[0]);
        }
    });
    //load from localstorage
    storage.load();
    $(window).resize(function () {
        var canvas = document.getElementById('canvas');
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        editor.getDrawer().redraw();
    });
});
