//setup globle variables
var editor;
var ouioverlay;
//the name for the localstorage of the exports
var editorExportKey = "PieceofShit.exports";
$(document).ready(function() {
    //the canvas to which the editor will be attached
    var canvas = document.getElementById('canvas');
    //the canvas's context
    var context = canvas.getContext('2d');
    //set the canvas to use all available space
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    // create the editor (no option passed)
    editor = new Editor(canvas, {});
    //create the ui.overlay object (is used for the overlays eg. export/import/help)
    ouioverlay = new UiOverlay();
    //setup the key listeners
    keys(editor, ouioverlay);
    //setup the click listener for the canvas
    $("#canvas").on("click", function(e) {
        //check if the clicked point is already a used point
        isTarget = editor.targetIsPoint(e.pageX, e.pageY);
        if (isTarget !== false) {
            //select the clicked point
            editor.select(isTarget);
        } else {
            //add a new point
            editor.newPoint(e.pageX, e.pageY);
        }
    });
    //setup the scoll listner to trigger the zoom function DOMMouseScroll
    $("#canvas").on('DOMMouseScroll mousewheel', function(evt) {
        evt = evt.originalEvent;
        var delta = evt.wheelDeltaY ? evt.wheelDeltaY / 40 : evt.detail ? -evt.detail : 0;
        if (delta) {
            editor.zoom(delta, evt.clientX, evt.clientY);
        }
        return evt.preventDefault() && false;
    });
    //setup the coordinates display
    $(document).on("mousemove", function(e) {
        var c = editor.getCoordinates(e.pageX, e.pageY);
        $("#cords").html("x " + c.x + " y: " + c.y);
    });
    //setup the listener for the showen event on the oi-overlay with the id toString
    $("#toString").on("showen", function() {
        //convert the exportOjects to string and display them
        $("#textarea").val(editor.toString());
    });
    //setup the listener for the closed event on the oi-overlay with the id toString
    $("#toString").on("closed", function() {
        //load the exportObjects to the editor
        editor.load($("#textarea").val());
    });
    //set up the closed listener for theui-overlay with the id backgroundImage
    $("#backgroundImage").on("closed", function() {
        if ($('#backgroundImageInput').get(0).files[0] !== null && $('#backgroundImageInput').get(0).files[0] !== undefined){
            //create a new FileReader object
            var fr = new FileReader;
            //set an onLoaded function on the FileReader
            fr.onloadend = function(data) {
                //set the editors background image
                editor.setBackground(data.currentTarget.result);
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
        }
    }
});
