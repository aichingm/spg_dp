//setup globle variables
Debug.setLogging(true);
var editor;
var ouioverlay;
var uiProps;

//the name for the localstorage of the exports
var editorExportKey = "PieceofShit.exports";
$(document).ready(function () {
//the canvas to which the editor will be attached
    var canvas = document.getElementById('canvas');
    //the canvas's context
    var context = canvas.getContext('2d');
    //set the canvas to use all available space
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    // create the editor (no option passed)
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

//check if the clicked point is already a used point
        target = editor.targetIsPoint(e.pageX, e.pageY);
        if (target !== false) {
//select the clicked point
            if (e.ctrlKey) {
                //editor.getInterFloorPoints().handle(editor.points[isTarget].x, editor.points[isTarget].y, editor.getSelectetFloorIndex());
                // Debug.log(editor.getInterFloorPoints().getPoints());
            } else {
                editor.getPointsManager().toggle(target.x, target.y);
            }
        } else {
//add a new point
            if (uiProps.equals("mouseMode", "movePoint")) {
                editor.movePoint(e.pageX, e.pageY);
                uiProps.set("mouseMode", "points");
                Debug.log("movePoint");
            } else if (uiProps.equals("mouseMode", "setPathPoint")) {
                editor.createPathPoint(e.pageX, e.pageY);
            } else {
                editor.newPoint(e.pageX, e.pageY);
            }
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
    //setup the listener for the closed event on the oi-overlay with the id toString
    $("#toString").on("closed", function () {
//load the exportObjects to the editor
        editor.load($("#textarea").val());
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
                    + "<td>" + list[i].height + "</td><td><button class='delete' data-floor='" + i + "'>&times;</button></td>"
                    + "<td><button class='copy' data-floor='" + i + "'>&copy;</button></td></tr>");

        }

        $("#floorManagerSelectFloor").trigger("change");
        $("#floorManagerTable tr td button.delete").click(function (e) {
            editor.getModelManager().deleteFloor(e.currentTarget.dataset.floor);
            $("#floorManager").trigger("showen");
            localStorage.setItem(editorExportKey, editor.toString());

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
            localStorage.setItem(editorExportKey, editor.toString());
        });
        $("#floorManagerTable tr td button.copy").click(function (e) {
            var floor = (JSON.parse(JSON.stringify(editor.getModelManager().getFloor(e.currentTarget.dataset.floor))));
            floor.name = prompt("new floor name");
            editor.getModelManager().setFloor(editor.getModelManager().model.floors.length, floor);
            $("#floorManager").trigger("showen");
            localStorage.setItem(editorExportKey, editor.toString());

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
    /*$("#interFloorObjects").on("showen", function () {
     var list = editor.getInterFloorPoints().getPoints();
     $("#interFloorPointsTable").html("");
     for (var i = 0; i < list.length; i++) {
     $("#interFloorPointsTable").append("<tr><td>" + editor.getModelManager().getFloor(list[i].floor).name + "</td><td>" + list[i].x + "</td><td>" + list[i].y + "</td><td><button class='delete' data-x='" + list[i].x + "' data-y='" + list[i].y + "' data-floor='" + list[i].floor + "'>&times;</button></td></tr>");
     }
     $("#interFloorPointsTable tr td button.delete").click(function (e) {
     editor.getInterFloorPoints().unselect(e.currentTarget.dataset.x, e.currentTarget.dataset.y, e.currentTarget.dataset.floor);
     $("#interFloorObjects").trigger("showen");
     });
     
     
     
     
     });
     $("#interFloorObjectsClear").click(function () {
     editor.getInterFloorPoints().clear();
     $("#interFloorObjects").trigger("showen");
     });
     $("#interFloorObjectsNewWall").click(function () {
     editor.getModelManager().addInterFloorObject("wall", editor.getInterFloorPoints().getPoints());
     });
     $("#interFloorObjectsNewFloor").click(function () {
     editor.getModelManager().addInterFloorObject("floor", editor.getInterFloorPoints().getPoints());
     });*/




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
    //check if exportObjects are cached and if load them
    if (typeof (Storage) !== "undefined") {
        var exports = localStorage.getItem(editorExportKey);
        //check if they are valid
        if (exports !== null && exports !== undefined && exports.length > 0) {
            //load them
            editor.load(exports);
            editor.getDrawer().redraw(editor.floorIndex);
        }
    }
    $(window).resize(function () {
        var canvas = document.getElementById('canvas');
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        editor.getDrawer().redraw();
    });
});
